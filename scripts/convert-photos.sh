#!/bin/bash
# convert-photos.sh — Convert raw JPEGs from photos_raw/ to WebP in src/assets/gallery/
# Uses cwebp (from libwebp, installed via Homebrew)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INPUT_DIR="$PROJECT_ROOT/photos_raw"
OUTPUT_DIR="$PROJECT_ROOT/src/assets/gallery"

QUALITY=80

if ! command -v cwebp &> /dev/null; then
  echo "Error: cwebp not found. Install with: brew install webp"
  exit 1
fi

if [ ! -d "$INPUT_DIR" ]; then
  echo "Error: photos_raw/ directory not found at $INPUT_DIR"
  exit 1
fi

echo "Converting photos from $INPUT_DIR → $OUTPUT_DIR"
echo "Quality: $QUALITY"
echo ""

for album_dir in "$INPUT_DIR"/*/; do
  [ -d "$album_dir" ] || continue

  album_name=$(basename "$album_dir")
  out_album="$OUTPUT_DIR/$album_name"
  mkdir -p "$out_album"

  echo "📁 Album: $album_name"

  count=1
  for jpg in "$album_dir"*.jpg "$album_dir"*.jpeg "$album_dir"*.JPG "$album_dir"*.JPEG; do
    [ -f "$jpg" ] || continue

    # Pad counter to 2 digits for sorting
    padded=$(printf "%02d" $count)
    out_file="$out_album/${album_name}-${padded}.webp"

    if [ -f "$out_file" ]; then
      echo "  ⏭  Skipping (exists): $(basename "$out_file")"
    else
      cwebp -q $QUALITY "$jpg" -o "$out_file" > /dev/null 2>&1

      orig_size=$(stat -f%z "$jpg" 2>/dev/null || echo "?")
      new_size=$(stat -f%z "$out_file" 2>/dev/null || echo "?")
      echo "  ✅ $(basename "$jpg") → $(basename "$out_file") (${orig_size} → ${new_size} bytes)"
    fi

    count=$((count + 1))
  done

  echo "  Total: $((count - 1)) photos"
  echo ""
done

echo "🎉 Done! All photos converted to WebP."
