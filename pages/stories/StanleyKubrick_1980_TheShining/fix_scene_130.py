#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 130
for scene in scenes:
    if scene['id'] == 130:
        # Correct the location
        scene['location'] = {
            "primary": "BEDROOM, BATHROOM & EXT. HOTEL",
            "description": "Interior - Bedroom with Jack at bathroom door, bathroom with Wendy trapped; Exterior - Hotel showing Wendy at window calling to Danny below on snow"
        }

        # Correct the key dialogue
        scene['keyDialogue'] = [
            {
                "quote": "Danny, I can't get out!",
                "speaker": "Wendy",
                "significance": "HEARTBREAKING - Wendy realizes window too small, she's trapped, calling to Danny outside",
                "context": "Wendy with head out bathroom window, Danny at foot of snow slope below"
            },
            {
                "quote": "Run, run and hide. Run, quick!",
                "speaker": "Wendy",
                "significance": "MOTHER'S FINAL COMMAND - Wendy sending Danny to safety, sacrificing herself to save him",
                "context": "Wendy at window calling down to Danny, Jack approaching bathroom door"
            },
            {
                "quote": "Little pigs, little pigs, let me come in!",
                "speaker": "Jack",
                "significance": "ICONIC FAIRY TALE THREAT - Jack beginning Three Little Pigs nursery rhyme, mocking domesticity before violence",
                "context": "Jack at bathroom door after Wendy trapped, about to break through with axe"
            }
        ]

        # Correct character development
        scene['characterDevelopment'] = {
            "Wendy": {
                "state": "Struggling to escape through window, realizing she's trapped, calling to Danny, sending him to safety, picking up knife, positioning at side of door",
                "arc": "MOTHER'S SACRIFICE - Cannot escape through window. Tells Danny to run and hide. Arms herself with knife for final stand against Jack's axe."
            },
            "Danny": {
                "state": "Standing at foot of snow slope looking up at trapped mother, hearing her final command, running away to safety",
                "arc": "SAVED BUT ALONE - Mother successfully pushed him to safety but now he's alone in freezing night while mother faces killer father"
            },
            "Jack": {
                "state": "Walking into bedroom with axe, stopping at bathroom door, rapping on door, beginning fairy tale threat",
                "arc": "PLAYFUL MENACE - Jack at bathroom door, starting Three Little Pigs nursery rhyme before axe attack. Mocking childhood innocence before violence."
            }
        }

        # Add thematic elements
        scene['thematicElements'] = [
            "Mother's sacrifice",
            "Child sent to safety",
            "Window trap",
            "Fairy tale horror",
            "Predator at door",
            "Domestic violence"
        ]

        # Add supernatural elements
        scene['supernaturalElements'] = []

        # Update significance
        scene['significance'] = "PIVOTAL MOMENT - Wendy realizes window too small to escape. Calls to Danny: 'Danny, I can't get out!' Then makes sacrifice: 'Run, run and hide. Run, quick!' Danny runs away to safety. Jack enters bedroom, stops at bathroom door, RAPS ON DOOR. Wendy at window watching Danny escape. Jack begins fairy tale threat: 'Little pigs, little pigs, let me come in!' Wendy picks up knife, positions herself at side of bathroom door. Mother saved child but now faces murderous husband alone. Jack's nursery rhyme mockery before violence. Final confrontation imminent."

        # Add foreshadowing and callbacks
        scene['foreshadowing'] = [131, 132, 133]
        scene['callbacks'] = [129]

        print(f"✓ Fixed Scene 130: 'Danny, I can't get out!' and 'Little pigs, little pigs'")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 130 fixed!")
