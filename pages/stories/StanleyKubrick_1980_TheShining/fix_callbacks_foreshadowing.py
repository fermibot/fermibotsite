#!/usr/bin/env python3
"""
Fix callbacks and foreshadowing references for all scenes
Creates meaningful connections between scenes
"""
import json

# Key scene connections
SCENE_CONNECTIONS = {
    # Opening titles and arrival
    1: {"foreshadows": [142]},  # Opening foreshadows ending photograph

    # Interview scenes
    2: {"foreshadows": [72, 124]},  # Ullman mentions Grady murders

    # Danny's first shining visions
    11: {"foreshadows": [95, 96, 126, 127, 128]},  # Blood elevator vision
    12: {"foreshadows": [75, 76]},  # Twins vision

    # "How do you like it?" - Danny injured
    18: {"callbacks": [2], "foreshadows": [90, 91]},  # Injury references interview, foreshadows Jack's denial

    # Tour of hotel
    38: {"foreshadows": [72, 142]},  # Gold Ballroom tour foreshadows party

    # Closing day/Last staff
    49: {"callbacks": [38], "foreshadows": [105, 106, 107, 108]},  # Halloran teaches Danny about Shining

    # One month later - isolation begins
    60: {"callbacks": [1, 2, 38]},  # Callbacks to opening

    # Jack's first supernatural encounter - Lloyd
    72: {"callbacks": [2, 38], "foreshadows": [84, 124]},  # July 4th Ball begins

    # Grady twins
    75: {"callbacks": [12], "foreshadows": [76]},  # Fulfills vision
    76: {"callbacks": [12, 75]},  # Second twins encounter

    # Room 237
    83: {"callbacks": [2], "foreshadows": [84, 85, 86]},  # Danny enters 237
    84: {"callbacks": [83]},  # Woman in bathtub
    85: {"callbacks": [83, 84]},  # Jack checks 237
    86: {"callbacks": [83, 84, 85]},  # Jack lies about 237

    # Jack and Wendy argument
    90: {"callbacks": [18], "foreshadows": [95]},  # References Danny's injury
    91: {"callbacks": [18, 90], "foreshadows": [110, 111]},  # Escalating tension

    # Blood elevator vision fulfilled
    95: {"callbacks": [11]},  # Danny's vision comes true
    96: {"callbacks": [11, 95]},  # More blood

    # Grady bathroom conversation
    124: {"callbacks": [2, 72], "foreshadows": [130, 131, 132, 133]},  # "You've always been the caretaker"

    # "All work and no play"
    110: {"callbacks": [60, 72], "foreshadows": [111, 112]},  # Manuscript discovery

    # Baseball bat confrontation
    111: {"callbacks": [90, 91, 110], "foreshadows": [113, 114]},  # Staircase fight
    112: {"callbacks": [111], "foreshadows": [120, 121]},  # Wendy locks Jack in pantry

    # Jack released by Grady
    120: {"callbacks": [72, 112, 124], "foreshadows": [130]},  # Grady releases Jack

    # Radio destroyed
    121: {"callbacks": [112, 120]},  # Jack sabotages escape

    # Halloran's rescue attempt
    136: {"callbacks": [49, 105, 106], "foreshadows": [140]},  # Halloran killed

    # "Here's Johnny!"
    133: {"callbacks": [124, 130, 131, 132], "foreshadows": [134, 135]},  # Iconic moment

    # Danny's footprint trick
    140: {"callbacks": [136], "foreshadows": [141]},  # Jack tracking Danny
    141: {"callbacks": [140], "foreshadows": [142]},  # Escape and Jack's collapse

    # Final photograph
    142: {"callbacks": [1, 2, 38, 72, 124], "foreshadows": []},  # Epilogue ties everything together
}

# Load scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

print("Fixing callbacks and foreshadowing references...\n")

# Apply connections
for scene in scenes:
    scene_id = scene['id']

    if scene_id in SCENE_CONNECTIONS:
        connections = SCENE_CONNECTIONS[scene_id]

        if 'callbacks' in connections:
            scene['callbacks'] = connections['callbacks']

        if 'foreshadows' in connections:
            scene['foreshadowing'] = connections['foreshadows']
    else:
        # Default empty arrays if no specific connections
        if 'callbacks' not in scene:
            scene['callbacks'] = []
        if 'foreshadowing' not in scene:
            scene['foreshadowing'] = []

print(f"✓ Applied {len(SCENE_CONNECTIONS)} scene connections")

# Add automatic callbacks for supernatural scenes
for scene in scenes:
    scene_id = scene['id']
    tags = scene.get('tags', [])

    # Grady scenes callback to first Grady encounter
    if 'grady' in tags and scene_id > 72:
        if 72 not in scene.get('callbacks', []):
            scene['callbacks'].append(72)

    # Room 237 scenes callback to first entry
    if 'room-237' in tags and scene_id > 83:
        if 83 not in scene.get('callbacks', []):
            scene['callbacks'].append(83)

    # Blood elevator scenes callback to first vision
    if 'blood-elevator' in tags and scene_id > 11:
        if 11 not in scene.get('callbacks', []):
            scene['callbacks'].append(11)

    # Twins scenes callback to first vision
    if 'grady-twins' in tags and scene_id > 12:
        if 12 not in scene.get('callbacks', []):
            scene['callbacks'].append(12)

    # Sort and deduplicate
    scene['callbacks'] = sorted(list(set(scene.get('callbacks', []))))
    scene['foreshadowing'] = sorted(list(set(scene.get('foreshadowing', []))))

print(f"✓ Added automatic callbacks based on tags")

# Save
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"\n✅ All callbacks and foreshadowing fixed!")
print(f"✅ File saved!")
