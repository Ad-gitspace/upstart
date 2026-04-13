from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from icrawler.builtin import BingImageCrawler

from generate_image_index import VALID_EXTENSIONS, generate_index, image_sort_key


SCRIPT_DIR = Path(__file__).resolve().parent
DATA_SOURCE_DIR = SCRIPT_DIR.parent
TEMPLE_LIST_FILE = DATA_SOURCE_DIR / "myList.json"
IMAGE_ROOT_DIR = DATA_SOURCE_DIR / "indian_temples_img"


# ------------------ ARGUMENTS ------------------
def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download and index temple images."
    )
    parser.add_argument("--min-images", type=int, default=5)
    parser.add_argument("--max-temples", type=int, default=None)
    parser.add_argument("--temple", action="append", default=[])
    parser.add_argument("--sleep-seconds", type=float, default=1.0)
    return parser.parse_args()


# ------------------ LOAD DATA ------------------
def load_temples() -> list[dict]:
    return json.loads(TEMPLE_LIST_FILE.read_text(encoding="utf-8"))


# ------------------ FILTER ------------------
def filter_temples(temples, requested_names, max_temples):
    if requested_names:
        requested = {name.lower() for name in requested_names}
        temples = [t for t in temples if t["name"].lower() in requested]

    if max_temples:
        temples = temples[:max_temples]

    return temples


# ------------------ EXISTING IMAGES ------------------
def list_existing_images(folder: Path):
    if not folder.exists():
        return []
    return [
        f for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in VALID_EXTENSIONS
    ]


# ------------------ DOWNLOAD FUNCTION ------------------
def download_images_for_temple(
    temple: dict,
    min_images: int,
    sleep_seconds: float,
):
    temple_name = temple["name"]

    folder = IMAGE_ROOT_DIR / temple_name
    folder.mkdir(parents=True, exist_ok=True)

    existing = list_existing_images(folder)

    if len(existing) >= min_images:
        print(f"[✓] {temple_name}: already has {len(existing)} images")
        return {
            "temple": temple_name,
            "existing": len(existing),
            "downloaded": 0,
            "final": len(existing),
        }

    needed = min_images - len(existing)

    print(f"[↓] Downloading {needed} images for {temple_name}")

    try:
        crawler = BingImageCrawler(storage={"root_dir": str(folder)})

        crawler.crawl(
            keyword=f"{temple_name} temple india",
            max_num=needed
        )

    except Exception as e:
        print(f"[!] Failed for {temple_name}: {e}")

    time.sleep(sleep_seconds)

    final_count = len(list_existing_images(folder))

    return {
        "temple": temple_name,
        "existing": len(existing),
        "downloaded": final_count - len(existing),
        "final": final_count,
    }


# ------------------ MAIN ------------------
def main():
    args = parse_args()

    temples = filter_temples(
        load_temples(),
        args.temple,
        args.max_temples
    )

    if not temples:
        print("No temples found.")
        return

    IMAGE_ROOT_DIR.mkdir(parents=True, exist_ok=True)

    summaries = []

    for temple in temples:
        result = download_images_for_temple(
            temple,
            args.min_images,
            args.sleep_seconds,
        )
        summaries.append(result)

    # Generate index after download
    generate_index()

    total_downloaded = sum(x["downloaded"] for x in summaries)
    completed = sum(1 for x in summaries if x["final"] >= args.min_images)

    print("\n========== SUMMARY ==========")
    print(f"Temples processed: {len(summaries)}")
    print(f"Images downloaded: {total_downloaded}")
    print(f"Completed temples: {completed}")


if __name__ == "__main__":
    main()