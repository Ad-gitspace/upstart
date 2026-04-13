import json
import re

file_path = r'c:\Users\xdrav\Desktop\AdSpace\My Programming\WebData\Project\Finding Place lite\data_source\myList.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_cite(obj):
    if isinstance(obj, str):
        # Remove [cite: X] or [cite: X, Y] etc.
        return re.sub(r'\s*\[cite:\s*[\d\s,]+\]', '', obj).strip()
    if isinstance(obj, dict):
        return {k: clean_cite(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [clean_cite(v) for v in obj]
    return obj

def has_valid_coordinates(item):
    if not isinstance(item, dict):
        return False
    coords = item.get('coordinates')
    if not isinstance(coords, dict):
        return False
    lat = coords.get('lat')
    lng = coords.get('lng')
    return lat is not None and lng is not None

cleaned_data = [clean_cite(item) for item in data if has_valid_coordinates(item)]

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(cleaned_data, f, indent=2)

print(f"Cleaned cites from {len(cleaned_data)} temples (removed entries with null coordinates).")
