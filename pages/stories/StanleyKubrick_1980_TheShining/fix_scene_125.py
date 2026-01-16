#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 125
for scene in scenes:
    if scene['id'] == 125:
        # Correct the location
        scene['location'] = {
            "primary": "EXT. ROAD & INT. HALLORAN'S SNOWCAT",
            "description": "Exterior - Snow-covered road at night through trees; Interior - Halloran's snowcat cab with wipers working through windscreen"
        }

        # NO DIALOGUE in this scene - it's purely visual
        scene['keyDialogue'] = []

        # Update character development
        scene['characterDevelopment'] = {
            "Halloran": {
                "state": "Driving snowcat through treacherous night storm, wipers working, determined focus",
                "arc": "Heroic rescue journey continuing - pushing through dangerous blizzard conditions to reach hotel and save Danny/Wendy"
            }
        }

        # Add thematic elements
        scene['thematicElements'] = [
            "Heroic rescue",
            "Determination",
            "Journey through darkness",
            "Race against time",
            "Isolation of mountain roads"
        ]

        # Update significance
        scene['significance'] = "VISUAL SEQUENCE - Halloran's dangerous journey through night storm. Three dissolving shots show his progress: exterior road through trees, interior driving view, behind-shoulder windscreen shot with wipers. Silent determination. Intercutting with Jack's liberation by Grady creates dramatic irony - hero approaching as villain freed. Race against time."

        print(f"✓ Fixed Scene 125: Halloran driving (NO DIALOGUE)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 125 fixed!")
