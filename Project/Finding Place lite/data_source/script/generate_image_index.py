from __future__ import annotations

import json
import re
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
DATA_SOURCE_DIR = SCRIPT_DIR.parent
IMAGE_DIR = DATA_SOURCE_DIR / "indian_temples_img"
OUTPUT_FILE = DATA_SOURCE_DIR / "image_index.json"
VALID_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
IMAGE_NUMBER_PATTERN = re.compile(r"image_(\d+)", re.IGNORECASE)


def image_sort_key(path: Path) -> tuple[int, str]:
    match = IMAGE_NUMBER_PATTERN.search(path.stem)
    if match:
        return (int(match.group(1)), path.name.lower())
    return (10**9, path.name.lower())


def build_relative_web_path(path: Path) -> str:
    relative_path = path.relative_to(DATA_SOURCE_DIR.parent)
    return f"./{relative_path.as_posix()}"


def generate_index() -> dict[str, list[str]]:
    index: dict[str, list[str]] = {}

    if not IMAGE_DIR.exists():
        print(f"Error: Directory {IMAGE_DIR} not found.")
        return index

    for temple_path in sorted(p for p in IMAGE_DIR.iterdir() if p.is_dir()):
        images = [
            build_relative_web_path(image_path)
            for image_path in sorted(
                (file_path for file_path in temple_path.iterdir() if file_path.suffix.lower() in VALID_EXTENSIONS),
                key=image_sort_key,
            )
        ]

        if images:
            index[temple_path.name] = images
            print(f"Found {len(images)} images for {temple_path.name}")

    OUTPUT_FILE.write_text(json.dumps(index, indent=4), encoding="utf-8")
    print(f"Successfully generated index with {len(index)} temples at {OUTPUT_FILE}")
    return index


if __name__ == "__main__":
    generate_index()
