#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 122
for scene in scenes:
    if scene['id'] == 122:
        # Update Scene 122 - Jack laughing, telling Wendy to check snowcat
        scene['plotSummary'] = {
            "brief": "Jack laughs and tells Wendy to check the Snowcat; Wendy runs outside to garage",
            "detailed": "INT. KITCHEN - M.S.: Wendy by food store door. Jack OFF: 'Go check out the Snowcat and the radio and see what I mean.' He laughs off. 'Go check it out!' INT. FOOD STORE ROOM - M.C.S.: Jack laughing. 'Go check it out!' (repeated twice, laughing). INT. HOTEL - CORRIDOR - M.L.S.: Wendy carrying knife runs forward, camera pans with her as she runs to door and forces it open. EXT. HOTEL - M.L.S.: Wendy forces door open against snow, runs along front of hotel.",
            "subtext": "Jack's cruel revelation - he sabotaged their only escape. Laughing maniacally as Wendy discovers the trap. Complete isolation confirmed."
        }

        scene['keyDialogue'] = [
            {
                "quote": "Go check out the Snowcat and the radio and see what I mean.",
                "speaker": "Jack (OFF)",
                "significance": "Jack reveals he sabotaged their escape - cruel taunt telling Wendy to discover his sabotage",
                "context": "Jack locked in pantry, laughing at Wendy"
            },
            {
                "quote": "Go check it out!",
                "speaker": "Jack",
                "significance": "Jack's repeated mocking command while laughing - enjoying Wendy's impending despair",
                "context": "Jack laughing in food store room, repeated twice"
            }
        ]

        scene['location'] = {
            "primary": "HOTEL KITCHEN, FOOD STORE, CORRIDOR, EXT. HOTEL",
            "description": "Interior - Kitchen with Wendy by pantry door, food store with Jack laughing inside, corridor to exterior door, exterior hotel grounds"
        }

        scene['characterDevelopment'] = {
            "Jack": {
                "state": "Locked in pantry, laughing maniacally, revealing sabotage with cruel pleasure",
                "arc": "Psychotic triumph - trapped but gloating over having destroyed Wendy's escape plan"
            },
            "Wendy": {
                "state": "Running to check snowcat, about to discover sabotage",
                "arc": "False hope about to be crushed - doesn't yet know Jack destroyed their escape"
            }
        }

        scene['thematicElements'] = [
            "Sabotage revealed",
            "Cruel triumph",
            "Isolation complete",
            "False hope"
        ]

        scene['significance'] = "CRITICAL REVELATION - Jack reveals he sabotaged the Snowcat and radio. His maniacal laughter as Wendy runs to discover his sabotage. Trapped family's isolation now absolute - no escape, no communication."

        print(f"✓ Updated Scene 122: Jack's laughing revelation")

    elif scene['id'] == 123:
        # Update Scene 123 - Garage scene with NO DIALOGUE
        scene['plotSummary'] = {
            "brief": "Wendy discovers damaged Snowcat in garage; BLACK FRAMES with '4 p.m.' time card",
            "detailed": "INT. HOTEL - GARAGE - M.S.: Snowcat in garage. Wendy seen through open doorway. She runs forward and enters garage, carrying knife. She stops at entrance. Then she moves toward Snowcat, and picks up distributor cap. CAMERA TRACKS IN on her, reacting to damaged distributor cap. CUT TO: BLACK FRAMES. Superimposed: '4 p.m.' CUT TO: EXT. HOTEL - L.S.: Overlook Hotel in background. Snow and trees in foreground.",
            "subtext": "Wendy's hope shattered - Snowcat disabled, escape impossible. Time card '4 p.m.' marks passage of time, Jack still locked in pantry."
        }

        scene['keyDialogue'] = []  # NO DIALOGUE in this scene

        scene['location'] = {
            "primary": "HOTEL GARAGE & EXT. HOTEL",
            "description": "Interior - Hotel garage with disabled Snowcat; Exterior - Long shot of Overlook Hotel in snow"
        }

        scene['characterDevelopment'] = {
            "Wendy": {
                "state": "Discovering Jack's sabotage - damaged distributor cap, complete despair",
                "arc": "Hope destroyed - realizes escape impossible, trapped with homicidal husband"
            },
            "Jack": {
                "state": "Locked in pantry (not present in scene)",
                "arc": "His sabotage discovered - Wendy now knows she's trapped"
            }
        }

        scene['thematicElements'] = [
            "Hope destroyed",
            "Sabotage discovered",
            "Complete isolation",
            "Despair",
            "Time passage"
        ]

        scene['supernaturalElements'] = []

        scene['significance'] = "DEVASTATING DISCOVERY - Wendy finds damaged Snowcat distributor cap, confirming Jack's sabotage. Silent scene - her reaction says everything. BLACK FRAMES with '4 p.m.' time card shows hours passing. Escape impossible, family trapped with murderous father."

        print(f"✓ Updated Scene 123: Garage discovery (NO DIALOGUE)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scenes 122-123 content fixed!")
