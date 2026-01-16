#!/usr/bin/env python3
"""
Verify and display tag-to-scene associations
"""
import json

# Read universal tag system
with open('universal_tag_system.py', 'r') as f:
    exec(f.read())

# Read scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

# Build tag-to-scenes mapping
tag_to_scenes = {}
for scene in scenes:
    for tag in scene.get('tags', []):
        if tag not in tag_to_scenes:
            tag_to_scenes[tag] = []
        tag_to_scenes[tag].append(scene['id'])

# Get all defined tags
defined_tags = set(UNIVERSAL_TAGS.keys())
used_tags = set(tag_to_scenes.keys())

print("=" * 80)
print("TAG-TO-SCENE ASSOCIATIONS")
print("=" * 80)

# Show used tags with their scenes
print(f"\nTAGS USED IN SCENES ({len(used_tags)}):\n")
for tag in sorted(used_tags):
    scene_ids = tag_to_scenes[tag]
    description = UNIVERSAL_TAGS.get(tag, "NOT DEFINED")
    print(f"  {tag:30s} → {len(scene_ids):3d} scenes: {scene_ids}")
    print(f"    {description}")
    print()

# Show unused tags
unused_tags = sorted(defined_tags - used_tags)
print(f"\nTAGS DEFINED BUT NOT USED ({len(unused_tags)}):\n")
for tag in unused_tags:
    description = UNIVERSAL_TAGS.get(tag, "")
    print(f"  {tag:30s} - {description}")

print("\n" + "=" * 80)
print(f"Summary: {len(used_tags)}/{len(defined_tags)} tags are being used")
print("=" * 80)
