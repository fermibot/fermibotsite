#!/usr/bin/env python3
import json

# Read the main JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

# Update page ranges based on PAGE BREAK verification
# Scene 111: Airport & Durkin's Garage - screenplay page 101 (PDF 102)
for scene in data:
    if scene['id'] == 111:
        scene['startPage'] = 102
        scene['endPage'] = 102
        scene['screenplayPage'] = 101
        # Update approximate time
        scene['time']['approximate'] = "Page 102"

    # Scene 112: Durkin's Garage Interior - screenplay pages 102-105 (PDF 103-106)
    elif scene['id'] == 112:
        scene['startPage'] = 103
        scene['endPage'] = 106
        scene['screenplayPage'] = 102
        scene['time']['approximate'] = "Page 103-106"
        # Add physical action descriptions mentioned in expansion notes
        additional_actions = [
            "Durkin enters stamping snow off his feet",
            "Durkin moves behind counter",
            "Durkin checks watch - shows time pressure"
        ]
        if 'physicalActions' not in scene:
            scene['physicalActions'] = additional_actions

    # Scene 113: Road/Halloran's car - screenplay pages 105-106 (PDF 106-107)
    elif scene['id'] == 113:
        scene['startPage'] = 106
        scene['endPage'] = 107
        scene['screenplayPage'] = 105
        scene['time']['approximate'] = "Page 106-107"

    # Scene 114: Jack's Apartment - screenplay pages 106-107 (PDF 107-108)
    elif scene['id'] == 114:
        scene['startPage'] = 107
        scene['endPage'] = 108
        scene['screenplayPage'] = 106
        scene['time']['approximate'] = "Page 107-108"

    # Scene 115: Hotel Lounge - screenplay page 107 (PDF 108)
    elif scene['id'] == 115:
        scene['startPage'] = 108
        scene['endPage'] = 108
        scene['screenplayPage'] = 107
        scene['time']['approximate'] = "Page 108"

    # Scene 116: Hotel Lounge - screenplay pages 107-108 (PDF 108-109)
    elif scene['id'] == 116:
        scene['startPage'] = 108
        scene['endPage'] = 109
        scene['screenplayPage'] = 107
        scene['time']['approximate'] = "Page 108-109"

    # Scene 117: Hotel Lounge - screenplay page 108 (PDF 109)
    elif scene['id'] == 117:
        scene['startPage'] = 109
        scene['endPage'] = 109
        scene['screenplayPage'] = 108
        scene['time']['approximate'] = "Page 109"

    # Scene 118: Hotel Lounge - screenplay pages 108-110 (PDF 109-111)
    elif scene['id'] == 118:
        scene['startPage'] = 109
        scene['endPage'] = 111
        scene['screenplayPage'] = 108
        scene['time']['approximate'] = "Page 109-111"

    # Scene 119: Hotel Lounge/Apartment/Lobby - screenplay pages 110-111 (PDF 111-112)
    elif scene['id'] == 119:
        scene['startPage'] = 111
        scene['endPage'] = 112
        scene['screenplayPage'] = 110
        scene['time']['approximate'] = "Page 111-112"
        # Verify nervous laugh action is already present in keyDialogue
        # (It's already there in the JSON as "WENDY holding bat gives nervous laugh")

    # Scene 120: Hotel Lounge & Stairs - screenplay pages 111-117 (PDF 112-118)
    elif scene['id'] == 120:
        scene['startPage'] = 112
        scene['endPage'] = 118
        scene['screenplayPage'] = 111
        scene['time']['approximate'] = "Page 112-118"

        # Expand Scene 120 with full dialogue exchange
        # The plotSummary detailed section needs to note this is a 6-page confrontation
        scene['plotSummary']['detailed'] = ("Hotel lounge and stairs. EXTENSIVE 6-PAGE CONFRONTATION spanning screenplay pages 111-117. "
            "Jack interrogates Wendy about Danny. Wendy tentatively suggests Danny should see a doctor. Jack mocks her: 'You think maybe he should be taken to a doctor? When do you think maybe he should be taken to a doctor?' "
            "Jack asks 'And are you concerned about me?' then launches into responsibilities rant about his contract with hotel, moral principles, employers' trust. "
            "Wendy backs to stairs. Jack follows, asking about his future. Wendy retreats up stairs swinging bat: 'Stay away from me!' Jack: 'Why?' Wendy: 'I just want to go back to my room.' "
            "Jack: 'You've had your whole fucking life to think things over - what's good a few minutes more going to do you now?' "
            "Wendy: 'Don't hurt me!' Jack reaches toward her: 'Darling, light of my life, I'm not going to hurt you. You didn't let me finish my sentence. I said I'm not going to hurt you... I'm just going to bash your brains in! I'm going to bash them right the fuck in.' "
            "Extended back-and-forth as they ascend stairs - Jack repeatedly demanding 'Give me the bat,' Wendy repeatedly crying 'Stay away from me!' Multiple camera angles tracking their movement. "
            "Jack reaches up. Wendy hits his hand with bat - he yells 'Goddamn!' Wendy then hits his head. Jack falls backwards down stairs, somersaulting to half landing where he lands facedown. "
            "Wendy at top of stairs: 'Oh...oh!' - shocked at what she's done.")

        # Add the complete dialogue breakdown to keyDialogue
        # Keep existing iconic quotes but add more context
        scene['keyDialogue'] = [
            {
                "quote": "I don't know.",
                "speaker": "Wendy (OFF)",
                "significance": "Wendy unable to answer Jack's threatening question about Danny",
                "context": "Jack moving forward, camera tracking back"
            },
            {
                "quote": "I don't think that's true. I think you have some very definite ideas about what should be done with Danny... and I'd like to know what they are.",
                "speaker": "Jack",
                "significance": "Interrogating, demanding Wendy reveal plan for Danny",
                "context": "Moving forward"
            },
            {
                "quote": "Well I... I think maybe he should be taken to a doctor.",
                "speaker": "Wendy",
                "significance": "Tentative, hesitant answer - fear evident in her hesitation",
                "context": "Holding bat, moves back, weeping"
            },
            {
                "quote": "You think maybe he should be taken to a doctor? When do you think maybe he should be taken to a doctor?",
                "speaker": "Jack",
                "significance": "Mocking repetition of Wendy's words, interrogating tone",
                "context": "Looking at Wendy, moving forward"
            },
            {
                "quote": "As soon as possible?",
                "speaker": "Wendy",
                "significance": "Questioning tone shows uncertainty and fear",
                "context": "Holding bat"
            },
            {
                "quote": "As soon as possible.",
                "speaker": "Jack",
                "significance": "Repeating her words mockingly",
                "context": "Moving forward"
            },
            {
                "quote": "You believe his health might be at stake? And you are concerned about him?",
                "speaker": "Jack",
                "significance": "Building interrogation, setting up to turn question on himself",
                "context": "Moving forward, camera tracks back"
            },
            {
                "quote": "And are you concerned about me?",
                "speaker": "Jack",
                "significance": "CRITICAL - Turning focus to himself, victimizing himself despite being the threat",
                "context": "Points to himself as he moves forward"
            },
            {
                "quote": "Of course I am.",
                "speaker": "Wendy",
                "significance": "Trying to placate him",
                "context": "Holding bat, moving backwards"
            },
            {
                "quote": "Have you ever thought about my responsibilities? Have you ever had a single moment's thought about my responsibilities to my employers?",
                "speaker": "Jack",
                "significance": "CRITICAL - Beginning responsibilities rant, prioritizing hotel over family",
                "context": "Moving forward, camera tracks back, points to himself and gestures"
            },
            {
                "quote": "Has it ever occurred to you that I have agreed to look after the Overlook Hotel until May the first? Does it matter to you at all that the owners have placed their complete confidence and trust in me, and that I have signed a letter of agreement, a contract, in which I have accepted that responsibility?",
                "speaker": "Jack",
                "significance": "CRITICAL - Full responsibilities rant, hotel contract paramount over family safety",
                "context": "Moving forward, camera tracks back"
            },
            {
                "quote": "Do you have the slightest idea what a moral and ethical principal is? Do you?",
                "speaker": "Jack (OFF)",
                "significance": "Attacking Wendy's morality while threatening her life - abuser's rhetoric",
                "context": "Wendy backing to foot of stairs"
            },
            {
                "quote": "Has it ever occurred to you what would happen to my future, if I were to fail to live up to my responsibilities? Has it ever occurred to you? Has it?",
                "speaker": "Jack",
                "significance": "Self-centered focus on his 'future' while threatening family",
                "context": "Moving forward after Wendy onto stairs"
            },
            {
                "quote": "Stay away from me!",
                "speaker": "Wendy",
                "significance": "REPEATED THROUGHOUT SCENE - Defensive plea while backing up stairs, said approximately 15 times",
                "context": "Swinging bat, backing up stairs"
            },
            {
                "quote": "I just want to go back to my room.",
                "speaker": "Wendy",
                "significance": "Trying to defuse, seeking escape",
                "context": "Backing up stairs"
            },
            {
                "quote": "Well... I'm very confused, and I just need a chance to think things over.",
                "speaker": "Wendy",
                "significance": "Requesting time, trying to de-escalate",
                "context": "Sobbing, backing up stairs"
            },
            {
                "quote": "You've had your whole fucking life to think things over - what's good a few minutes more going to do you now?",
                "speaker": "Jack",
                "significance": "CRITICAL - Dismissing her request, escalating aggression with profanity",
                "context": "High angle, moving up stairs after her"
            },
            {
                "quote": "Don't hurt me! Don't hurt me!",
                "speaker": "Wendy",
                "significance": "Direct plea for safety",
                "context": "Jack reaches up to her"
            },
            {
                "quote": "I'm not going to hurt you.",
                "speaker": "Jack",
                "significance": "False reassurance repeated multiple times before and after threat",
                "context": "Reaching toward her"
            },
            {
                "quote": "Darling, light of my life, I'm not going to hurt you. You didn't let me finish my sentence. I said 'I'm not going to hurt you... I'm just going to bash your brains in!' I'm going to bash them right the fuck in.",
                "speaker": "Jack",
                "significance": "ICONIC LINE - Murder threat delivered with false endearments, complete psychotic break, mixing loving terms with explicit violence",
                "context": "On stairs, camera tracking back, Jack laughing"
            },
            {
                "quote": "Stop swinging the bat.",
                "speaker": "Jack",
                "significance": "Command to stop defending herself",
                "context": "Following up stairs"
            },
            {
                "quote": "Give me the bat.",
                "speaker": "Jack",
                "significance": "REPEATED THROUGHOUT - Demanding bat to disarm her, said approximately 10 times",
                "context": "Approaching, reaching toward her"
            },
            {
                "quote": "Goddamn!",
                "speaker": "Jack",
                "significance": "Pain and shock when Wendy hits his hand with bat",
                "context": "After first bat strike to hand, grabs wrist"
            },
            {
                "quote": "Oh...oh!",
                "speaker": "Wendy",
                "significance": "Shock and horror at knocking Jack unconscious down stairs - not triumph, but shock",
                "context": "Standing at top of stairs, Jack lying facedown on half landing below"
            }
        ]

        # Update significance to reflect the full 6-page confrontation
        scene['significance'] = ("ICONIC 6-PAGE CONFRONTATION (screenplay pages 111-117) - Extended staircase chase representing climax of Jack's psychotic transformation. "
            "Jack's 'responsibilities' rant prioritizing hotel contract over family safety shows abuser's rhetoric. "
            "Escalates to open murder threat: 'Darling, light of my life... I'm just going to bash your brains in!' - false sweetness with murderous intent reveals complete psychosis. "
            "Wendy defending with bat while retreating up stairs represents victim fighting back. Classic predator/prey dynamic with shifting camera angles. "
            "Repeated exchanges - 'Give me the bat' (Jack ~10 times) / 'Stay away from me' (Wendy ~15 times) - create rhythm of pursuit and defense throughout 6 pages. "
            "Culminates in Wendy's defensive strikes: first to Jack's hand, then to his head, causing him to somersault down stairs. "
            "Wendy's 'Oh...oh!' shows shock at her own violence, not celebration - this is survival, not vengeance. "
            "One of cinema's most famous confrontation scenes, demonstrating Kubrick's mastery of sustained tension.")

# Write updated JSON back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✓ Updated scenes 111-120")
print("  - Scene 111: Pages 102-102")
print("  - Scene 112: Pages 103-106 (added physical actions)")
print("  - Scene 113: Pages 106-107")
print("  - Scene 114: Pages 107-108")
print("  - Scene 115: Pages 108-108")
print("  - Scene 116: Pages 108-109")
print("  - Scene 117: Pages 109-109")
print("  - Scene 118: Pages 109-111")
print("  - Scene 119: Pages 111-112")
print("  - Scene 120: Pages 112-118 (MAJOR EXPANSION - full 6-page dialogue)")
