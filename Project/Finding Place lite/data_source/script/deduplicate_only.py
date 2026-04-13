import json

file_path = r'c:\Users\xdrav\Desktop\AdSpace\My Programming\WebData\Project\Finding Place lite\data_source\myList.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Normalization function to handle slight variations
def normalize_name(name):
    n = name.lower().strip()
    if n.endswith(' temple'):
        n = n[:-7].strip()
    return n

# First pass: count duplicates
seen_names = set()
duplicate_count = 0
duplicates = []

for item in data:
    name = item.get('name', '')
    norm_name = normalize_name(name)
    
    # Special cases
    if 'amarnath' in norm_name:
        norm_name = 'amarnath'
    if 'jagannath' in norm_name:
        norm_name = 'jagannath'
    if 'kashi vishwanath' in norm_name:
        norm_name = 'kashi'

    if norm_name in seen_names:
        duplicate_count += 1
        duplicates.append(item)
    else:
        seen_names.add(norm_name)

print(f"Found {duplicate_count} duplicate entries.")

if duplicate_count > 0:
    proceed = input("Do you want to remove the duplicates? (y/n): ").strip().lower()
    if proceed == 'y':
        # Remove duplicates
        unique_data = []
        seen_names = set()
        for item in data:
            name = item.get('name', '')
            norm_name = normalize_name(name)
            
            if 'amarnath' in norm_name:
                norm_name = 'amarnath'
            if 'jagannath' in norm_name:
                norm_name = 'jagannath'
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
        print("Duplicates removed.")
    else:
        print("No changes made.")
else:
    print("No duplicates found.")
