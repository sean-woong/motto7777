#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    import build_archive_manifest
except ImportError as exc:  # pragma: no cover - defensive
    print(f"Unable to import build_archive_manifest: {exc}", file=sys.stderr)
    sys.exit(1)


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    manifest_path = repo_root / "assets" / "archive" / "archive.json"

    try:
        expected_entries = build_archive_manifest.generate_manifest(repo_root)
    except Exception as error:  # pragma: no cover - guard for CLI use
        print(error, file=sys.stderr)
        return 1

    if not manifest_path.exists():
        print("Archive manifest missing. Run scripts/build_archive_manifest.py to create it.", file=sys.stderr)
        return 1

    try:
        current_entries = json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception as error:  # pragma: no cover
        print(f"Failed to parse existing archive manifest: {error}", file=sys.stderr)
        return 1

    if current_entries != expected_entries:
        print("Archive manifest is out of date. Run scripts/build_archive_manifest.py to refresh it.", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
