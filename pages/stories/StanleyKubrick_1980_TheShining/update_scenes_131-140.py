#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

# Updated page ranges for scenes 131-140 (PDF pages with +1 offset)
updates = {
    131: {"startPage": 132, "endPage": 133, "screenplayPage": 131},
    132: {"startPage": 133, "endPage": 134, "screenplayPage": 132},
    133: {"startPage": 133, "endPage": 135, "screenplayPage": 132},
    134: {"startPage": 135, "endPage": 136, "screenplayPage": 134},
    135: {"startPage": 136, "endPage": 137, "screenplayPage": 135},
    136: {"startPage": 137, "endPage": 138, "screenplayPage": 136},
    137: {"startPage": 138, "endPage": 139, "screenplayPage": 137},
    138: {"startPage": 139, "endPage": 139, "screenplayPage": 138},
    139: {"startPage": 139, "endPage": 140, "screenplayPage": 138},
    140: {"startPage": 140, "endPage": 143, "screenplayPage": 139}
}

# Update the scenes
for scene in data:
    if scene['id'] in updates:
        scene['startPage'] = updates[scene['id']]['startPage']
        scene['endPage'] = updates[scene['id']]['endPage']
        scene['screenplayPage'] = updates[scene['id']]['screenplayPage']
        print(f"Updated Scene {scene['id']}: PDF pages {scene['startPage']}-{scene['endPage']} (screenplay page {scene['screenplayPage']})")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\nAll scenes 131-140 updated successfully!")
