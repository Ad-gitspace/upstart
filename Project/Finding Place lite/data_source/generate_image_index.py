import os
import json

# Configuration
IMAGE_DIR = r'data_source/indian_temples_img'
OUTPUT_FILE = r'data_source/image_index.json'

def generate_index():
    index = {}
    
    # Check if directory exists
    if not os.path.exists(IMAGE_DIR):
        print(f"Error: Directory {IMAGE_DIR} not found.")
        return

    # Walk through the directory
    for temple_name in os.listdir(IMAGE_DIR):
        temple_path = os.path.join(IMAGE_DIR, temple_name)
        
        # Only process directories
        if os.path.isdir(temple_path):
            images = []
            for file in os.listdir(temple_path):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif')):
                    # Create relative path for web use
                    # e.g., ./data_source/indian_temples_img/TempleName/image.jpg
                    rel_path = f"./data_source/indian_temples_img/{temple_name}/{file}"
                    images.append(rel_path)
            
            if images:
                index[temple_name] = images
                print(f"Found {len(images)} images for {temple_name}")

    # Write to JSON file
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(index, f, indent=4)
    
    print(f"Successfully generated index with {len(index)} temples at {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_index()
