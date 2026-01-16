#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

for scene in scenes:
    if scene['id'] == 133:
        # Scene 133 should end at PDF 134 only, not extend to 135
        scene['startPage'] = 134
        scene['endPage'] = 134  # NOT 135!
        scene['screenplayPage'] = 133

        # Remove "Jack's face yelling, looks down and turns away" which is from page 134
        scene['plotSummary'] = {
            "brief": "\"HERE'S JOHNNY!\" - Jack's face appears through splintered door, Wendy slashes his hand with knife",
            "detailed": "Jack swings axe, smashes away splintered wood. Wendy OFF: 'Stop it! Stop it!' INT. BEDROOM - M.S.: Jack swings axe at splintered door. Wendy OFF: 'Stop it!' Jack moves to gap in splintered door. WENDY SCREAMS OFF. INT. BATHROOM - M.C.S.: JACK'S FACE AT GAP IN SPLINTERED DOOR. 'Here's Johnny!' M.C.S.: Wendy holding knife SCREAMS. M.C.S.: Jack's smiling face at gap - he moves backwards and reaches hand through gap. M.C.S.: Jack's hand reaching through gap to key on inside of door. M.S.: WENDY STRIKES DOWN WITH KNIFE. M.C.S.: Jack's hand on key - WENDY'S KNIFE SLASHES ACROSS BACK OF HIS HAND and withdraws. Jack's hand moves to gap in door. JACK YELLS OFF.",
            "subtext": "MOST ICONIC MOMENT IN FILM - Jack's grinning face through splintered door. Johnny Carson reference becomes ultimate horror image. Wendy finally fights back successfully, slashing Jack's hand."
        }

        print(f"✓ Fixed Scene 133: PDF 134 only (removed overlap with 134)")

    elif scene['id'] == 134:
        # Scene 134 should be PDF 135 ONLY (screenplay page 134 ends before page 135 starts)
        scene['startPage'] = 135
        scene['endPage'] = 135  # NOT 136!
        scene['screenplayPage'] = 134

        # Scene 134 ends with "Snowcat stops" - does NOT include content from page 135
        print(f"✓ Fixed Scene 134: PDF 135 only (removed overlap with 135)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scenes 133-134 overlap removed!")
