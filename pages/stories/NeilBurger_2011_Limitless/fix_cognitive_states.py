#!/usr/bin/env python3
"""
Fix cognitive states for scenes 30, 32, 33, 36, 39, 40
"""

import json

# Load scenes data
with open('limitless_scenes_50.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Fix the problematic scenes
fixes = {
    30: "enhanced",  # Eddie enhanced when he arrives to rescue Lindy
    32: "withdrawal",  # Gennady taking MDT, Eddie losing supply
    33: "enhanced",  # Eddie enhanced but physically failing
    36: "baseline",  # Gennady's rampage, Eddie not on MDT
    39: "withdrawal",  # Eddie in severe withdrawal -> simplified
    40: "enhanced"  # Eddie enhanced but struggling -> simplified
}

for scene_id, new_state in fixes.items():
    old_state = scenes[scene_id - 1]['cognitiveState']
    scenes[scene_id - 1]['cognitiveState'] = new_state
    print(f"Scene {scene_id}:")
    print(f"  Old: '{old_state}'")
    print(f"  New: '{new_state}'")
    print()

# Write updated data
with open('limitless_scenes_50.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✓ Updated cognitive states for 6 scenes")
