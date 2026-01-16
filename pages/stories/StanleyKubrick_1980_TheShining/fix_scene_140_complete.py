#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

for scene in scenes:
    if scene['id'] == 140:
        # Scene 140 should extend to PDF 143 (screenplay page 142)
        # The current plotSummary is incomplete - missing pages 141-142 content
        scene['startPage'] = 140
        scene['endPage'] = 143
        scene['screenplayPage'] = 139

        # Complete plot summary including ALL intercutting from pages 139-142
        scene['plotSummary'] = {
            "brief": "Jack follows Danny's footprints through maze; Wendy finds Halloran's body, encounters ghosts; Danny's footprint trick; blood elevator returns",
            "detailed": "EXT. MAZE - M.S.: Jack in the maze. He limps forward. CAMERA TRACKS BACK before him. JACK: 'Danny! I'm coming. I'm coming Dan!' He looks down. M.C.S.: DANNY'S FOOTPRINTS IN SNOW. CAMERA TILTS UP & TRACKS FORWARD along Danny's footprints. M.C.S.: Danny's feet and legs running away through maze. CAMERA TRACKS FORWARD. INT. HOTEL - M.L.S.: Wendy, carrying knife, runs forward into kitchen. She looks towards stairs in b.g. WENDY: 'Danny!' Wendy stumbles forward through coffee pots and rings on floor. CAMERA TRACKS BACK before her. 'Oh!' Wendy turns R-L. CAMERA TRACKS with her. She moves away along corridor. CAMERA TRACKS after her. She stops at corner. CAMERA CONTINUES PAST HER REVEALING HALLORAN LYING DEAD ON FLOOR OF LOBBY. M.C.S.: WENDY REACTS. M.L.S.: Halloran's body lying on floor. CAMERA ZOOMS IN on it. M.C.S.: Wendy looks about. She moves away R-L. CAMERA PANS with her. SHE SCREAMS AND TURNS TO CAM.R. CAMERA WHIP PANS L-R ONTO M.L.S. INJURED GUEST. M.S.: Wendy reacting - knife trembles in her hand. M.C.S.: INJURED GUEST, WITH SCAR RUNNING DOWN HIS HEAD AND FACE. He raises glass he is holding. 'Great party, isn't it?' M.S. WENDY SCREAMING turns and runs away. EXT. MAZE - M.L.S.: Danny running away through Maze. JACK (OFF): 'Danny! Danny! I'm coming!' M.S.: Jack limps forward in Maze. JACK: 'You can't get away. I'm right behind you.' INT. HOTEL - M.L.S.: Wendy runs forward. WENDY: 'Danny!' Wendy runs forward and then moves R-L. CAMERA PANS with her - she stops cam.R.f.g. and SCREAMS. M.C.S.: Wendy looking about. M.L.S.: SKELETONS sitting in chairs. Bottle of champagne on table in f.g. M.S.: SKELETONS sitting at table with bottle and glasses on it. M.L.S.: SKELETONS sitting in chairs round tables with bottles on them. EXT. MAZE - M.L.S.: Jack limps away through Maze. M.S.: DANNY STEPS BACKWARDS IN HIS FOOTPRINTS IN SNOW. M.S.: Jack limps forward laughing. JACK: 'Danny!' M.L.S.: DANNY STEPPING BACKWARDS IN HIS FOOTPRINTS. He jumps L-R landing in snow, and crawls L-R - brushing his traces in the snow out with his hands. INT. HOTEL - M.L.S.: Wendy holding knife runs forward. She moves R-L. CAMERA PANS with her to open door. She stops by doorway and looks along corridor towards lift doors in b.g. M.S.: LIFT DOORS. BLOOD GUSHES IN CAM.L AND SURGES FORWARD ALONG FLOOR. M.C.S.: Wendy reacts. M.S.: Lift doors. BLOOD GUSHES IN CAM.L AND CAM.R - SURGING FORWARD IN WAVE TOWARDS CAMERA. EXT. MAZE - M.S.: DANNY sitting leaning against side of Maze. CAMERA TRACKS R-L revealing JACK, holding axe, cam.R.b.g. He limps R-L and moves away along Maze.",
            "subtext": "CRITICAL TURNING POINT - Jack tracking Danny by footprints but Danny outsmarts him with backwards-stepping trick (child's intelligence defeats father's brute force). Wendy's trauma multiplied: Halloran dead (hope destroyed), injured guest ghost (hotel's violence revealed), skeletons (July 4th ball guests decayed), blood elevator returns (hotel's evil unleashed). Intercutting creates simultaneous horror: Danny outsmarting Jack, Wendy bombarded by supernatural manifestations, all family members in separate nightmares."
        }

        # Update key dialogue to include all dialogue from pages 139-142
        scene['keyDialogue'] = [
            {
                "quote": "Danny! I'm coming. I'm coming Dan!",
                "speaker": "Jack",
                "significance": "Jack's threat disguised as reassurance - 'I'm coming' sounds protective but means murder",
                "context": "Jack following Danny's footprints through maze"
            },
            {
                "quote": "Danny!",
                "speaker": "Wendy",
                "significance": "Wendy desperately searching for Danny, unaware he's in maze being hunted by Jack",
                "context": "Wendy running through kitchen calling for Danny"
            },
            {
                "quote": "Great party, isn't it?",
                "speaker": "Injured Guest",
                "significance": "CHILLING LINE - Ghost from 1920s party casually raising glass with grotesque injury, hotel's eternal celebration continues despite violence",
                "context": "Injured guest ghost appearing to horrified Wendy in lobby"
            },
            {
                "quote": "Danny! Danny! I'm coming!",
                "speaker": "Jack (OFF)",
                "significance": "Jack's relentless pursuit - calling from off-screen as Danny flees through maze",
                "context": "Danny running through maze, Jack pursuing off-screen"
            },
            {
                "quote": "You can't get away. I'm right behind you.",
                "speaker": "Jack",
                "significance": "MENACING THREAT - Jack confident he's closing in on Danny, unaware of footprint trick",
                "context": "Jack limping through maze following footprints"
            }
        ]

        # Update significance to reflect all content
        scene['significance'] = "CRITICAL INTERCUTTING CLIMAX - Contains three major elements: (1) Danny's FOOTPRINT TRICK - child outsmarts father by stepping backwards then jumping sideways, erasing traces (intelligence defeats brute force); (2) Wendy's GHOST BOMBARDMENT - encounters injured guest 'Great party', skeletons from July 4th ball, BLOOD ELEVATOR RETURNS (all hotel's evil manifesting); (3) Jack passing Danny unknowingly - dramatic irony as Jack limps past Danny hiding against maze wall. Intercutting creates multi-layered suspense: maze chase, supernatural horrors, family separated in simultaneous nightmares. Sets up Danny's escape and Jack's confusion in next scene."

        print(f"✓ Fixed Scene 140: Complete content from PDF 140-143 (screenplay 139-142)")
        print(f"  - Added missing intercutting content from pages 141-142")
        print(f"  - Added dialogue: 'You can't get away. I'm right behind you'")
        print(f"  - Added skeletons, blood elevator, Danny's footprint trick")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 140 complete content added!")
