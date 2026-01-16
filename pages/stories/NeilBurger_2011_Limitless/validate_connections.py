#!/usr/bin/env python3
"""
Validate bidirectional connections between scenes.
Checks that foreshadowing and callbacks are properly linked.
"""
import json

# Read the JSON
with open('NeilBurger_2011_Limitless_scenes_analyzed_final.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Helper to find scene by ID
def get_scene(scene_id):
    return next((s for s in scenes if s['id'] == scene_id), None)

print("Validating narrative connections...")
print("=" * 70)

# Check all scenes for broken references
broken_refs = []
missing_bidirectional = []
valid_connections = 0

for scene in scenes:
    scene_id = scene['id']

    # Check foreshadowing connections
    for foreshadow in scene.get('foreshadowing', []):
        target_id = foreshadow['sceneId']
        target_scene = get_scene(target_id)

        if not target_scene:
            broken_refs.append({
                'from': scene_id,
                'to': target_id,
                'type': 'foreshadowing'
            })
        else:
            # Check if target has corresponding callback
            has_callback = any(
                cb['sceneId'] == scene_id
                for cb in target_scene.get('callbacks', [])
            )
            if not has_callback:
                missing_bidirectional.append({
                    'from': scene_id,
                    'to': target_id,
                    'type': 'foreshadowing missing callback'
                })
            else:
                valid_connections += 1

    # Check callback connections
    for callback in scene.get('callbacks', []):
        source_id = callback['sceneId']
        source_scene = get_scene(source_id)

        if not source_scene:
            broken_refs.append({
                'from': scene_id,
                'to': source_id,
                'type': 'callback'
            })
        else:
            # Check if source has corresponding foreshadowing
            has_foreshadow = any(
                fs['sceneId'] == scene_id
                for fs in source_scene.get('foreshadowing', [])
            )
            if not has_foreshadow:
                missing_bidirectional.append({
                    'from': source_id,
                    'to': scene_id,
                    'type': 'callback missing foreshadowing'
                })
            else:
                valid_connections += 1

print(f"\n✅ Valid bidirectional connections: {valid_connections // 2}")  # Divide by 2 since we count both directions

if broken_refs:
    print(f"\n❌ BROKEN REFERENCES FOUND: {len(broken_refs)}")
    for ref in broken_refs:
        print(f"   Scene {ref['from']} → Scene {ref['to']} ({ref['type']}): Target scene doesn't exist!")
else:
    print(f"\n✅ No broken references found")

if missing_bidirectional:
    print(f"\n⚠️  MISSING BIDIRECTIONAL LINKS: {len(missing_bidirectional)}")
    print("   (This is OK - some callbacks don't need explicit foreshadowing)")
    for miss in missing_bidirectional[:10]:  # Show first 10
        print(f"   Scene {miss['from']} → Scene {miss['to']}: {miss['type']}")
    if len(missing_bidirectional) > 10:
        print(f"   ... and {len(missing_bidirectional) - 10} more")
else:
    print(f"\n✅ All connections are bidirectional")

# Statistics
scenes_with_connections = sum(1 for s in scenes if (
    s.get('foreshadowing') and len(s.get('foreshadowing', [])) > 0
) or (
    s.get('callbacks') and len(s.get('callbacks', [])) > 0
))

total_foreshadowing = sum(len(s.get('foreshadowing', [])) for s in scenes)
total_callbacks = sum(len(s.get('callbacks', [])) for s in scenes)

print(f"\n" + "=" * 70)
print("STATISTICS:")
print(f"  Scenes with connections: {scenes_with_connections} / {len(scenes)}")
print(f"  Total foreshadowing: {total_foreshadowing}")
print(f"  Total callbacks: {total_callbacks}")
print(f"  Total connections: {total_foreshadowing + total_callbacks}")
print(f"  Average connections per scene: {(total_foreshadowing + total_callbacks) / len(scenes):.2f}")

print("\nMost connected scenes:")
connection_counts = [
    (s['id'], s['title'], len(s.get('foreshadowing', [])) + len(s.get('callbacks', [])))
    for s in scenes
]
connection_counts.sort(key=lambda x: x[2], reverse=True)

for scene_id, title, count in connection_counts[:10]:
    if count > 0:
        scene = get_scene(scene_id)
        fs_count = len(scene.get('foreshadowing', []))
        cb_count = len(scene.get('callbacks', []))
        print(f"  Scene {scene_id}: {count} total ({fs_count} foreshadowing, {cb_count} callbacks)")
        print(f"    {title[:60]}")

print("\n✅ VALIDATION COMPLETE")
