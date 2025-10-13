#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import List, Dict, Any

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".mp4", ".webp"}
VIDEO_EXTENSIONS = {".mp4", ".webm"}
MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024  # 100 MB

IGNORE_NAMES = {"archive.json", ".ds_store"}

_slug_re = re.compile(r"[_\-]+")
_space_re = re.compile(r"\s+")


def _humanize_segment(name: str) -> str:
    stem = name.rsplit(".", 1)[0]
    stem = _slug_re.sub(" ", stem)
    stem = stem.replace(".", " · ")
    stem = _space_re.sub(" ", stem).strip()
    if not stem:
        return ""
    if stem.isupper():
        return stem
    if stem and stem[0].islower():
        stem = stem[0].upper() + stem[1:]
    return stem.title() if " · " in stem else stem


def _humanize_path(relative: Path) -> str:
    parts = [p for p in relative.parts]
    if not parts:
        return ""
    dirs = parts[:-1]
    name = parts[-1]
    dir_title = " / ".join(_humanize_segment(part) for part in dirs if part)
    file_title = _humanize_segment(name)
    return f"{dir_title} / {file_title}" if dir_title else file_title


def _normalize_entry(path: Path, repo_root: Path, archive_root: Path) -> Dict[str, Any]:
    relative_repo = path.relative_to(repo_root)
    rel_posix = relative_repo.as_posix()
    if " " in rel_posix:
        raise RuntimeError(f"Whitespace detected in path: {rel_posix}")
    if "%" in rel_posix:
        raise RuntimeError(f"Encoded character detected in path: {rel_posix}")

    size = path.stat().st_size
    if size > MAX_FILE_SIZE_BYTES:
        raise RuntimeError(f"File exceeds 100MB limit: {rel_posix} ({size} bytes)")

    extension = path.suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise RuntimeError(f"Unsupported asset extension '{extension}' for {rel_posix}")

    relative_archive = path.relative_to(archive_root)
    entry = {
        "src": rel_posix,
        "title": _humanize_path(relative_archive),
        "type": "video" if extension in VIDEO_EXTENSIONS else "image",
    }
    return entry


def generate_manifest(repo_root: Path) -> List[Dict[str, Any]]:
    archive_root = repo_root / "assets" / "archive"
    if not archive_root.exists():
        raise RuntimeError("Archive directory not found: assets/archive")

    entries: List[Dict[str, Any]] = []
    for path in sorted(archive_root.rglob("*")):
        if not path.is_file():
            continue
        name_lower = path.name.lower()
        if name_lower in IGNORE_NAMES:
            continue
        entries.append(_normalize_entry(path, repo_root, archive_root))
    return entries


def write_manifest(output_path: Path, entries: List[Dict[str, Any]], indent: int = 2) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(entries, ensure_ascii=False, indent=indent) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate archive manifest JSON from on-disk assets.")
    parser.add_argument("--check", action="store_true", help="Verify the existing manifest matches generated content")
    parser.add_argument("--indent", type=int, default=2, help="Indent level for generated JSON")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    output_path = repo_root / "assets" / "archive" / "archive.json"

    expected_entries = generate_manifest(repo_root)

    if args.check:
        if not output_path.exists():
            print("Archive manifest missing. Run scripts/build_archive_manifest.py to create it.", file=sys.stderr)
            return 1
        current_entries = json.loads(output_path.read_text(encoding="utf-8"))
        if current_entries != expected_entries:
            print("Archive manifest is out of date. Run scripts/build_archive_manifest.py to refresh it.", file=sys.stderr)
            return 1
        return 0

    write_manifest(output_path, expected_entries, indent=args.indent)
    print(f"Wrote {len(expected_entries)} entries to {output_path.relative_to(repo_root)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
