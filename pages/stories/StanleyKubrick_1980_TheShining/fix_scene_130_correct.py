#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 130 - it should have DIFFERENT content than Scene 131
for scene in scenes:
    if scene['id'] == 130:
        # Scene 130 is screenplay page 130, NOT 131
        # It should contain: Jack unlocking door, Wendy pushing Danny out, struggling to fit, Jack entering bedroom

        scene['plotSummary'] = {
            "brief": "Jack unlocks door; Wendy pushes Danny out window but cannot fit herself; Jack enters bedroom",
            "detailed": "Jack reaches through gap in splintered door panel, unlocks apartment door. INT. BATHROOM - Wendy lifts Danny to open window. EXT. HOTEL - Wendy pushes Danny out through window onto snow. He slides down, stands up, looks up at Wendy. Wendy struggles to get out of window - CANNOT FIT. Jack carrying axe moves up stairs from open front door. Wendy struggling, goes back into bathroom. Danny looking up at window. Jack walks across living room into bedroom carrying axe: 'Come out, come out, wherever you are!'",
            "subtext": "Danny successfully pushed to safety. Wendy trapped - window too small. Jack freed, hunting them with axe. Fairy tale hide-and-seek turned murderous."
        }

        scene['keyDialogue'] = [
            {
                "quote": "Come out, come out, wherever you are!",
                "speaker": "Jack",
                "significance": "ICONIC - Jack playfully calling as if playing hide-and-seek with child, but carrying axe to murder family",
                "context": "Jack walking into bedroom carrying axe, hunting for Wendy and Danny"
            }
        ]

        scene['characterDevelopment'] = {
            "Wendy": {
                "state": "Lifting Danny to window, pushing him out to safety, struggling to fit through window herself - TRAPPED, going back into bathroom",
                "arc": "Successfully saves Danny but cannot save herself - window too small for adult. Mother's sacrifice complete."
            },
            "Danny": {
                "state": "Pushed out window by Wendy, sliding down snow, standing up, looking up at trapped mother",
                "arc": "SAFE outside but watching helplessly as mother remains trapped inside with murderous father"
            },
            "Jack": {
                "state": "Unlocking door, carrying axe through apartment, walking into bedroom, playfully calling 'Come out, come out, wherever you are'",
                "arc": "FREED from pantry. Hunting family with axe. Playful hide-and-seek tone makes it more chilling."
            }
        }

        scene['thematicElements'] = [
            "Child's escape",
            "Mother trapped",
            "Window too small",
            "Hide-and-seek horror",
            "Domestic violence",
            "Hunter/prey"
        ]

        scene['supernaturalElements'] = []

        scene['significance'] = "CRITICAL ESCAPE SCENE - Jack unlocks apartment door. Wendy successfully pushes Danny out bathroom window onto snow. Danny slides down safely. Wendy struggles desperately to fit through window but CANNOT ESCAPE - window too small for adult. Goes back into bathroom. Danny outside looking up helplessly. Jack enters bedroom carrying axe, calling in playful hide-and-seek voice: 'Come out, come out, wherever you are!' - chilling contrast between playful tone and murderous intent. Danny saved, Wendy doomed."

        scene['foreshadowing'] = [131, 132, 133]
        scene['callbacks'] = [129]

        print(f"✓ Fixed Scene 130: 'Come out, come out, wherever you are' - NO OVERLAP with 131")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 130 corrected - overlap removed!")
