#!/usr/bin/env python3
"""
Audit foreshadowing and callback relationships in limitless_scenes.json
to check for consistency and conflicts.
"""
import json

with open('limitless_scenes.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

print("=== AUDITING FORESHADOWING & CALLBACK RELATIONSHIPS ===\n")

# Build maps
foreshadowing_map = {}  # scene_id -> [targets it foreshadows]
callback_map = {}        # scene_id -> [sources that call back to it]

for scene in scenes:
    scene_id = scene['id']

    # Store foreshadowing
    foreshadowing = scene.get('foreshadowing', [])
    if foreshadowing:
        foreshadowing_map[scene_id] = foreshadowing

    # Store callbacks
    callbacks = scene.get('callbacks', [])
    if callbacks:
        callback_map[scene_id] = callbacks

print(f"Scenes with foreshadowing: {len(foreshadowing_map)}")
print(f"Scenes with callbacks: {len(callback_map)}\n")

# Check consistency
print("=== CONSISTENCY CHECK ===\n")

inconsistencies = []
redundancies = []

# For each foreshadowing relationship
for source_id, targets in foreshadowing_map.items():
    for target_id in targets:
        # Check if target has a callback to source
        target_callbacks = callback_map.get(target_id, [])

        if source_id in target_callbacks:
            redundancies.append({
                'source': source_id,
                'target': target_id,
                'type': 'redundant',
                'desc': f"Scene {source_id} foreshadows {target_id} AND Scene {target_id} has callback to {source_id} (redundant)"
            })
        else:
            inconsistencies.append({
                'source': source_id,
                'target': target_id,
                'type': 'missing_callback',
                'desc': f"Scene {source_id} foreshadows {target_id} but Scene {target_id} does NOT have callback to {source_id}"
            })

# Check for callbacks without corresponding foreshadowing
for target_id, sources in callback_map.items():
    for source_id in sources:
        # Check if source has foreshadowing to target
        source_foreshadowing = foreshadowing_map.get(source_id, [])

        if target_id not in source_foreshadowing:
            # Check if this was already caught above
            already_found = any(
                i['source'] == source_id and i['target'] == target_id
                for i in redundancies
            )
            if not already_found:
                inconsistencies.append({
                    'source': source_id,
                    'target': target_id,
                    'type': 'missing_foreshadowing',
                    'desc': f"Scene {target_id} has callback to {source_id} but Scene {source_id} does NOT foreshadow {target_id}"
                })

print(f"✓ Redundancies found: {len(redundancies)}")
print(f"✗ Inconsistencies found: {len(inconsistencies)}\n")

if redundancies:
    print("=== REDUNDANT RELATIONSHIPS ===")
    print("(Both foreshadowing and callback defined for same relationship)\n")
    for item in redundancies[:20]:  # Show first 20
        print(f"  Scene {item['source']:2d} → Scene {item['target']:2d}")
    if len(redundancies) > 20:
        print(f"  ... and {len(redundancies) - 20} more")
    print()

if inconsistencies:
    print("=== INCONSISTENCIES ===")
    print("(One-way relationships that should be bidirectional)\n")
    for item in inconsistencies[:20]:  # Show first 20
        print(f"  {item['desc']}")
    if len(inconsistencies) > 20:
        print(f"  ... and {len(inconsistencies) - 20} more")
    print()

# Detailed breakdown
print("\n=== DETAILED BREAKDOWN ===\n")

print("All foreshadowing relationships:")
for source_id in sorted(foreshadowing_map.keys()):
    targets = foreshadowing_map[source_id]
    print(f"  Scene {source_id:2d} foreshadows: {targets}")

print("\nAll callback relationships:")
for target_id in sorted(callback_map.keys()):
    sources = callback_map[target_id]
    print(f"  Scene {target_id:2d} callbacks from: {sources}")

# Summary
print("\n=== SUMMARY ===\n")
total_relationships = len(redundancies) + len(inconsistencies)
print(f"Total relationships found: {total_relationships}")
print(f"  - Redundant (both defined): {len(redundancies)}")
print(f"  - Inconsistent (one-way): {len(inconsistencies)}")
print()

if len(redundancies) > 0 and len(inconsistencies) == 0:
    print("✅ Data is CONSISTENT but REDUNDANT")
    print("   Recommendation: Remove all 'callbacks' arrays and keep only 'foreshadowing'")
elif len(inconsistencies) > 0:
    print("❌ Data has INCONSISTENCIES")
    print("   Recommendation: Fix inconsistencies first, then remove redundancy")
else:
    print("✅ Data is CLEAN (no redundancy, no inconsistencies)")
