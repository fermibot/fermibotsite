#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

for scene in scenes:
    if scene['id'] == 132:
        # Scene 132 should be ONLY screenplay page 132 (PDF 133)
        # Should NOT include "Stop it! Stop it!" which is on page 133

        scene['startPage'] = 133
        scene['endPage'] = 133  # Only page 133, not 134!
        scene['screenplayPage'] = 132

        scene['plotSummary'] = {
            "brief": "Jack completes fairy tale threat and begins axing through bathroom door; Wendy pleads",
            "detailed": "INT. BEDROOM - M.C.S.: Jack at bathroom door completes Three Little Pigs rhyme: 'Not by the hair on your chiny, chin, chin. Then I'll huff, and I'll puff...' M.S.: Jack holds axe back to camera at door: '...and I'll blow your house in.' He swings axe back. M.S.: Jack swings axe TWICE at bathroom door. WENDY SCREAMS OFF. INT. BATHROOM - M.S.: Wendy standing at side of door. Jack's axe appears through door repeatedly, splintering it. Wendy screams. 'Jack. Please. Don't... Don't...' Head of axe appears through splintered door. Wendy screams 'Don't! Oh! Please...' Head of axe appears again. 'Stop!' M.C.S. Splintered door panel. Wendy OFF: 'Jack!'",
            "subtext": "Jack's playful fairy tale becomes horrifying reality - literal axe-murderer 'huffing and puffing' to break through door. Wendy begging for mercy."
        }

        scene['keyDialogue'] = [
            {
                "quote": "Not by the hair on your chiny, chin, chin. Then I'll huff, and I'll puff and I'll blow your house in.",
                "speaker": "Jack",
                "significance": "ICONIC COMPLETION - Jack finishes Three Little Pigs fairy tale before literal axe assault on 'house' (door)",
                "context": "Jack at bathroom door, completing fairy tale threat before swinging axe"
            },
            {
                "quote": "Jack. Please. Don't... Don't... Don't! Oh! Please... Stop! Jack!",
                "speaker": "Wendy",
                "significance": "Wendy's desperate pleas - repeating Jack's name, begging for mercy as axe smashes through door",
                "context": "Wendy's terror as axe repeatedly appears through bathroom door, splintering it"
            }
        ]

        print(f"✓ Fixed Scene 132: PDF 133-133 only (removed overlap)")

    elif scene['id'] == 133:
        # Scene 133 should be screenplay page 133 (PDF 134-135)
        # Should start with "Stop it! Stop it!" and contain "Here's Johnny!"

        scene['startPage'] = 134
        scene['endPage'] = 135
        scene['screenplayPage'] = 133  # FIX: Should be 133, not 132!

        scene['plotSummary'] = {
            "brief": "\"HERE'S JOHNNY!\" - Jack's face appears through splintered door, Wendy slashes his hand with knife",
            "detailed": "Jack in b.g. swings axe at door, smashes away splintered wood. Wendy OFF: 'Stop it! Stop it!' INT. BEDROOM - M.S.: Jack swings axe at splintered door. Wendy OFF: 'Stop it!' Jack moves to gap in splintered door. WENDY SCREAMS OFF. INT. BATHROOM - M.C.S.: JACK'S FACE AT GAP IN SPLINTERED DOOR. 'Here's Johnny!' M.C.S.: Wendy holding knife SCREAMS. M.C.S.: Jack's smiling face at gap - he moves backwards and reaches hand through gap. M.C.S.: Jack's hand reaching through gap to key on inside of door. M.S.: WENDY STRIKES DOWN WITH KNIFE. M.C.S.: Jack's hand on key - WENDY'S KNIFE SLASHES ACROSS BACK OF HIS HAND and withdraws. Jack's hand moves to gap. JACK YELLS OFF. M.C.S.: Jack's face at gap, YELLING, looks down and turns away from door.",
            "subtext": "MOST ICONIC MOMENT IN FILM - Jack's grinning face through splintered door. Johnny Carson reference becomes ultimate horror image. Wendy finally fights back successfully."
        }

        print(f"✓ Fixed Scene 133: PDF 134-135, screenplay page 133 (removed overlap)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scenes 132-133 fixed - overlaps removed!")
