import json

# 1. Read both files
with open('maps.json', 'r', encoding='utf-8') as f:
    maps = json.load(f)

with open('connections.json', 'r', encoding='utf-8') as f:
    connections_data = json.load(f)

# 2. Create a fast lookup dictionary using DisplayName
connections_dict = {}
for item in connections_data:
    connections_dict[item['DisplayName']] = item.get('Connections', [])

# 3. Merge them together
for map_tile in maps:
    display_name = map_tile.get('DisplayName')
    # Grabs the connections array, defaults to empty list [] if not found
    map_tile['Connections'] = connections_dict.get(display_name, [])

# 4. Save it to a brand new file
with open('maps_merged.json', 'w', encoding='utf-8') as f:
    json.dump(maps, f, indent=2, ensure_ascii=False)

print("✅ Massive W. Saved fully merged data to maps_merged.json")