#!/usr/bin/env python3
"""
Albert Professional Email Automation — Quick Launcher
======================================================
Usage:
  python run.py          # Starts the interactive setup dashboard
  python run.py --check  # Runs instant CLI diagnostics
"""

import sys
from albert_email_setup.cli import main

if __name__ == "__main__":
    if len(sys.argv) == 1:
        # Default to launching dashboard server directly
        sys.argv.append("--server")
    main()
