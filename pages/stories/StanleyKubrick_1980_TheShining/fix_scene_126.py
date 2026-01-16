#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 126
for scene in scenes:
    if scene['id'] == 126:
        # Correct the location
        scene['location'] = {
            "primary": "HOTEL - JACK'S APARTMENT",
            "description": "Interior - Jack's apartment at night, Danny in trance, Wendy asleep in bed"
        }

        # Correct the key dialogue - only Tony's voice repeating "Red Rum"
        scene['keyDialogue'] = [
            {
                "quote": "Red Rum. Red Rum. Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "ICONIC - Tony's voice repeating 'Red Rum' throughout scene, controlling Danny's actions",
                "context": "Danny moving toward sleeping Wendy, repeated continuously"
            },
            {
                "quote": "Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Continuing mantra as Danny reaches for knife",
                "context": "Danny at bedside table picking up knife"
            },
            {
                "quote": "Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Voice continuing as Danny examines knife blade",
                "context": "Danny holding knife, feeling blade"
            },
            {
                "quote": "Red Rum. Red Rum. Red Rum. Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Intensifying repetition as Danny walks to dressing table",
                "context": "Danny walking with knife raised"
            },
            {
                "quote": "Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Voice continuing as Danny picks up lipstick - gathering tools for message",
                "context": "Danny at dressing table picking up lipstick"
            },
            {
                "quote": "Red Rum. Red Rum. Red Rum.",
                "speaker": "Tony's Voice",
                "significance": "Final repetitions as Danny walks to door to write message",
                "context": "Danny walking to door with knife and lipstick"
            }
        ]

        # Correct character development
        scene['characterDevelopment'] = {
            "Danny": {
                "state": "Deep trance state, completely controlled by Tony, picking up knife and lipstick, walking to door",
                "arc": "DEEPEST TRANCE - Danny as vessel for psychic warning, Tony controlling every action, gathering tools to write REDRUM message"
            },
            "Wendy": {
                "state": "Asleep in bed, unaware of Danny's trance, stirring slightly",
                "arc": "Sleeping through Danny's possession, about to receive psychic warning message"
            },
            "Tony": {
                "state": "Controlling Danny completely through repeated 'Red Rum' mantra",
                "arc": "Tony's power at maximum - using Danny to deliver warning about Jack's murder intent"
            }
        }

        # Add thematic elements
        scene['thematicElements'] = [
            "Psychic possession",
            "Warning delivered",
            "REDRUM/MURDER reversal",
            "Trance state",
            "Mother-son connection",
            "Supernatural protection"
        ]

        # Add supernatural elements
        scene['supernaturalElements'] = [
            "Tony's voice controlling Danny's actions",
            "Deep trance state - Danny as psychic vessel",
            "Preparation for REDRUM message (MURDER spelled backwards)"
        ]

        # Update significance
        scene['significance'] = "CRITICAL SUPERNATURAL SCENE - Danny in deepest trance, completely controlled by Tony's repeated 'Red Rum' mantra. Picks up knife and lipstick while Wendy sleeps. Tony using Danny as vessel to deliver psychic warning. Scene is almost entirely Tony's voice repeating 'Red Rum' (MURDER backwards) as Danny mechanically gathers tools to write message. Eerie, hypnotic sequence showing Danny's psychic power at maximum."

        print(f"✓ Fixed Scene 126: Danny's Red Rum trance")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 126 fixed!")
