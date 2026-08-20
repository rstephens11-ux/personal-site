#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# resize-photos.sh — web-ify photos for the site
#
# USAGE: drop any photos into  photos/raw/  (make it if missing),
#        then run:   cd ~/personal-site && bash resize-photos.sh
#
# WHAT IT DOES: every image in photos/raw/ gets resized to
# 1600px wide (height keeps proportion), compressed as JPEG,
# and saved into photos/ — ready to use in your HTML.
# Originals stay untouched in photos/raw/.
# ═══════════════════════════════════════════════════════════════

cd "$(dirname "$0")"
mkdir -p photos/raw photos

shopt -s nullglob nocaseglob
files=(photos/raw/*.jpg photos/raw/*.jpeg photos/raw/*.png photos/raw/*.heic)

if [ ${#files[@]} -eq 0 ]; then
  echo "No photos found in photos/raw/ — drop some in there first."
  exit 0
fi

for f in "${files[@]}"; do
  name=$(basename "$f")
  out="photos/${name%.*}.jpg"
  sips -Z 1600 -s format jpeg -s formatOptions 80 "$f" --out "$out" >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    size=$(du -h "$out" | cut -f1)
    echo "✓ $name → $out ($size)"
  else
    echo "✗ couldn't process $name"
  fi
done

echo ""
echo "Done. Use them in work.html like this:"
echo '  <img src="photos/FILENAME.jpg" alt="describe the photo"'
echo '       style="width:100%;border:1px solid var(--line);margin:18px 0">'
