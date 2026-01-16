#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and enhance scene 142 (the final scene)
for scene in scenes:
    if scene['id'] == 142:
        # Enhance with maximum detail for the iconic ending
        scene['title'] = "EXT. HOTEL - MAZE - DAY / INT. HOTEL - GOLD BALLROOM - M.C.S."
        scene['startPage'] = 147
        scene['endPage'] = 148
        scene['screenplayPage'] = 146
        scene['act'] = "epilogue"
        scene['psychologicalState'] = "resolution"

        scene['plotSummary'] = {
            "brief": "EPILOGUE: Jack frozen dead in maze; camera reveals July 4th Ball 1921 photograph with Jack in it - 'He's always been the caretaker'",
            "detailed": "EXT. HOTEL - MAZE - DAY - M.C.S.: JACK SITTING UP TO HIS CHEST IN SNOW DEAD. SNOW AND ICICLES ON HIS FACE. His frozen corpse sits upright in the hedge maze, eyes open, covered in frost. The hunter became the hunted - trapped in the maze he knew by heart. Daylight has come, revealing his fate. CUT TO: INT. HOTEL - GOLD BALLROOM - M.L.S.: Entrance to Gold Ballroom - CAMERA TRACKS FORWARD through entrance to photographs on wall. The camera moves steadily through the empty ballroom, past the bar where Lloyd served drinks, toward the gallery of black and white photographs documenting the hotel's history. CAMERA TRACKS IN close on photograph of Guests at Ball. DISSOLVE TO: M.S.: Photograph of Guests at Ball. The image shows elegantly dressed men and women from the 1920s at a formal celebration. DISSOLVE TO: M.C.S.: PHOTOGRAPH OF YOUNG MAN IN DINNER JACKET. The camera pushes in on one particular face in the crowd - a young man in formal attire, smiling at the camera. It is unmistakably JACK TORRANCE. CAMERA TILTS DOWN TO reveal the caption beneath the photograph: 'OVERLOOK HOTEL / JULY 4th BALL / 1921'. Jack was there, decades before his birth. He has always been part of the hotel. FADE OUT. BLACK FRAMES. The film ends in darkness, leaving the supernatural mystery unresolved.",
            "subtext": "THE FILM'S ULTIMATE HORROR - Jack's physical death in the maze is poetic justice (the creator trapped by his creation), but the photograph reveals the deeper, inescapable truth: Jack was ALWAYS part of the Overlook Hotel. The 1921 date places him at the hotel 59 years before the film's events, decades before he was even born. This validates every supernatural claim: Grady saying 'You've always been the caretaker,' the hotel 'choosing' Jack, his sense of déjà vu. Time itself is broken at the Overlook. Interpretations: (1) Reincarnation - Jack is the reborn soul of a 1921 guest, doomed to repeat the cycle; (2) Time loop - events recur eternally, Jack will return again; (3) Retroactive possession - the hotel absorbed Jack's soul and inserted him into its past; (4) Eternal present - all time exists simultaneously in the hotel's dimension. Regardless: The hotel's evil transcends death, time, and reality. Danny and Wendy escaped physically, but Jack is imprisoned FOREVER, existing in multiple time periods simultaneously. The fade to black is both conclusive (Jack is dead) and inconclusive (but he exists in 1921). The Overlook's cycle continues."
        }

        scene['tags'] = [
            "jack-frozen-dead",
            "photograph-reveal",
            "july-4th-ball-1921",
            "epilogue",
            "final-scene",
            "supernatural-revelation",
            "time-paradox",
            "eternal-recurrence",
            "kubrick-ambiguity"
        ]

        scene['location'] = {
            "primary": "HEDGE MAZE (DAY) & GOLD BALLROOM",
            "description": "Exterior - Hedge maze in full daylight, revealing Jack's frozen corpse sitting in snow; Interior - Gold Ballroom's photograph gallery, specifically the wall displaying historical hotel photographs from various eras, culminating in the July 4th Ball 1921 group photo"
        }

        scene['time'] = {
            "narrative": "Friday morning (Jack's death) / Timeless (photograph from 1921)",
            "runtime": "",
            "approximate": "Final scene - Pages 146-147"
        }

        # NO DIALOGUE - purely visual epilogue with profound silence
        scene['keyDialogue'] = []

        scene['characterDevelopment'] = {
            "Jack": {
                "state": "Dead - frozen corpse in maze, simultaneously alive in 1921 photograph",
                "arc": "FINAL TRANSFORMATION COMPLETE - Jack's journey ends in death by freezing in the maze (immediate consequence of his actions), but the photograph reveals his journey had no beginning. He exists in 1921, meaning he was ALWAYS part of the hotel's evil. His possession was not a change but a return. The hotel didn't corrupt Jack - it reclaimed what was already its own. He is both victim (trapped forever) and perpetrator (always was the murderous caretaker). Death is not escape - it's the beginning of eternal imprisonment. He sits frozen in the maze for eternity while simultaneously attending the eternal July 4th Ball."
            },
            "Danny": {
                "state": "Escaped with Wendy in Halloran's Snowcat - not present",
                "arc": "SURVIVOR - Danny's intelligence (footprint trick) and courage defeated Jack and the hotel. He and Wendy drove away to safety. But the photograph suggests the horror is not over - the hotel remains, waiting."
            },
            "Wendy": {
                "state": "Escaped with Danny in Halloran's Snowcat - not present",
                "arc": "SURVIVOR - Maternal love and determination saved herself and Danny. She overcame impossible odds. But they leave behind a malevolent force that transcends time."
            }
        }

        scene['thematicElements'] = [
            "Eternal recurrence - 'All work and no play' cycle never ends",
            "Time paradox - Jack exists in both 1921 and 1980",
            "Inescapable fate - Jack was always meant to be here",
            "Hotel's timeless evil - The Overlook exists outside normal time",
            "Poetic justice - Creator trapped by creation (maze)",
            "Death is not escape - Jack's imprisonment is eternal",
            "Ambiguity - Kubrick refuses to explain, lets audience interpret",
            "The past is never past - History repeats, or never left",
            "Sacrifice - Halloran died so Danny and Wendy could escape",
            "Intelligence vs. brute force - Danny's cleverness defeats Jack's violence"
        ]

        scene['supernaturalElements'] = [
            "Jack appears in 1921 photograph despite dying in 1980 - definitive proof of supernatural forces",
            "Time manipulation - Hotel can place people in its past",
            "Soul absorption - Hotel has claimed Jack's soul across decades",
            "Eternal imprisonment - Jack exists simultaneously in multiple time periods",
            "Grady's prophecy fulfilled - 'You've always been the caretaker' proven true",
            "The Overlook as timeless entity - exists outside normal causality"
        ]

        scene['callbacks'] = [
            1,   # Opening - The Shining title
            25,  # Stuart: 'The Overlook has a great history'
            26,  # Ullman's tour showing hotel's past
            38,  # Tour of Gold Ballroom
            60,  # 'I feel like I've been here before'
            72,  # July 4th Ball begins - Grady: 'You've always been the caretaker'
            90,  # Photograph gallery established
            124, # Grady: 'You've always been the caretaker. I should know sir, I've always been here'
            140, # Jack tracking Danny through maze (his final hunt)
            141  # Jack collapses in maze, sets up this reveal
        ]

        scene['cinematicElements'] = [
            "Steadicam tracking shot through Gold Ballroom - Kubrick's signature smooth camera movement",
            "Series of dissolves on photographs - time collapsing into itself",
            "Slow zoom into Jack's face in 1921 photo - gradual horrifying recognition",
            "Camera tilt down to reveal date - building tension to revelation",
            "Fade out to black frames - absolute finality combined with eternal ambiguity",
            "Natural lighting on frozen Jack - harsh daylight reveals his fate",
            "The camera as investigator - discovering truth independently of characters",
            "Symmetrical framing of photograph - Kubrick's geometric precision",
            "Silence - no music, no dialogue, only the weight of revelation"
        ]

        scene['tensionLevel'] = 10

        scene['significance'] = "THE MOST ICONIC AND DEBATED ENDING IN CINEMA HISTORY - Kubrick's masterpiece concludes with two devastating revelations: (1) IMMEDIATE JUSTICE: Jack frozen to death in the maze, eyes open, covered in snow and icicles - poetic justice for the hunter trapped by his own creation. Daylight exposes his failure. (2) ETERNAL HORROR: The photograph reveals Jack was at the July 4th Ball 1921, standing among guests 59 years before the film's events, decades before his own birth. This image fundamentally rewrites everything we've witnessed. It proves: Grady was telling the truth ('You've always been the caretaker'), the hotel DID recognize Jack ('I feel like I've been here before'), and Jack's possession wasn't corruption but RECLAMATION. The hotel didn't change Jack - it simply called him home. INTERPRETATIONS: Film scholars and audiences have debated for decades: Is it reincarnation (Jack reborn)? Time loop (events repeat eternally)? Retroactive possession (hotel absorbed his soul backward through time)? Eternal present (all time simultaneous at Overlook)? Kubrick deliberately provides NO ANSWER. The photograph is fact. The explanation is mystery. TECHNICAL BRILLIANCE: No dialogue. No music. Just the steady camera movement revealing truth, the dissolves collapsing time, the slow zoom recognizing Jack's face, the tilt revealing '1921,' and the fade to black. Silence speaks volumes. THEMATIC CULMINATION: Every theme converges - time is broken, evil is eternal, history repeats, individuals are powerless against cosmic forces, the past consumes the present, and some prisons transcend death. Danny and Wendy escaped with their lives but Jack is trapped FOREVER, existing simultaneously frozen in the maze and smiling at the 1921 ball. The Overlook remains, patient, waiting for the next caretaker who has 'always been here.' FADE OUT. THE END."

        print(f"✓ Enhanced Scene 142 with extensive detail")
        print(f"  - Added detailed visual description of frozen Jack")
        print(f"  - Expanded photograph reveal sequence")
        print(f"  - Added comprehensive thematic analysis")
        print(f"  - Added cinematic elements breakdown")
        print(f"  - Added callbacks to all relevant earlier scenes")
        print(f"  - Enhanced significance section with full interpretation")

# Remove all scenes after 142 (scenes 143-231)
original_count = len(scenes)
data['scenes'] = [scene for scene in scenes if scene['id'] <= 142]
new_count = len(data['scenes'])
removed_count = original_count - new_count

print(f"\n✓ Removed {removed_count} extra scenes (143-{original_count})")
print(f"  - Film correctly ends at Scene 142")
print(f"  - Total scenes now: {new_count}")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 142 enhanced and all extra scenes removed!")
print(f"✅ The Shining now correctly contains {new_count} scenes total")
