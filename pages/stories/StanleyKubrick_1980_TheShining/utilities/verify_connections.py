#!/usr/bin/env python3
"""
Verify and fix bidirectional connections in The Shining scenes JSON
Checks foreshadowing/callbacks arrays for bidirectionality
"""
import json

# Load scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

print("🔍 Checking all foreshadowing/callbacks connections...\n")

issues = []
fixes = []

# Create a mapping of scene ID to scene for quick lookup
scene_map = {s['id']: s for s in scenes}

# Check each scene
for scene in scenes:
    scene_id = scene['id']

    # Ensure arrays exist
    if 'foreshadowing' not in scene:
        scene['foreshadowing'] = []
    if 'callbacks' not in scene:
        scene['callbacks'] = []

    # Check foreshadowing - each target should have this scene in its callbacks
    for target_id in scene['foreshadowing']:
        # Check if target scene exists
        if target_id not in scene_map:
            issues.append(f"❌ Scene {scene_id}: foreshadows non-existent scene {target_id}")
            continue

        target_scene = scene_map[target_id]

        # Ensure target has callbacks array
        if 'callbacks' not in target_scene:
            target_scene['callbacks'] = []

        # Check if this scene is in target's callbacks
        if scene_id not in target_scene['callbacks']:
            target_scene['callbacks'].append(scene_id)
            fixes.append(f"✅ Scene {target_id}: Added missing callback from scene {scene_id}")

    # Check callbacks - each source should have this scene in its foreshadowing
    for source_id in scene['callbacks']:
        # Check if source scene exists
        if source_id not in scene_map:
            issues.append(f"❌ Scene {scene_id}: callback from non-existent scene {source_id}")
            continue

        source_scene = scene_map[source_id]

        # Ensure source has foreshadowing array
        if 'foreshadowing' not in source_scene:
            source_scene['foreshadowing'] = []

        # Check if this scene is in source's foreshadowing
        if scene_id not in source_scene['foreshadowing']:
            source_scene['foreshadowing'].append(scene_id)
            fixes.append(f"✅ Scene {source_id}: Added missing foreshadow to scene {scene_id}")

# Print results
if issues:
    print("❌ ISSUES FOUND:")
    for issue in issues:
        print(f"   {issue}")
    print()

if fixes:
    print("FIXES APPLIED:")
    for fix in fixes:
        print(f"   {fix}")
    print()

    # Write back the fixed data
    with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"💾 Saved {len(fixes)} fixes to JSON file\n")
elif not issues:
    print("✅ All connections are bidirectional - no fixes needed!\n")

# Statistics
total_foreshadows = sum(len(s.get('foreshadowing', [])) for s in scenes)
total_callbacks = sum(len(s.get('callbacks', [])) for s in scenes)
scenes_with_foreshadowing = sum(1 for s in scenes if s.get('foreshadowing', []))
scenes_with_callbacks = sum(1 for s in scenes if s.get('callbacks', []))

print(f"📊 Connection Statistics:")
print(f"   Total foreshadowing links: {total_foreshadows}")
print(f"   Total callback links: {total_callbacks}")
print(f"   Scenes with foreshadowing: {scenes_with_foreshadowing}")
print(f"   Scenes with callbacks: {scenes_with_callbacks}")
print(f"   Total scenes: {len(scenes)}")

# Check for balance
if total_foreshadows != total_callbacks:
    print(f"\n⚠️  WARNING: Foreshadowing ({total_foreshadows}) != Callbacks ({total_callbacks})")
else:
    print(f"\n✅ Connection counts balanced!")

# List top connected scenes
print(f"\n🔗 Top 10 Most Connected Scenes:")
scenes_with_connections = [
    (s['id'], len(s.get('foreshadowing', [])) + len(s.get('callbacks', [])), s.get('title', 'Untitled'))
    for s in scenes
]
scenes_with_connections.sort(key=lambda x: x[1], reverse=True)

for scene_id, count, title in scenes_with_connections[:10]:
    if count > 0:
        print(f"   Scene {scene_id:3d}: {count:2d} connections - {title[:60]}")
