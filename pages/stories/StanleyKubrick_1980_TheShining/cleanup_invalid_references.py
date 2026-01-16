#!/usr/bin/env python3
"""
Remove references to non-existent scenes from The Shining JSON
"""
import json

# Load scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

print("🧹 Cleaning up invalid scene references...\n")

# Get valid scene IDs
valid_ids = {s['id'] for s in scenes}
print(f"Valid scene IDs: {min(valid_ids)} to {max(valid_ids)} ({len(valid_ids)} scenes)")

removed_count = 0

# Clean up each scene
for scene in scenes:
    scene_id = scene['id']

    # Clean foreshadowing
    if 'foreshadowing' in scene:
        original = scene['foreshadowing'][:]
        scene['foreshadowing'] = [sid for sid in scene['foreshadowing'] if sid in valid_ids]
        removed = set(original) - set(scene['foreshadowing'])
        if removed:
            print(f"Scene {scene_id}: Removed invalid foreshadowing {sorted(removed)}")
            removed_count += len(removed)

    # Clean callbacks
    if 'callbacks' in scene:
        original = scene['callbacks'][:]
        scene['callbacks'] = [sid for sid in scene['callbacks'] if sid in valid_ids]
        removed = set(original) - set(scene['callbacks'])
        if removed:
            print(f"Scene {scene_id}: Removed invalid callbacks {sorted(removed)}")
            removed_count += len(removed)

# Update total scene count in metadata
if data['metadata'].get('totalScenes') != len(scenes):
    print(f"\n📝 Updating metadata: totalScenes {data['metadata'].get('totalScenes')} → {len(scenes)}")
    data['metadata']['totalScenes'] = len(scenes)

# Write back
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"\n✅ Removed {removed_count} invalid references")
print(f"💾 Saved cleaned data to JSON file")

# Statistics
total_foreshadows = sum(len(s.get('foreshadowing', [])) for s in scenes)
total_callbacks = sum(len(s.get('callbacks', [])) for s in scenes)

print(f"\n📊 Final Statistics:")
print(f"   Total foreshadowing links: {total_foreshadows}")
print(f"   Total callback links: {total_callbacks}")
if total_foreshadows == total_callbacks:
    print(f"   ✅ Connection counts balanced!")
else:
    print(f"   ⚠️  Still imbalanced by {abs(total_foreshadows - total_callbacks)}")
