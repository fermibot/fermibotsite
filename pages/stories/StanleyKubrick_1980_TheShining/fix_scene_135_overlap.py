#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

for scene in scenes:
    if scene['id'] == 135:
        # Scene 135 should be PDF 136 only, not extend to 137
        scene['startPage'] = 136
        scene['endPage'] = 136  # NOT 137!
        scene['screenplayPage'] = 135

        # Scene 135 ends with "Jack moves R-L and looks down at lobby"
        # The dialogue is correct - it includes Halloran OFF "Hallo!" and "Anybody here?" from page 135
        print(f"✓ Fixed Scene 135: PDF 136 only (removed overlap with 136)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 135 overlap removed!")
