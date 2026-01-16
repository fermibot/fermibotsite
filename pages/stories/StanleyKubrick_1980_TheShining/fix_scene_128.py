#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 128
for scene in scenes:
    if scene['id'] == 128:
        # Correct the location
        scene['location'] = {
            "primary": "JACK'S APARTMENT, CORRIDOR & BATHROOM",
            "description": "Interior - Jack's apartment with mirror reflecting MURDER message, corridor with Jack swinging axe, bathroom where Wendy and Danny flee"
        }

        # NO DIALOGUE in this scene - only sound effects and visual action
        scene['keyDialogue'] = []

        # Correct character development
        scene['characterDevelopment'] = {
            "Wendy": {
                "state": "Seeing MURDER reflected in mirror, shrieking, grabbing Danny, fleeing to bathroom, locking door, moving to window",
                "arc": "CRITICAL REALIZATION - Sees REDRUM as MURDER in mirror, realizes Jack's intent. Terror and survival instinct activated. Flees with Danny to bathroom as Jack axes through apartment door."
            },
            "Danny": {
                "state": "Held by Wendy as she flees to bathroom, clinging to her in terror",
                "arc": "Rescued by mother, carried to bathroom safety while Jack attacks with axe"
            },
            "Jack": {
                "state": "Freed from pantry, attacking apartment door with axe, splintering panels",
                "arc": "MURDEROUS RAMPAGE BEGINS - Jack attacking with axe to reach Wendy and Danny. First door assault. Methodically chopping through to kill his family."
            }
        }

        # Add thematic elements
        scene['thematicElements'] = [
            "MURDER revealed",
            "Mirror truth",
            "Family hunted",
            "Escape to bathroom",
            "Axe violence",
            "Mother protecting child"
        ]

        # Add supernatural elements
        scene['supernaturalElements'] = [
            "REDRUM message decoded - mirror reveals MURDER",
            "Danny's psychic warning realized by Wendy"
        ]

        # Update significance
        scene['significance'] = "ICONIC REVELATION SCENE - Wendy sees REDRUM reflected as MURDER in mirror. Camera zooms on word. SOUND OF AXE STRIKING DOOR. Shrieking, Wendy grabs Danny and flees. Rapid intercutting: Jack swinging axe at apartment door / Wendy getting up / Jack chopping door / Wendy fleeing to bathroom door (with MURDER written on it) / Locks bathroom door / Jack splintering panel / Wendy and Danny moving to window. NO DIALOGUE - purely visual terror with sound effects. Danny's psychic warning fulfilled. Bathroom siege begins."

        # Add foreshadowing and callbacks
        scene['foreshadowing'] = [131, 132, 133]
        scene['callbacks'] = [126, 127]

        print(f"✓ Fixed Scene 128: MURDER mirror reveal (NO DIALOGUE)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 128 fixed!")
