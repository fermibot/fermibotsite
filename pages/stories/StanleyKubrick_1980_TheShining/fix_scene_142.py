#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

for scene in scenes:
    if scene['id'] == 142:
        # Scene 142 should be PDF 147-148 (screenplay pages 146-147)
        # This is the epilogue: Jack frozen dead, then the famous photograph reveal
        scene['title'] = "EXT. HOTEL - MAZE - DAY / INT. HOTEL - GOLD BALLROOM - M.C.S."
        scene['startPage'] = 147
        scene['endPage'] = 148
        scene['screenplayPage'] = 146

        scene['plotSummary'] = {
            "brief": "EPILOGUE: Jack frozen dead in maze; camera reveals July 4th Ball 1921 photograph with Jack in it",
            "detailed": "EXT. HOTEL - MAZE - DAY - M.C.S.: JACK SITTING UP TO HIS CHEST IN SNOW DEAD. SNOW AND ICICLES ON HIS FACE. INT. HOTEL - GOLD BALLROOM - M.L.S.: Entrance to Gold Ballroom - CAMERA TRACKS FORWARD through entrance to photographs on wall. CAMERA TRACKS IN close on photograph of Guests at Ball. DISSOLVE TO: M.S.: Photograph of Guests at Ball. DISSOLVE TO: M.C.S.: PHOTOGRAPH OF YOUNG MAN IN DINNER JACKET. CAMERA TILTS DOWN TO: 'OVERLOOK HOTEL / JULY 4th BALL / 1921'. FADE OUT. BLACK FRAMES.",
            "subtext": "FINAL SUPERNATURAL REVELATION - Jack frozen to death in maze (poetic justice - trapped by his own creation). BUT photograph proves Jack was ALWAYS at the Overlook, dating to 1921. The hotel owns him across time. He has 'always been the caretaker.' All events were predetermined - Jack was already part of hotel's eternal cycle. Reincarnation? Time loop? Possession? Film leaves ambiguous. The hotel's evil is eternal, transcends death and time."
        }

        scene['tags'] = [
            "jack-frozen-dead",
            "photograph-reveal",
            "july-4th-ball-1921",
            "epilogue",
            "supernatural-revelation",
            "time-paradox"
        ]

        scene['location'] = {
            "primary": "HEDGE MAZE & GOLD BALLROOM",
            "description": "Exterior - Hedge maze in daylight with Jack's frozen corpse; Interior - Gold Ballroom with photographs on wall"
        }

        # NO DIALOGUE - purely visual epilogue
        scene['keyDialogue'] = []

        scene['characterDevelopment'] = {
            "Jack": {
                "state": "Dead - frozen in maze, then revealed in 1921 photograph",
                "arc": "FINAL STATE - Jack dies alone in maze, frozen solid with snow and icicles on face. But photograph reveals he was at July 4th Ball 1921 - he 'always was' part of the hotel. Death is not the end - Jack is eternally trapped in the Overlook's timeless evil."
            },
            "Danny": {
                "state": "Not present - has escaped with Wendy",
                "arc": "Survived and escaped"
            },
            "Wendy": {
                "state": "Not present - has escaped with Danny",
                "arc": "Survived and escaped"
            }
        }

        scene['thematicElements'] = [
            "Eternal recurrence",
            "Time paradox",
            "Hotel's timeless evil",
            "Poetic justice - Jack trapped in maze",
            "Supernatural possession across time",
            "Death is not escape"
        ]

        scene['supernaturalElements'] = [
            "Jack appears in 1921 photograph despite dying in 1980 - proof of reincarnation, time loop, or eternal possession by hotel"
        ]

        scene['tensionLevel'] = 10

        scene['significance'] = "FILM'S FINAL TWIST - Most debated ending in cinema. Jack frozen dead in maze (immediate justice), but photograph reveals deeper horror: Jack WAS at July 4th Ball 1921, decades before his birth. Validates Grady's 'You've always been the caretaker.' Options: (1) Reincarnation - Jack is reborn soul of 1921 guest, (2) Time loop - events repeat eternally, (3) Possession - hotel absorbed Jack's soul retroactively into its history, (4) Jack always existed in hotel's timeless dimension. Regardless of interpretation, message is clear: The Overlook's evil transcends time and death. Jack is eternally trapped. Danny and Wendy escaped physically but Jack is prisoner forever. FADE OUT to BLACK - finality and ambiguity combined."

        print(f"✓ Fixed Scene 142: PDF 147-148 (screenplay 146-147)")
        print(f"  - Changed from wrong 'Hotel lobby' to correct epilogue")
        print(f"  - Added Jack frozen dead in maze")
        print(f"  - Added famous July 4th Ball 1921 photograph reveal")
        print(f"  - NO DIALOGUE (purely visual ending)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 142 fixed - the iconic epilogue!")
