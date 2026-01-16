#!/usr/bin/env python3
"""
Fix bidirectional foreshadowing/callbacks in The Shining scenes JSON.
For every callback link, ensure the corresponding foreshadowing link exists.
"""

import json

# Load the JSON file
with open('/Users/fermibot/WebstormProjects/fermibotsite/pages/stories/StanleyKubrick_1980_TheShining/StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Create a mapping of id -> scene index
id_to_index = {scene['id']: i for i, scene in enumerate(scenes)}

# Count initial state
initial_foreshadowing_count = sum(len(scene.get('foreshadowing', [])) for scene in scenes)
initial_callback_count = sum(len(scene.get('callbacks', [])) for scene in scenes)

print(f"Initial foreshadowing links: {initial_foreshadowing_count}")
print(f"Initial callback links: {initial_callback_count}")

# Track changes
added_foreshadowing = 0
added_callbacks = 0

# Step 1: For every callback, ensure the target has foreshadowing back to source
for scene in scenes:
    scene_id = scene['id']
    callbacks = scene.get('callbacks', [])

    for callback_target in callbacks:
        if callback_target in id_to_index:
            target_scene = scenes[id_to_index[callback_target]]
            target_foreshadowing = target_scene.get('foreshadowing', [])

            # If target doesn't foreshadow back to this scene, add it
            if scene_id not in target_foreshadowing:
                if 'foreshadowing' not in target_scene:
                    target_scene['foreshadowing'] = []
                target_scene['foreshadowing'].append(scene_id)
                added_foreshadowing += 1

# Step 2: For every foreshadowing, ensure the target has callback back to source
for scene in scenes:
    scene_id = scene['id']
    foreshadowing = scene.get('foreshadowing', [])

    for foreshadow_target in foreshadowing:
        if foreshadow_target in id_to_index:
            target_scene = scenes[id_to_index[foreshadow_target]]
            target_callbacks = target_scene.get('callbacks', [])

            # If target doesn't callback to this scene, add it
            if scene_id not in target_callbacks:
                if 'callbacks' not in target_scene:
                    target_scene['callbacks'] = []
                target_scene['callbacks'].append(scene_id)
                added_callbacks += 1

print(f"\nAdded {added_foreshadowing} foreshadowing links")
print(f"Added {added_callbacks} callback links")

# Step 3: Add thematic foreshadowing connections

# Room 237 arc: Scene 39 (Hallorann warns Danny) should foreshadow scenes 73-93
room237_warning_scene = 39
room237_scenes = list(range(73, 94))  # 73-93
for target in room237_scenes:
    if target in id_to_index:
        # Add foreshadowing from scene 39
        if target not in scenes[id_to_index[room237_warning_scene]].get('foreshadowing', []):
            scenes[id_to_index[room237_warning_scene]]['foreshadowing'].append(target)
            added_foreshadowing += 1
        # Add callback to scene 39
        if room237_warning_scene not in scenes[id_to_index[target]].get('callbacks', []):
            if 'callbacks' not in scenes[id_to_index[target]]:
                scenes[id_to_index[target]]['callbacks'] = []
            scenes[id_to_index[target]]['callbacks'].append(room237_warning_scene)
            added_callbacks += 1

# Scene 73-74 should foreshadow 84-93 (Jack goes into Room 237)
for source in [73, 74]:
    for target in range(84, 94):
        if source in id_to_index and target in id_to_index:
            if target not in scenes[id_to_index[source]].get('foreshadowing', []):
                if 'foreshadowing' not in scenes[id_to_index[source]]:
                    scenes[id_to_index[source]]['foreshadowing'] = []
                scenes[id_to_index[source]]['foreshadowing'].append(target)
                added_foreshadowing += 1
            if source not in scenes[id_to_index[target]].get('callbacks', []):
                if 'callbacks' not in scenes[id_to_index[target]]:
                    scenes[id_to_index[target]]['callbacks'] = []
                scenes[id_to_index[target]]['callbacks'].append(source)
                added_callbacks += 1

# Grady twins arc: Scene 70 should foreshadow later twin appearances
grady_first = 70
grady_later = [69, 211]  # Scene 69 is just before, 211 is later
for target in grady_later:
    if target in id_to_index and grady_first in id_to_index:
        if target > grady_first:  # Only foreshadow if later
            if target not in scenes[id_to_index[grady_first]].get('foreshadowing', []):
                if 'foreshadowing' not in scenes[id_to_index[grady_first]]:
                    scenes[id_to_index[grady_first]]['foreshadowing'] = []
                scenes[id_to_index[grady_first]]['foreshadowing'].append(target)
                added_foreshadowing += 1
            if grady_first not in scenes[id_to_index[target]].get('callbacks', []):
                if 'callbacks' not in scenes[id_to_index[target]]:
                    scenes[id_to_index[target]]['callbacks'] = []
                scenes[id_to_index[target]]['callbacks'].append(grady_first)
                added_callbacks += 1

# Shining ability: Scenes 38-39 should foreshadow 83, 94, 101-106
shining_sources = [38, 39]
shining_targets = [83, 94] + list(range(101, 107))
for source in shining_sources:
    for target in shining_targets:
        if source in id_to_index and target in id_to_index:
            if target not in scenes[id_to_index[source]].get('foreshadowing', []):
                if 'foreshadowing' not in scenes[id_to_index[source]]:
                    scenes[id_to_index[source]]['foreshadowing'] = []
                scenes[id_to_index[source]]['foreshadowing'].append(target)
                added_foreshadowing += 1
            if source not in scenes[id_to_index[target]].get('callbacks', []):
                if 'callbacks' not in scenes[id_to_index[target]]:
                    scenes[id_to_index[target]]['callbacks'] = []
                scenes[id_to_index[target]]['callbacks'].append(source)
                added_callbacks += 1

# Scene 83 should foreshadow 94, 101-106 (Hallorann's journey)
hallorann_first_sense = 83
hallorann_journey = [94] + list(range(101, 107))
for target in hallorann_journey:
    if hallorann_first_sense in id_to_index and target in id_to_index:
        if target not in scenes[id_to_index[hallorann_first_sense]].get('foreshadowing', []):
            if 'foreshadowing' not in scenes[id_to_index[hallorann_first_sense]]:
                scenes[id_to_index[hallorann_first_sense]]['foreshadowing'] = []
            scenes[id_to_index[hallorann_first_sense]]['foreshadowing'].append(target)
            added_foreshadowing += 1
        if hallorann_first_sense not in scenes[id_to_index[target]].get('callbacks', []):
            if 'callbacks' not in scenes[id_to_index[target]]:
                scenes[id_to_index[target]]['callbacks'] = []
            scenes[id_to_index[target]]['callbacks'].append(hallorann_first_sense)
            added_callbacks += 1

# Jack's deterioration: Scene 72 should foreshadow 76-78, 141-146
jack_argument = 72
jack_violence = list(range(76, 79)) + list(range(141, 147))
for target in jack_violence:
    if jack_argument in id_to_index and target in id_to_index:
        if target not in scenes[id_to_index[jack_argument]].get('foreshadowing', []):
            if 'foreshadowing' not in scenes[id_to_index[jack_argument]]:
                scenes[id_to_index[jack_argument]]['foreshadowing'] = []
            scenes[id_to_index[jack_argument]]['foreshadowing'].append(target)
            added_foreshadowing += 1
        if jack_argument not in scenes[id_to_index[target]].get('callbacks', []):
            if 'callbacks' not in scenes[id_to_index[target]]:
                scenes[id_to_index[target]]['callbacks'] = []
            scenes[id_to_index[target]]['callbacks'].append(jack_argument)
            added_callbacks += 1

# Scenes 79-82 (Lloyd bartender) should foreshadow 107-109 (Gold Ballroom party)
lloyd_scenes = list(range(79, 83))
ballroom_party = list(range(107, 110))
for source in lloyd_scenes:
    for target in ballroom_party:
        if source in id_to_index and target in id_to_index:
            if target not in scenes[id_to_index[source]].get('foreshadowing', []):
                if 'foreshadowing' not in scenes[id_to_index[source]]:
                    scenes[id_to_index[source]]['foreshadowing'] = []
                scenes[id_to_index[source]]['foreshadowing'].append(target)
                added_foreshadowing += 1
            if source not in scenes[id_to_index[target]].get('callbacks', []):
                if 'callbacks' not in scenes[id_to_index[target]]:
                    scenes[id_to_index[target]]['callbacks'] = []
                scenes[id_to_index[target]]['callbacks'].append(source)
                added_callbacks += 1

# REDRUM: Scene 111 should foreshadow 140, 163-165
redrum_discovery = 111
redrum_targets = [140] + list(range(163, 166))
for target in redrum_targets:
    if redrum_discovery in id_to_index and target in id_to_index:
        if target not in scenes[id_to_index[redrum_discovery]].get('foreshadowing', []):
            if 'foreshadowing' not in scenes[id_to_index[redrum_discovery]]:
                scenes[id_to_index[redrum_discovery]]['foreshadowing'] = []
            scenes[id_to_index[redrum_discovery]]['foreshadowing'].append(target)
            added_foreshadowing += 1
        if redrum_discovery not in scenes[id_to_index[target]].get('callbacks', []):
            if 'callbacks' not in scenes[id_to_index[target]]:
                scenes[id_to_index[target]]['callbacks'] = []
            scenes[id_to_index[target]]['callbacks'].append(redrum_discovery)
            added_callbacks += 1

# Scene 140 (Jack's manuscript) should foreshadow 141-146 (staircase attack)
manuscript = 140
staircase = list(range(141, 147))
for target in staircase:
    if manuscript in id_to_index and target in id_to_index:
        if target not in scenes[id_to_index[manuscript]].get('foreshadowing', []):
            if 'foreshadowing' not in scenes[id_to_index[manuscript]]:
                scenes[id_to_index[manuscript]]['foreshadowing'] = []
            scenes[id_to_index[manuscript]]['foreshadowing'].append(target)
            added_foreshadowing += 1
        if manuscript not in scenes[id_to_index[target]].get('callbacks', []):
            if 'callbacks' not in scenes[id_to_index[target]]:
                scenes[id_to_index[target]]['callbacks'] = []
            scenes[id_to_index[target]]['callbacks'].append(manuscript)
            added_callbacks += 1

# Maze: Scenes 30, 45-49 should foreshadow 210-230 (maze chase)
maze_intro = [30] + list(range(45, 50))
maze_chase = list(range(210, 231))
for source in maze_intro:
    for target in maze_chase:
        if source in id_to_index and target in id_to_index:
            if target not in scenes[id_to_index[source]].get('foreshadowing', []):
                if 'foreshadowing' not in scenes[id_to_index[source]]:
                    scenes[id_to_index[source]]['foreshadowing'] = []
                scenes[id_to_index[source]]['foreshadowing'].append(target)
                added_foreshadowing += 1
            if source not in scenes[id_to_index[target]].get('callbacks', []):
                if 'callbacks' not in scenes[id_to_index[target]]:
                    scenes[id_to_index[target]]['callbacks'] = []
                scenes[id_to_index[target]]['callbacks'].append(source)
                added_callbacks += 1

# "Here's Johnny" - Scene 175 should callback to earlier violence scenes
heres_johnny = 175
violence_scenes = [20, 72, 78] + list(range(141, 147))
for source in violence_scenes:
    if heres_johnny in id_to_index and source in id_to_index:
        # source foreshadows heres_johnny
        if heres_johnny not in scenes[id_to_index[source]].get('foreshadowing', []):
            if 'foreshadowing' not in scenes[id_to_index[source]]:
                scenes[id_to_index[source]]['foreshadowing'] = []
            scenes[id_to_index[source]]['foreshadowing'].append(heres_johnny)
            added_foreshadowing += 1
        # heres_johnny callbacks to source
        if source not in scenes[id_to_index[heres_johnny]].get('callbacks', []):
            if 'callbacks' not in scenes[id_to_index[heres_johnny]]:
                scenes[id_to_index[heres_johnny]]['callbacks'] = []
            scenes[id_to_index[heres_johnny]]['callbacks'].append(source)
            added_callbacks += 1

# Final photograph: Scene 231 should callback to Gold Ballroom scenes (107-109)
final_photo = 231
ballroom_scenes = list(range(107, 110)) + [79, 80, 81, 82]  # Lloyd and Gold Ballroom
for source in ballroom_scenes:
    if final_photo in id_to_index and source in id_to_index:
        # source foreshadows final_photo
        if final_photo not in scenes[id_to_index[source]].get('foreshadowing', []):
            if 'foreshadowing' not in scenes[id_to_index[source]]:
                scenes[id_to_index[source]]['foreshadowing'] = []
            scenes[id_to_index[source]]['foreshadowing'].append(final_photo)
            added_foreshadowing += 1
        # final_photo callbacks to source
        if source not in scenes[id_to_index[final_photo]].get('callbacks', []):
            if 'callbacks' not in scenes[id_to_index[final_photo]]:
                scenes[id_to_index[final_photo]]['callbacks'] = []
            scenes[id_to_index[final_photo]]['callbacks'].append(source)
            added_callbacks += 1

# Sort all foreshadowing and callback arrays
for scene in scenes:
    if 'foreshadowing' in scene:
        scene['foreshadowing'] = sorted(list(set(scene['foreshadowing'])))
    if 'callbacks' in scene:
        scene['callbacks'] = sorted(list(set(scene['callbacks'])))

# Final count
final_foreshadowing_count = sum(len(scene.get('foreshadowing', [])) for scene in scenes)
final_callback_count = sum(len(scene.get('callbacks', [])) for scene in scenes)

print(f"\nFinal foreshadowing links: {final_foreshadowing_count}")
print(f"Final callback links: {final_callback_count}")

# Verify bidirectional consistency
inconsistencies = 0
for scene in scenes:
    scene_id = scene['id']

    # Check callbacks have corresponding foreshadowing
    for callback_target in scene.get('callbacks', []):
        if callback_target in id_to_index:
            target_scene = scenes[id_to_index[callback_target]]
            if scene_id not in target_scene.get('foreshadowing', []):
                inconsistencies += 1
                print(f"Missing: Scene {callback_target} should foreshadow {scene_id}")

    # Check foreshadowing has corresponding callbacks
    for foreshadow_target in scene.get('foreshadowing', []):
        if foreshadow_target in id_to_index:
            target_scene = scenes[id_to_index[foreshadow_target]]
            if scene_id not in target_scene.get('callbacks', []):
                inconsistencies += 1
                print(f"Missing: Scene {foreshadow_target} should callback to {scene_id}")

print(f"\nRemaining inconsistencies: {inconsistencies}")

# Save the updated JSON
with open('/Users/fermibot/WebstormProjects/fermibotsite/pages/stories/StanleyKubrick_1980_TheShining/StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\nFile updated successfully!")
