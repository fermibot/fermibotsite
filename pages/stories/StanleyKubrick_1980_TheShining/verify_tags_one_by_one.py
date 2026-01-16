#!/usr/bin/env python3
"""
Verify each tag one by one and mark unused tags for deletion
"""
import json
import time

# Read universal tag system
with open('universal_tag_system.py', 'r') as f:
    exec(f.read())

# Read scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

# Build scene usage map
scene_usage = {}
for scene in scenes:
    for tag in scene.get('tags', []):
        if tag not in scene_usage:
            scene_usage[tag] = []
        scene_usage[tag].append(scene['id'])

print("=" * 80)
print("TAG-BY-TAG VERIFICATION")
print("=" * 80)
print(f"Total tags to verify: {len(UNIVERSAL_TAGS)}\n")

tags_with_scenes = []
tags_without_scenes = []

for i, (tag, description) in enumerate(sorted(UNIVERSAL_TAGS.items()), 1):
    # Progress indicator
    print(f"[{i:2d}/{len(UNIVERSAL_TAGS)}] Checking '{tag}'...", end=' ')

    if tag in scene_usage:
        count = len(scene_usage[tag])
        scene_list = scene_usage[tag][:10]  # Show first 10
        more = f" (+{len(scene_usage[tag]) - 10} more)" if len(scene_usage[tag]) > 10 else ""
        print(f"✓ {count:3d} scenes {scene_list}{more}")
        tags_with_scenes.append(tag)
    else:
        print(f"✗ NO SCENES - MARK FOR DELETION")
        print(f"    Description: {description}")
        tags_without_scenes.append(tag)

    # Small delay for readability
    time.sleep(0.05)

print("\n" + "=" * 80)
print("VERIFICATION SUMMARY")
print("=" * 80)
print(f"✓ Tags with scenes:    {len(tags_with_scenes):3d}")
print(f"✗ Tags without scenes: {len(tags_without_scenes):3d}")

if tags_without_scenes:
    print(f"\n🗑️  TAGS MARKED FOR DELETION ({len(tags_without_scenes)}):")
    for tag in sorted(tags_without_scenes):
        print(f"   • {tag:30s} - {UNIVERSAL_TAGS[tag]}")
else:
    print("\n✅ All tags are being used!")

print("=" * 80)
