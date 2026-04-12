import csv
import json
import uuid
import os

# File paths
BASE_DIR = r"c:\Users\xdrav\Desktop\AdSpace\My Programming\WebData\Project\Finding Place lite\data_source"
CSV1_PATH = os.path.join(BASE_DIR, "places.csv")
CSV2_PATH = os.path.join(BASE_DIR, "indian_temples_100000.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "places_unified.json")

def normalize_string(s):
    if not s:
        return ""
    return str(s).strip().lower()

def create_id():
    return str(uuid.uuid4())

def safe_float(val):
    try:
        if val and str(val).strip():
            return float(val)
    except ValueError:
        pass
    return None

def process_csv1_row(row):
    """
    CSV 1: state,city,popular_destination,latitude,longitude,interest,google_rating,price_fare
    """
    return {
        "id": create_id(),
        "name": row.get("popular_destination"),
        "type": "destination",
        "location": {
            "state": row.get("state"),
            "city": row.get("city"),
            "district": None
        },
        "coordinates": {
            "lat": safe_float(row.get("latitude")),
            "lng": safe_float(row.get("longitude"))
        },
        "rating": safe_float(row.get("google_rating")),
        "details": {
            "interest": row.get("interest"),
            "price_fare": row.get("price_fare")
        }
    }

def process_csv2_row(row):
    """
    CSV 2: Temple_Name,Deity,State,District,Town/City/Village,Latitude,Longitude,Architecture_Style,Established_Year,Build_Date,Historical_Significance,Festivals_Celebrated,Managing_Authority,Rituals_and_Pujas,Nearest_City,Transport_Info
    """
    return {
        "id": create_id(),
        "name": row.get("Temple_Name"),
        "type": "temple",
        "location": {
            "state": row.get("State"),
            "city": row.get("Town/City/Village"),
            "district": row.get("District")
        },
        "coordinates": {
            "lat": safe_float(row.get("Latitude")),
            "lng": safe_float(row.get("Longitude"))
        },
        "rating": None, # Temples CSV doesn't have rating
        "details": {
            "Deity": row.get("Deity"),
            "Architecture_Style": row.get("Architecture_Style"),
            "Established_Year": row.get("Established_Year"),
            "Build_Date": row.get("Build_Date"),
            "Historical_Significance": row.get("Historical_Significance"),
            "Festivals_Celebrated": row.get("Festivals_Celebrated"),
            "Managing_Authority": row.get("Managing_Authority"),
            "Rituals_and_Pujas": row.get("Rituals_and_Pujas"),
            "Nearest_City": row.get("Nearest_City"),
            "Transport_Info": row.get("Transport_Info")
        }
    }

def merge_data():
    print("Starting data merge...")
    
    merged_data = {} # Key: (normalized_name, normalized_city) -> Record
    
    # 1. Process CSV 2 (Temples) first to establish base records for temples
    # We want to prioritize temple details, so we load them first or second? 
    # Requirement: "prioritizing the detailed Temple data from CSV2".
    # Strategy: Load CSV 2 first. If CSV 1 finds a match, we basically just update the rating if needed, 
    # or arguably we might want to ensure 'destination' type doesn't overwrite 'temple' type unless we want it to.
    # Actually, let's load CSV 2 first and put them in the map.
    
    print(f"Reading {CSV2_PATH}...")
    try:
        with open(CSV2_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                record = process_csv2_row(row)
                name = normalize_string(record["name"])
                city = normalize_string(record["location"]["city"])
                key = (name, city)
                merged_data[key] = record
    except FileNotFoundError:
        print(f"Error: File not found at {CSV2_PATH}")
        return

    print(f"Loaded {len(merged_data)} entries from CSV 2.")

    # 2. Process CSV 1 (Destinations)
    print(f"Reading {CSV1_PATH}...")
    count_new = 0
    count_merged = 0
    
    # Try reading with different encodings
    csv1_encoding = 'utf-8'
    try:
        with open(CSV1_PATH, mode='r', encoding='utf-8') as f:
            f.read() # Read whole file to check encoding
    except UnicodeDecodeError:
        print("UTF-8 decode failed for CSV1, trying cp1252...")
        csv1_encoding = 'cp1252'

    try:
        with open(CSV1_PATH, mode='r', encoding=csv1_encoding) as f:
            reader = csv.DictReader(f)
            for row in reader:
                record = process_csv1_row(row)
                name = normalize_string(record["name"])
                city = normalize_string(record["location"]["city"])
                key = (name, city)
                
                if key in merged_data:
                    # Merge logic: preserve Temple data (already in merged_data)
                    # BUT bring in rating and maybe specific details from CSV 1 if useful.
                    # Requirement: "prioritizing the detailed Temple data from CSV2"
                    # Requirement: "rating: Use google_rating for CSV1"
                    
                    existing_record = merged_data[key]
                    
                    # Merge rating if it exists in CSV 1 and missing in current record
                    if record["rating"] is not None:
                        existing_record["rating"] = record["rating"]
                        
                    # We could also merge details, but the schemas are quite different.
                    # 'interest' and 'price_fare' from CSV 1 might be useful to add to details.
                    if record["details"]["interest"]:
                         existing_record["details"]["interest"] = record["details"]["interest"]
                    if record["details"]["price_fare"]:
                         existing_record["details"]["price_fare"] = record["details"]["price_fare"]
                         
                    count_merged += 1
                else:
                    # New distinct destination
                    merged_data[key] = record
                    count_new += 1
    except FileNotFoundError:
        print(f"Error: File not found at {CSV1_PATH}")
        return

    print(f"Merged {count_merged} entries. Added {count_new} new entries from CSV 1.")
    
    # Convert values to list
    final_list = list(merged_data.values())
    
    print(f"Writing {len(final_list)} total entries to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=4, ensure_ascii=False)
        
    print("Done.")

if __name__ == "__main__":
    merge_data()
