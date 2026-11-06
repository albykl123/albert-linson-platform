"""FreeStack parser for ripienaar/free-for-dev Markdown catalogue."""

import re
from pathlib import Path
from typing import List, Dict, Any, Optional


def parse_free_for_dev_markdown(markdown_text: str) -> Dict[str, Any]:
    """
    Parse free-for-dev markdown into categorized developer services.
    Returns structured categories, services list, and statistics.
    """
    lines = markdown_text.splitlines()
    categories: Dict[str, List[Dict[str, Any]]] = {}
    current_category: Optional[str] = None
    current_service: Optional[Dict[str, Any]] = None

    # Matches "## Category Name"
    category_regex = re.compile(r"^##\s+(?!Table of Contents)(.+)$")
    # Matches "  * [Service Name](URL) - Description" or "  * [Service Name](URL)"
    service_regex = re.compile(r"^\s*\*\s+\[([^\]]+)\]\((https?://[^\)]+)\)(?:\s*[-–—]\s*(.+))?$")
    # Matches sub-bullets "    * [Sub-service](URL) - Desc" or "    * Sub-service - Desc"
    sub_bullet_regex = re.compile(r"^\s{3,}\*\s+(?:\[([^\]]+)\]\((https?://[^\)]+)\)\s*[-–—]\s*)?(.+)$")

    for line in lines:
        cat_match = category_regex.match(line)
        if cat_match:
            current_category = cat_match.group(1).strip()
            if current_category not in categories:
                categories[current_category] = []
            current_service = None
            continue

        if not current_category:
            continue

        srv_match = service_regex.match(line)
        if srv_match:
            name = srv_match.group(1).strip()
            url = srv_match.group(2).strip()
            desc = (srv_match.group(3) or "").strip()

            service_item = {
                "name": name,
                "url": url,
                "category": current_category,
                "description": desc,
                "sub_features": [],
            }
            categories[current_category].append(service_item)
            current_service = service_item
            continue

        if current_service and line.strip().startswith("*"):
            sub_match = sub_bullet_regex.match(line)
            if sub_match:
                sub_desc = sub_match.group(3).strip() if sub_match.group(3) else line.strip()
                current_service["sub_features"].append(sub_desc)
                if not current_service["description"]:
                    current_service["description"] = sub_desc

    all_services = []
    for cat, items in categories.items():
        for item in items:
            all_services.append(item)

    return {
        "total_categories": len(categories),
        "total_services": len(all_services),
        "categories": list(categories.keys()),
        "services": all_services,
    }


def parse_local_free_for_dev_file(filepath: Path) -> Dict[str, Any]:
    """Parse local repository file."""
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    text = filepath.read_text(encoding="utf-8", errors="ignore")
    return parse_free_for_dev_markdown(text)
