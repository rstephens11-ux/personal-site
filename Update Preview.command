#!/bin/bash
# Rebuild locally. This script NEVER commits, pushes, or publishes.
set -eu
cd "$(dirname "$0")"
if [ ! -x .venv/bin/python ]; then
  UV="$(command -v uv || true)"
  if [ -z "$UV" ] && [ -x "$HOME/.hermes/bin/uv" ]; then UV="$HOME/.hermes/bin/uv"; fi
  if [ -z "$UV" ]; then
    printf '%s\n' 'Setup needed: ask Hermes to install the website authoring environment.'
    exit 1
  fi
  "$UV" venv .venv
  "$UV" pip install --python .venv/bin/python -r _authoring/requirements.txt
fi
if ! .venv/bin/python _authoring/build.py > .authoring-error.txt 2>&1; then
  if [ "${SITE_NO_OPEN:-0}" != 1 ]; then open -a TextEdit .authoring-error.txt; fi
  printf '%s\n' 'Preview NOT updated. Details are in .authoring-error.txt. Nothing was published.'
  exit 1
fi
printf '%s\n' 'Preview updated. Nothing was published.'
if [ "${SITE_NO_OPEN:-0}" != 1 ]; then open gardening.html; fi
