#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

# Correct page ranges for scenes 122-123
updates = {
    122: {"startPage": 123, "endPage": 123, "screenplayPage": 122},
    123: {"startPage": 124, "endPage": 124, "screenplayPage": 123}
}

# Update the scenes
for scene in data:
    if scene['id'] in updates:
        old_start = scene['startPage']
        old_end = scene['endPage']
        scene['startPage'] = updates[scene['id']]['startPage']
        scene['endPage'] = updates[scene['id']]['endPage']
        scene['screenplayPage'] = updates[scene['id']]['screenplayPage']
        print(f"Fixed Scene {scene['id']}: PDF {old_start}-{old_end} → {scene['startPage']}-{scene['endPage']} (screenplay page {scene['screenplayPage']})")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\nScenes 122-123 fixed!")
