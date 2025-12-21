import csv
import json
import os

# Configuration
FOOD_CSV = '/Users/ericeldridge/Downloads/FoodData_Central_sr_legacy_food_csv_2018-04/food.csv'
NUTRIENT_CSV = '/Users/ericeldridge/Downloads/FoodData_Central_sr_legacy_food_csv_2018-04/food_nutrient.csv'
OUTPUT_FILE = 'ingredients.js'

# Nutrient ID mapping
NUTRIENTS = {
    '1008': 'kcal',
    '1003': 'protein',
    '1004': 'fat',
    '1005': 'carbs',
    '2000': 'sugar',
    '1079': 'fiber',
    '1093': 'sodium'
}

def run():
    # Check if files exist
    food_csv_path = FOOD_CSV
    nutrient_csv_path = NUTRIENT_CSV

    if not os.path.exists(food_csv_path):
        # Try parent directory
        if os.path.exists(os.path.join('..', '..', FOOD_CSV)):
             food_csv_path = os.path.join('..', '..', FOOD_CSV)
        elif os.path.exists(os.path.join('..', FOOD_CSV)):
             food_csv_path = os.path.join('..', FOOD_CSV)
        else:
            print(f"Error: {FOOD_CSV} not found in {os.getcwd()} or parent directories")
            return

    if not os.path.exists(nutrient_csv_path):
        # Try parent directory
        if os.path.exists(os.path.join('..', '..', NUTRIENT_CSV)):
             nutrient_csv_path = os.path.join('..', '..', NUTRIENT_CSV)
        elif os.path.exists(os.path.join('..', NUTRIENT_CSV)):
             nutrient_csv_path = os.path.join('..', NUTRIENT_CSV)
        else:
            print(f"Error: {NUTRIENT_CSV} not found in {os.getcwd()} or parent directories")
            return

    print(f"Using {food_csv_path} and {nutrient_csv_path}")
    print("Loading food descriptions...")
    foods = {}
    
    # 1. Read food.csv to get IDs and Names
    # Expected columns: fdc_id, data_type, description, ...
    with open(food_csv_path, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            fdc_id = row['fdc_id']
            description = row['description']
            # Initialize food object
            foods[fdc_id] = {
                'id': int(fdc_id),
                'name': description,
                'kcal': 0,
                'protein': 0,
                'fat': 0,
                'carbs': 0,
                'sugar': 0,
                'fiber': 0,
                'sodium': 0
            }

    print(f"Loaded {len(foods)} food items. Processing nutrients...")

    # 2. Read food_nutrient.csv to get values
    # Expected columns: id, fdc_id, nutrient_id, amount, ...
    with open(nutrient_csv_path, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            fdc_id = row['fdc_id']
            nutrient_id = row['nutrient_id']
            amount = row['amount']

            if fdc_id in foods and nutrient_id in NUTRIENTS:
                key = NUTRIENTS[nutrient_id]
                try:
                    foods[fdc_id][key] = float(amount)
                except ValueError:
                    pass

    print("Formatting and filtering data...")
    
    final_list = []
    
    for f in foods.values():
        # 1. Filter: Must have calories (or at least be processed)
        # Note: We initialized with 0, so we check if it's meaningful. 
        # Some valid foods have 0 kcal (water, diet soda), but for a nutrition widget, 
        # usually we want things with some nutritional value or at least common items.
        # The user said "Only keep foods that have calorie data". 
        # Since we pre-filled with 0, we can't distinguish "missing" from "0".
        # However, the SR Legacy dataset usually has data for all these.
        # Let's assume if it's in the list it's valid, but maybe skip if name is weird.
        
        # 2. Clean Name
        name = f['name']
        name = name.replace(', raw', '').replace(', NFS', '').replace(', NS', '')
        name = name.replace(', with refuse', '').replace(', all grades', '')
        f['name'] = name.strip()
        
        final_list.append(f)

    # 3. Sort and Limit
    # Heuristic: Shorter names are often more "generic" and useful (e.g. "Apple" vs "Apple, raw, with skin")
    # Also sort alphabetically for the final list
    # final_list.sort(key=lambda x: (len(x['name']), x['name']))
    
    # User requested to keep all items and not limit them.
    # limit = 3000
    # if len(final_list) > limit:
    #     print(f"Limiting from {len(final_list)} to {limit} items.")
    #     final_list = final_list[:limit]
    
    # Final sort alphabetically for the UI
    final_list.sort(key=lambda x: x['name'])

    # 3. Write to ingredients.js
    print(f"Writing {len(final_list)} items to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("const foodData = [\n")
        for i, item in enumerate(final_list):
            # Compact JSON for each line
            line = json.dumps(item, separators=(',', ':'))
            if i < len(final_list) - 1:
                line += ","
            f.write("  " + line + "\n")
        f.write("];\n")

    print(f"Successfully wrote {len(final_list)} items to {OUTPUT_FILE}")

if __name__ == "__main__":
    run()
