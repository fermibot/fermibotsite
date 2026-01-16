#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

for scene in scenes:
    if scene['id'] == 141:
        # Scene 141 should be PDF 144-147 (screenplay pages 143-146)
        # This is the footprint trick payoff and Danny/Wendy escape
        scene['title'] = "EXT. MAZE / EXT. HOTEL - M.S. / M.L.S. / M.C.S."
        scene['startPage'] = 144
        scene['endPage'] = 147
        scene['screenplayPage'] = 143

        scene['plotSummary'] = {
            "brief": "Footprint trick revealed: Jack finds trail ends, Danny escapes; Danny and Wendy reunite and escape in Snowcat; Jack lost, groaning, collapses in maze",
            "detailed": "EXT. MAZE - M.S.: DANNY'S FOOTPRINTS IN THE SNOW - CAMERA TRACKS FORWARD and stops when footprints end. CAMERA TILTS UP to snow without footprints. M.C.S.: JACK - he looks about then back and forwards - and finally cam.R. JACK: 'Danny!' He looks cam.L. M.C.S.: DANNY crouched against side of Maze. JACK (OFF): 'Danny!' M.S.: Jack - he looks about then cam.L. 'Danny!' M.L.S.: Jack limps L-R and exits cam.R. M.S.: DANNY APPEARS FROM BEHIND MOUND OF SNOW and moves forward R-L. M.L.S.: DANNY'S P.O.V. Empty Maze. M.S.: Danny moves away R-L from mound of snow. CAMERA PANS with him. He runs away along Maze. M.S.: Footprints in snow in Maze. CAMERA TRACKS FORWARD along footprints. M.L.S.: Jack, back to camera, limping away along Maze. CAMERA TRACKS after him. M.S.: Jack limps forward along Maze. CAMERA TRACKS BACK. M.S.: CAMERA TRACKS FORWARD along Maze. M.S.: DANNY runs forward along Maze. CAMERA TRACKS BACK. M.L.S.: Jack moves to opening cam.R. CAMERA TRACKS FORWARD - he turns and moves R-L to opening cam.L. CAMERA PANS with him. He stops and turns - then moves L-R. CAMERA PANS with him and TRACKS after him as he limps along MAZE. EXT. HOTEL - M.L.S.: WENDY sobbing and holding knife runs away to HALLORAN's Snowcat in b.g. CAMERA TRACKS FORWARD after her. She stops by Snowcat and looks about. EXT. MAZE - M.S.: DANNY runs forward in Maze. CAMERA TRACKS BACK. DANNY looks over his shoulder and falls down in snow at entrance. EXT. HOTEL - M.S.: WENDY standing by HALLORAN's Snowcat. She throws down knife. WENDY: 'Danny! Danny!' She runs forward and out cam.R.f.g. M.L.S.: DANNY lying on snow at entrance to Maze. He gets up and runs R-L. CAMERA PANS with him. DANNY: 'Mommy...' WENDY (OFF): 'Danny, come here!' DANNY: 'Mommy... Mommy...!' WENDY (OFF): 'Danny!' DANNY RUNS R-L INTO WENDY'S ARMS AS SHE KNEELS ON SNOW. 'Mommy!' WENDY: 'Oh!' WENDY HUGS AND KISSES DANNY. 'Oh Danny!' EXT. MAZE - M.S.: JACK holding axe limps forward - CAMERA TRACKS BACK. JACK: 'Danny! Where...' JACK GROANS. EXT. HOTEL - M.L.S.: Wendy holding Danny moves R-L to Snowcat. CAMERA PANS with them. Wendy opens door of Snowcat and lifts Danny up to cab. EXT. MAZE - M.L.S.: JACK GROANING staggers away along Maze - CAMERA TRACKS after him. 'Danny!' He stumbles and lies in snow. He struggles up to his feet. EXT. HOTEL - L.S.: Snowcat with lights on moves R-L in front of Hotel, then turns to cam.R. JACK SHOUTS INAUDIBLE OFF. EXT. MAZE - M.S.: JACK staggers forward. CAMERA TRACKS BACK - INDISTINCT SHOUTS. He GROANS as he moves forward R-L. EXT. HOTEL - L.S.: Snowcat drives away down road. JACK INAUDIBLE SHOUTS OFF. EXT. MAZE - M.S.: JACK staggers forward along Maze. CAMERA TRACKS BACK - INDISTINCT MOANS & GROANS. M.L.S.: JACK STAGGERS AWAY ALONG MAZE. CAMERA TRACKS after him. INDISTINCT MOANS. HE SLUMPS DOWN CAM.L AGAINST SIDE OF MAZE.",
            "subtext": "FOOTPRINT TRICK PAYOFF - Jack finds trail ends, utterly confused (child outsmarts father). Danny's intelligence defeats Jack's brute force. Mother-son REUNION - emotional release after nightmare separation. They escape together in Halloran's Snowcat (his sacrifice enables their survival). Jack lost in maze he knows by heart - poetic justice, trapped by own arrogance. Intercutting escape with Jack's deterioration: they drive away to safety while Jack groans, staggers, collapses. Hunter becomes victim of the maze."
        }

        scene['tags'] = [
            "footprint-trick-payoff",
            "danny-wendy-reunion",
            "snowcat-escape",
            "jack-lost-maze",
            "jack-collapses"
        ]

        scene['location'] = {
            "primary": "HEDGE MAZE & HOTEL EXTERIOR",
            "description": "Intercutting: Maze with Jack discovering footprints end and becoming lost; Hotel exterior with Danny and Wendy reuniting and escaping in Snowcat"
        }

        scene['keyDialogue'] = [
            {
                "quote": "Danny!",
                "speaker": "Jack",
                "significance": "Jack repeatedly calling for Danny, increasingly desperate as he realizes footprints end - the hunter has lost his prey",
                "context": "Jack finding footprints end, looking around confused in maze"
            },
            {
                "quote": "Danny! Danny!",
                "speaker": "Wendy",
                "significance": "Wendy calling for Danny as she waits by Snowcat - parallel to Jack but with hope instead of menace",
                "context": "Wendy throws down knife, desperately calling for her son"
            },
            {
                "quote": "Mommy... Mommy...!",
                "speaker": "Danny",
                "significance": "Danny's relief - calling for mother after escaping father. 'Mommy' instead of formal 'Mother'",
                "context": "Danny running from maze entrance into Wendy's arms"
            },
            {
                "quote": "Danny, come here!",
                "speaker": "Wendy",
                "significance": "Wendy's urgency - directing Danny to safety",
                "context": "Wendy seeing Danny emerge from maze, kneeling with arms open"
            },
            {
                "quote": "Oh Danny!",
                "speaker": "Wendy",
                "significance": "Mother's relief as she hugs and kisses son - family bond survives",
                "context": "Wendy embracing Danny, reunited after nightmare"
            },
            {
                "quote": "Danny! Where...",
                "speaker": "Jack",
                "significance": "FINAL COHERENT WORDS - Jack's confusion as he realizes Danny escaped. Trails off into groans.",
                "context": "Jack still lost in maze, holding axe, deteriorating"
            }
        ]

        scene['characterDevelopment'] = {
            "Jack": {
                "state": "Lost in maze, groaning, staggering, finally collapses against maze wall",
                "arc": "COMPLETE DEFEAT - footprint trick reveals Danny's superior intelligence. Jack becomes disoriented, calling for Danny desperately. Physical deterioration accelerates: groaning, falling, struggling up, staggering with indistinct moans, finally slumping down. The hunter is trapped and dying in his own maze."
            },
            "Danny": {
                "state": "Escapes maze successfully, reunites with mother, escapes in Snowcat",
                "arc": "TRIUMPH - footprint trick works perfectly. Danny emerges from hiding, runs through maze, falls at entrance but gets up and runs into mother's arms. Intelligence and bravery save him and Wendy."
            },
            "Wendy": {
                "state": "Runs to Snowcat, calls for Danny, reunites with him, drives them to safety",
                "arc": "MATERNAL RESCUE - despite trauma (Halloran's body, ghosts), focuses on saving Danny. Throws down knife (weapon no longer needed), opens arms for son, lifts him into Snowcat, drives them away to safety. Mother's love conquers all."
            }
        }

        scene['thematicElements'] = [
            "Intelligence defeats brute force",
            "Child outsmarts parent",
            "Mother-son bond survives horror",
            "Maze traps its creator",
            "Escape and reunion",
            "Predator becomes prey"
        ]

        scene['tensionLevel'] = 9

        scene['significance'] = "CLIMACTIC ESCAPE SEQUENCE - Three major payoffs: (1) FOOTPRINT TRICK WORKS - Jack finds trail ends, completely confused. Child's intelligence defeats father's hunting skills. (2) DANNY-WENDY REUNION - emotional high point after nightmare separation. 'Mommy... Mommy...!' - family bond survives. (3) ESCAPE IN SNOWCAT - Halloran's sacrifice enables survival. They drive away while Jack is lost, groaning, collapsing. Intercutting creates dramatic irony: escape vs. entrapment, reunion vs. isolation, survival vs. death. Jack trapped in maze he knows by heart - poetic justice. Final dialogue 'Danny! Where...' trails into groans - Jack's coherence gone."

        print(f"✓ Fixed Scene 141: PDF 144-147 (screenplay 143-146)")
        print(f"  - Changed from wrong 'Jack's apartment' to correct maze escape")
        print(f"  - Added footprint trick payoff, Danny-Wendy reunion, Snowcat escape")
        print(f"  - Added dialogue: 'Mommy... Mommy...!', 'Oh Danny!', 'Danny! Where...'")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 141 fixed - completely wrong scene replaced!")
