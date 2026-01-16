#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

for scene in scenes:
    if scene['id'] == 136:
        # Scene 136 should be PDF 137 only, not extend to 138
        scene['startPage'] = 137
        scene['endPage'] = 137  # NOT 138!
        scene['screenplayPage'] = 136

        # Remove content from screenplay page 137 - Scene 136 should end with first intercutting sequence
        scene['plotSummary'] = {
            "brief": "Jack ambushes and kills Halloran with axe in hotel lobby; Danny psychically witnesses the murder",
            "detailed": "M.L.S.: Halloran moves forward along corridor. CAMERA TRACKS FORWARD. HALLORAN: 'Hallo!' Halloran moves R-L to entrance to lobby. 'Anybody here?' Halloran moves away into lobby. CAMERA TRACKS FORWARD after him. 'Hallo! Hallo! Anybody here?' JACK, HOLDING AXE, YELLS AS HE STEPS FROM BEHIND PILLAR CAM.R AND MOVES TOWARDS HALLORAN. M.S.: JACK YELLING AS HE SWINGS AXE AT HALLORAN. M.C.S.: HALLORAN'S CHEST - AXE PIERCES RAINCOAT AND BLOOD OOZES OUT. M.C.S.: DANNY, WITH HIS MOUTH WIDE OPEN. M.S.: Jack over Halloran. Jack holding onto shaft of axe. M.C.S.: Halloran, with his mouth wide open. M.C.S.: DANNY, with his mouth wide open.",
            "subtext": "Halloran's heroic rescue ends in brutal murder. Danny psychically connected - experiences Halloran's death through intercutting. Hope extinguished. Jack eliminates outside help."
        }

        # Scene ends with the first round of intercutting on page 136, before page break
        print(f"✓ Fixed Scene 136: PDF 137 only (removed overlap with 137)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 136 overlap removed!")
