#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 127
for scene in scenes:
    if scene['id'] == 127:
        # Correct the location
        scene['location'] = {
            "primary": "OVERLOOK HOTEL - JACK'S APARTMENT",
            "description": "Interior - Jack's apartment at night, Danny writing MURDER on door, Wendy waking in bed"
        }

        # Correct the key dialogue
        scene['keyDialogue'] = [
            {
                "quote": "Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Tony's voice continuing as Danny starts writing MURDER in reverse on door",
                "context": "Danny at door with lipstick beginning to write"
            },
            {
                "quote": "Red Rum. Red Rum. Red Rum. Red Rum. Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Intensified repetition as Danny writes the complete REDRUM message",
                "context": "Danny writing MURDER backwards on door with lipstick"
            },
            {
                "quote": "Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Tony's voice as Danny finishes writing and looks at the word",
                "context": "Danny completing the reversed MURDER message"
            },
            {
                "quote": "Red Rum. Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Final repetitions as Danny turns and walks toward sleeping Wendy",
                "context": "Danny approaching Wendy's bed, message complete"
            },
            {
                "quote": "Red Rum. Red Rum. Red Rum.",
                "speaker": "Danny",
                "significance": "CRITICAL - Danny now speaking the words himself (not just Tony's voice), still in trance",
                "context": "Danny beside Wendy in bed after she wakes with shriek"
            },
            {
                "quote": "Danny. Danny, stop it. Danny!",
                "speaker": "Wendy",
                "significance": "Wendy alarmed by Danny's trance state, trying to break through to him",
                "context": "Wendy taking knife away from Danny"
            },
            {
                "quote": "Red Rum. Red Rum. Red Rum. Red Rum.",
                "speaker": "Danny",
                "significance": "Danny continuing to repeat Red Rum even as Wendy tries to stop him",
                "context": "Danny in Wendy's arms, still in trance state"
            }
        ]

        # Correct character development
        scene['characterDevelopment'] = {
            "Danny": {
                "state": "Writing MURDER in reverse on door with lipstick, then beside Wendy repeating 'Red Rum' out loud",
                "arc": "PIVOTAL - Danny completes psychic warning message, transitions from Tony controlling him to speaking 'Red Rum' himself, still in trance"
            },
            "Wendy": {
                "state": "Waking with shriek, taking knife from Danny, trying to snap him out of trance, pulling him close, looking over shoulder",
                "arc": "Wakes to find Danny in trance repeating 'Red Rum,' about to see MURDER message reflected in mirror"
            },
            "Tony": {
                "state": "Voice controlling Danny through first part of scene, guiding the writing of MURDER",
                "arc": "Tony's psychic warning nearly complete - message written for Wendy to discover"
            }
        }

        # Add thematic elements
        scene['thematicElements'] = [
            "REDRUM/MURDER message completed",
            "Psychic warning delivered",
            "Mother-son terror",
            "Trance breakthrough",
            "Mirror revelation setup"
        ]

        # Add supernatural elements
        scene['supernaturalElements'] = [
            "Tony's voice guiding Danny to write MURDER backwards",
            "Danny writing in reverse - REDRUM on door will read MURDER in mirror",
            "Danny speaking 'Red Rum' while in trance state",
            "Psychic message for Wendy to decode"
        ]

        # Update significance
        scene['significance'] = "ICONIC SCENE - Danny writes MURDER in reverse on bathroom door with lipstick while Tony's voice repeats 'Red Rum.' Completes writing, walks to Wendy. She wakes with shriek. Danny NOW SPEAKING 'Red Rum' himself (not just Tony's voice). Wendy tries to stop him, pulls him close, looks over shoulder - about to see REDRUM reflected as MURDER in mirror. Psychic warning message complete. One of most famous horror moments in cinema."

        print(f"✓ Fixed Scene 127: REDRUM/MURDER door writing")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 127 fixed!")
