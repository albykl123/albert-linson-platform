"""FreeStack sync utility script."""

import json
from pathlib import Path
import sys

# Ensure backend app is importable
backend_dir = Path(__file__).resolve().parent.parent / "apps" / "backend"
sys.path.insert(0, str(backend_dir))

from app.services.freestack.parser import parse_local_free_for_dev_file, parse_free_for_dev_markdown

def run_sync():
    candidates = [
        Path(r"C:\Users\sheeb\Documents\spicitifyextension\free-for-dev-repo\README.md"),
        Path(r"C:\Users\sheeb\Documents\spicitifyextension\FreeForDev-Personal\README.md"),
    ]
    
    repo_file = None
    for c in candidates:
        if c.exists():
            repo_file = c
            break

    if not repo_file:
        print("Error: No local free-for-dev README.md found.")
        sys.exit(1)

    print(f"Reading free-for-dev catalog from: {repo_file}")
    data = parse_local_free_for_dev_file(repo_file)
    data["synced_at"] = "2026-11-06T10:40:00Z"
    data["source_repo"] = "ripienaar/free-for-dev"
    data["source_url"] = "https://github.com/ripienaar/free-for-dev"
    data["commit_sha"] = "master-latest"

    out_file = Path(__file__).resolve().parent.parent / "packages" / "shared" / "freestack_data.json"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_file.write_text(json.dumps(data, indent=2), encoding="utf-8")

    web_data_file = Path(__file__).resolve().parent.parent / "apps" / "web" / "src" / "data" / "freestack_data.json"
    web_data_file.parent.mkdir(parents=True, exist_ok=True)
    web_data_file.write_text(json.dumps(data, indent=2), encoding="utf-8")

    print(f"Successfully synced {data['total_services']} services across {data['total_categories']} categories!")
    print(f"Output saved to: {out_file} and {web_data_file}")

if __name__ == "__main__":
    run_sync()
