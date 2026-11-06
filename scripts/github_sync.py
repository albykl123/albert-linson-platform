import ctypes
from ctypes import wintypes
import json
import urllib.request

# Define Windows API types for CredRead
class CREDENTIAL(ctypes.Structure):
    _fields_ = [
        ("Flags", wintypes.DWORD),
        ("Type", wintypes.DWORD),
        ("TargetName", wintypes.LPWSTR),
        ("Comment", wintypes.LPWSTR),
        ("LastWritten", wintypes.FILETIME),
        ("CredentialBlobSize", wintypes.DWORD),
        ("CredentialBlob", ctypes.POINTER(ctypes.c_byte)),
        ("Persist", wintypes.DWORD),
        ("AttributeCount", wintypes.DWORD),
        ("Attributes", ctypes.c_void_p),
        ("TargetAlias", wintypes.LPWSTR),
        ("UserName", wintypes.LPWSTR),
    ]

advapi32 = ctypes.windll.advapi32
CredRead = advapi32.CredReadW
CredRead.argtypes = [wintypes.LPCWSTR, wintypes.DWORD, wintypes.DWORD, ctypes.POINTER(ctypes.POINTER(CREDENTIAL))]
CredRead.restype = wintypes.BOOL

CredFree = advapi32.CredFree
CredFree.argtypes = [ctypes.c_void_p]

def get_github_token(target="gh:github.com:albykl123"):
    p_cred = ctypes.POINTER(CREDENTIAL)()
    if CredRead(target, 1, 0, ctypes.byref(p_cred)):
        try:
            cred = p_cred.contents
            blob = bytes(ctypes.string_at(cred.CredentialBlob, cred.CredentialBlobSize))
            return blob.decode('utf-8')
        finally:
            CredFree(p_cred)
    return None

token = get_github_token()
if not token:
    print("Could not retrieve token")
    exit(1)

print(f"Token retrieved successfully (length: {len(token)})")

req = urllib.request.Request(
    "https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator&sort=updated",
    headers={
        "Authorization": f"token {token}",
        "User-Agent": "Albert-Platform-Sync",
        "Accept": "application/vnd.github.v3+json"
    }
)

with urllib.request.urlopen(req) as resp:
    repos = json.loads(resp.read().decode('utf-8'))

print(f"\n--- Repositories for authenticated user ({len(repos)} found) ---")
clean_repos = []
for r in repos:
    clean_repo = {
        "id": r["id"],
        "name": r["name"],
        "full_name": r["full_name"],
        "private": r["private"],
        "html_url": r["html_url"],
        "description": r.get("description"),
        "language": r.get("language"),
        "stars": r.get("stargazers_count", 0),
        "forks": r.get("forks_count", 0),
        "is_fork": r.get("fork", False),
        "topics": r.get("topics", []),
        "updated_at": r.get("updated_at"),
        "pushed_at": r.get("pushed_at"),
        "default_branch": r.get("default_branch", "main")
    }
    clean_repos.append(clean_repo)
    visibility = "Private" if r["private"] else "Public"
    fork_badge = "[Fork]" if r["fork"] else "[Source]"
    desc_safe = str(r.get('description', '')).encode('ascii', 'replace').decode('ascii')
    print(f"- {r['name']} ({visibility}, {fork_badge}): {r['html_url']}")
    print(f"  Description: {desc_safe}")
    print(f"  Language: {r.get('language')} | Stars: {r.get('stargazers_count')} | Updated: {r.get('updated_at')}")
    print()

with open("packages/shared/github_repos.json", "w", encoding="utf-8") as f:
    json.dump(clean_repos, f, indent=2)

with open("apps/web/src/data/github_repos.json", "w", encoding="utf-8") as f:
    json.dump(clean_repos, f, indent=2)

print("Saved clean repository metadata to packages/shared/github_repos.json and apps/web/src/data/github_repos.json")
