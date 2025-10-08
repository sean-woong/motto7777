#!/bin/sh
set -e
REPO_ROOT="$(cd -- "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git config core.hooksPath .githooks
  echo "Git hooks path set to .githooks"
else
  echo "Not inside a git repository" >&2
  exit 1
fi
