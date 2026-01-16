#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

for scene in scenes:
    if scene['id'] == 137:
        # Scene 137 should be PDF 138 only, not extend to 139
        scene['startPage'] = 138
        scene['endPage'] = 138  # NOT 139!
        scene['screenplayPage'] = 137

        # Add the missing intercutting continuation from beginning of page 137
        scene['plotSummary'] = {
            "brief": "Intercutting continues: Halloran dying, Jack rising; Jack calls for Danny; Danny escapes from oven; Wendy runs up stairs",
            "detailed": "M.S.: Jack over Halloran, holding onto shaft of axe. M.C.S.: Halloran, with his mouth wide open, sinks down out of shot. M.C.S.: DANNY, with his mouth wide open. M.C.S.: JACK RISES UP INTO SHOT. M.L.S.: Jack holding axe standing beside body of Halloran on floor. Jack limps forward. CAMERA TRACKS BACK before him. JACK: 'Danny! Danny boy!' He stops at corridor to kitchen. 'Danny!' M.L.S.: Jack back to camera in R.f.g. DANNY CLIMBS OUT OF OVEN IN B.G. Jack moves forward. DANNY EXITS CAM.R.F.G. Jack limps away. CAMERA TRACKS IN after him. 'Danny! Danny!' INT. HOTEL - STAIRS - M.S.: High Angle WENDY runs up stairs L-R. She pauses on landing. WENDY: 'Danny!' CAMERA TRACKS BACK before Wendy as she goes up next flight of stairs. She stops at top of stairs and looks along landing. M.L.S.: WENDY'S P.O.V. Shooting along landing into open doorway of bedroom.",
            "subtext": "Intercutting completes Halloran's death sequence. Danny narrowly escapes - climbs out of oven just as Jack enters kitchen. Three family members separated, searching. Danny fleeing, Wendy searching, Jack hunting."
        }

        print(f"✓ Fixed Scene 137: PDF 138 only, added missing intercutting (removed overlap with 138)")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 137 fixed!")
