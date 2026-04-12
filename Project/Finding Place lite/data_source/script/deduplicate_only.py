import json

file_path = r'c:\Users\xdrav\Desktop\AdSpace\My Programming\WebData\Project\Finding Place lite\data_source\myList.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

unique_data = []
seen_names = set()

# Normalization function to handle slight variations like "Golden Temple" vs "Golden Temple (Sri Harmandir Sahib)"
# Actually, the user's duplicates are often exact names or very similar.
# Example: "Kedarnath Temple" (clean) vs "Kedarnath Temple" (with cite).

def normalize_name(name):
    # Remove common suffixes and normalize casing
    n = name.lower().strip()
    # Remove "temple" if it's at the end to match "Amarnath" with "Amarnath Temple"
    if n.endswith(' temple'):
        n = n[:-7].strip()
    return n

for item in data:
    name = item.get('name', '')
    norm_name = normalize_name(name)
    
    # Special cases for the user's specific data
    # Amarnath Cave Temple vs Amarnath Temple
    if 'amarnath' in norm_name:
        norm_name = 'amarnath'
    # Jagannath Temple vs Shri Jagannath Temple
    if 'jagannath' in norm_name:
        norm_name = 'jagannath'
    # Kashi Vishwanath
    if 'kashi vishwanath' in norm_name:
        norm_name = 'kashi'

    if norm_name not in seen_names:
        unique_data.append(item)
        seen_names.add(norm_name)
    else:
        print(f"Removing duplicate: {name}")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(unique_data, f, indent=2)

print(f"Original: {len(data)}")
print(f"Unique: {len(unique_data)}")
