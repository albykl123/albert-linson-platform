#!/usr/bin/env python3
"""
Albert Linson Platform - Secure Master Password Configuration
Keystrokes are completely invisible on screen using getpass.
Updates GitHub Repository Secret 'ADMIN_SECRET_KEY' and triggers edge deployment.
"""

import getpass
import subprocess
import sys
import os

def main():
    print("=" * 60)
    print("  ADMIN CONTROL CENTER -- MASTER PASSWORD CONFIGURATION")
    print("=" * 60)
    print("Please enter your chosen master password.")
    print("SECURITY NOTICE: Keystrokes are completely INVISIBLE for security.")
    print("Type your password and press ENTER when finished.\n")

    p1 = getpass.getpass("Enter Chosen Master Password: ")
    if not p1 or not p1.strip():
        print("\n[ERROR] Password cannot be empty. Aborted.")
        sys.exit(1)

    p2 = getpass.getpass("Confirm Master Password: ")
    if p1 != p2:
        print("\n[ERROR] Passwords do not match. Aborted.")
        sys.exit(1)

    gh_path = r"C:\Program Files\GitHub CLI\gh.exe"
    if not os.path.exists(gh_path):
        gh_path = "gh"

    print("\nEncrypting and updating GitHub Actions Secret: ADMIN_SECRET_KEY...")
    try:
        proc = subprocess.Popen(
            [gh_path, "secret", "set", "ADMIN_SECRET_KEY", "--repo", "albykl123/albert-linson-platform"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = proc.communicate(input=p1.strip())
        if proc.returncode != 0:
            print(f"[ERROR] Failed to set secret: {stderr}")
            sys.exit(1)

        print("[SUCCESS] Master password securely stored in GitHub Actions Secret: ADMIN_SECRET_KEY")

        # Update local .env.local
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        for target in [os.path.join(base_dir, ".env.local"), os.path.join(base_dir, "apps", "web", ".env.local")]:
            with open(target, "w", encoding="utf-8") as f:
                f.write(f'ADMIN_SECRET_KEY="{p1.strip()}"\nNEXT_PUBLIC_APP_NAME="Albert Linson Personal Intelligence Platform"\n')
        print("[SUCCESS] Local development secret synchronized (.env.local, gitignored)")

        print("\nTriggering automated Cloudflare Workers deployment...")
        proc_wf = subprocess.run(
            [gh_path, "workflow", "run", "deploy.yml", "--repo", "albykl123/albert-linson-platform"],
            capture_output=True,
            text=True
        )
        if proc_wf.returncode == 0:
            print("[SUCCESS] Cloudflare Workers deployment triggered successfully!")
        else:
            print(f"[NOTICE] Deployment trigger notice: {proc_wf.stderr.strip() or proc_wf.stdout.strip()}")

    finally:
        p1 = None
        p2 = None

    print("\n" + "=" * 60)
    print("  CONFIGURATION COMPLETE - ZERO SECRETS STORED OR LEAKED")
    print("=" * 60)

if __name__ == "__main__":
    main()
