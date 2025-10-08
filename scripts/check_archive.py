#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_ROOT = REPO_ROOT / "assets" / "archive"
APP_JS_PATH = REPO_ROOT / "js" / "app.js"

ARRAY_PATTERN = re.compile(r"const\s+ARCHIVE_FILES\s*=\s*\[(.*?)\]\s*;", re.S)
KEY_PATTERN = re.compile(r"(\b\w+\b)\s*:")


def extract_entries(source: str) -> list[dict]:
    match = ARRAY_PATTERN.search(source)
    if not match:
        raise RuntimeError("ARCHIVE_FILES definition not found in js/app.js")
    body = match.group(1)
    json_ready = KEY_PATTERN.sub(r'"\1":', body)
    try:
        return json.loads(f"[{json_ready}]")
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Failed to parse ARCHIVE_FILES: {exc}") from exc


def path_exists_case_sensitive(relative_path: str) -> bool:
    cleaned = Path(relative_path.split("?", 1)[0])
    current = REPO_ROOT
    for part in cleaned.parts:
        if part == "":
            continue
        try:
            entries = {child.name for child in current.iterdir()}
        except FileNotFoundError:
            return False
        if part not in entries:
            return False
        current = current / part
    return current.is_file()


def list_space_offenders(root: Path) -> list[str]:
    offenders: list[str] = []
    for path in root.rglob("*"):
        if path.name == ".DS_Store":
            continue
        if " " in path.name:
            offenders.append(str(path.relative_to(REPO_ROOT)))
    return offenders


def main() -> int:
    if not APP_JS_PATH.exists():
        print("js/app.js not found", file=sys.stderr)
        return 1

    entries = extract_entries(APP_JS_PATH.read_text(encoding="utf-8"))
    errors: list[str] = []

    for index, entry in enumerate(entries):
        prefix = f"ARCHIVE_FILES[{index}]"
        if not isinstance(entry, dict):
            errors.append(f"{prefix} is not an object literal")
            continue
        src = entry.get("src")
        if not src or not isinstance(src, str):
            errors.append(f"{prefix} is missing a string src property")
            continue
        if " " in src:
            errors.append(f"{prefix} contains whitespace in src: {src}")
        if "%" in src:
            errors.append(f"{prefix} contains encoded characters in src: {src}")
        if not src.startswith("assets/archive/"):
            errors.append(f"{prefix} must point inside assets/archive/: {src}")
        elif not path_exists_case_sensitive(src):
            errors.append(f"{prefix} points to a missing file: {src}")

    offences = list_space_offenders(ARCHIVE_ROOT)
    if offences:
        errors.append(
            "Files or folders containing spaces detected:\n" + "\n".join(f"  - {item}" for item in offences)
        )

    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
