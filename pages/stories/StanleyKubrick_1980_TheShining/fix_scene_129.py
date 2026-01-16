#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 129
for scene in scenes:
    if scene['id'] == 129:
        # Correct the location
        scene['location'] = {
            "primary": "BATHROOM, CORRIDOR, APARTMENT & EXT. HOTEL",
            "description": "Interior - Bathroom with Wendy and Danny at window, corridor with Jack swinging axe, apartment with Jack pulling wood from door panel; Exterior - Hotel with bathroom window and snow slope"
        }

        # Correct the key dialogue - ONE ICONIC LINE
        scene['keyDialogue'] = [
            {
                "quote": "Wendy, I'm home.",
                "speaker": "Jack",
                "significance": "ICONIC LINE - Jack's sinister greeting as he looks through gap in splintered door panel, mockery of domestic normalcy while attempting murder",
                "context": "Jack at gap in splintered apartment door panel, looking through at Wendy and Danny"
            }
        ]

        # Correct character development
        scene['characterDevelopment'] = {
            "Wendy": {
                "state": "Trying to force window higher, looking out, drawing back, lifting Danny to window, pushing Danny out onto snow, struggling to fit through window herself - CANNOT ESCAPE",
                "arc": "MOTHER'S SACRIFICE - Successfully pushes Danny out window to safety but window too small for her to escape. Trapped. Danny saved, Wendy doomed."
            },
            "Danny": {
                "state": "Clinging to Wendy in bathroom, hearing axe splintering door, lifted to window, pushed out onto snow, sliding down, standing up, looking up at trapped Wendy",
                "arc": "ESCAPED - Mother sacrifices own escape to save him. Now outside, safe but helpless, watching mother trapped."
            },
            "Jack": {
                "state": "Swinging axe at door, pulling wood from splintered panel, looking through gap, saying 'Wendy, I'm home,' unlocking door, walking through apartment with axe",
                "arc": "METHODICAL KILLER - Breaking through door, mocking greeting through gap, unlocking door from inside. Hunting family with axe. About to enter apartment."
            }
        }

        # Add thematic elements
        scene['thematicElements'] = [
            "Mother's sacrifice",
            "Child's escape",
            "Window too small",
            "Trapped victim",
            "Domestic horror",
            "Mockery of normalcy"
        ]

        # Add supernatural elements
        scene['supernaturalElements'] = []

        # Update significance
        scene['significance'] = "CRITICAL ESCAPE/TRAP SCENE - Rapid intercutting creates unbearable tension. Wendy forces window open, Danny hears axe. Jack swinging at door. Wendy looks out window. Jack pulls wood from splintered panel, looks through gap: 'Wendy, I'm home' (ICONIC LINE - domestic greeting while murdering). Jack unlocks door. Wendy pushes Danny out window onto snow - he slides down safely. Wendy tries to escape but WINDOW TOO SMALL - cannot fit. Jack walking through apartment with axe. Danny escaped but Wendy trapped. Mother saved child but doomed herself. Heartbreaking visual storytelling."

        # Add foreshadowing and callbacks
        scene['foreshadowing'] = [130, 131, 132, 133]
        scene['callbacks'] = [128]

        print(f"✓ Fixed Scene 129: Window escape attempt, 'Wendy, I'm home'")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 129 fixed!")
