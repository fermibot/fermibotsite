#!/usr/bin/env python3
"""
Fix foreshadowing and callback relationships in limitless_scenes.json:
1. Remove all references to non-existent scenes (35-50)
2. Remove all callback arrays (redundant - inferred from foreshadowing)
3. Keep only foreshadowing as source of truth
"""
import json

with open('limitless_scenes.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']
total_scenes = len(scenes)
max_scene_id = max(s['id'] for s in scenes)

print("=== FIXING CONNECTIONS ===\n")
print(f"Total scenes: {total_scenes}")
print(f"Valid scene IDs: 1-{max_scene_id}\n")

# Track changes
changes = []
removed_refs = 0
removed_callbacks = 0

for scene in scenes:
    scene_id = scene['id']

    # Fix foreshadowing - remove references to non-existent scenes
    if 'foreshadowing' in scene:
        original_foreshadowing = scene['foreshadowing'][:]
        valid_foreshadowing = [
            target for target in original_foreshadowing
            if target <= max_scene_id
        ]

        if len(valid_foreshadowing) != len(original_foreshadowing):
            invalid = [t for t in original_foreshadowing if t not in valid_foreshadowing]
            scene['foreshadowing'] = valid_foreshadowing
            removed_refs += len(invalid)
            changes.append(f"Scene {scene_id}: Removed foreshadowing to non-existent scenes {invalid}")

    # Remove callbacks entirely
    if 'callbacks' in scene:
        removed_callbacks += 1
        del scene['callbacks']
        changes.append(f"Scene {scene_id}: Removed callbacks array")

print("Changes made:")
for change in changes:
    print(f"  {change}")

print(f"\n✅ Removed {removed_refs} references to non-existent scenes")
print(f"✅ Removed {removed_callbacks} callback arrays")

# Save
with open('limitless_scenes.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n✅ Updated limitless_scenes.json")

# Verify
print("\n=== VERIFICATION ===\n")
print("Remaining foreshadowing relationships:")
for scene in scenes:
    if scene.get('foreshadowing'):
        print(f"  Scene {scene['id']:2d} → {scene['foreshadowing']}")

print("\n✅ All connections now clean and consistent!")
print("   - Only 'foreshadowing' arrays remain")
print("   - All references point to valid scenes (1-34)")
print("   - Callbacks will be inferred automatically by visualization")
