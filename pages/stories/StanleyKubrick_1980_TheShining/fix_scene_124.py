#!/usr/bin/env python3
import json

# Read the JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

# Find and update Scene 124
for scene in scenes:
    if scene['id'] == 124:
        # Correct the location
        scene['location'] = {
            "primary": "HOTEL - FOOD STORE ROOM & HALLORAN'S SNOWCAT",
            "description": "Interior - Food store room with Jack locked in, intercut with Halloran driving snowcat through night storm on snow-covered roads"
        }

        # Correct the key dialogue - should be Grady dialogue, not Durkin!
        scene['keyDialogue'] = [
            {
                "quote": "It's Grady, Mr. Torrance. Delbert Grady.",
                "speaker": "Grady (OFF)",
                "significance": "CRITICAL - The ghost butler reveals himself, come to judge Jack's failure",
                "context": "Grady knocking on locked pantry door where Jack is imprisoned"
            },
            {
                "quote": "Mr. Torrance, I see you can hardly have taken care of the business we discussed.",
                "speaker": "Grady (OFF)",
                "significance": "Grady criticizes Jack for failing to kill his family as promised",
                "context": "Through locked door, judging Jack's imprisonment"
            },
            {
                "quote": "No need to rub it in, Mr. Grady. I'll deal with that situation as soon as I get out of here.",
                "speaker": "Jack",
                "significance": "Jack defensive, still committed to murder despite being locked up",
                "context": "Jack responding through door"
            },
            {
                "quote": "Will you indeed, Mr. Torrance. I wonder. I have my doubts.",
                "speaker": "Grady (OFF)",
                "significance": "Grady doubting Jack's commitment, applying psychological pressure",
                "context": "Questioning Jack's resolve"
            },
            {
                "quote": "I and others have come to believe... that your heart is not in this, that you haven't the belly for it.",
                "speaker": "Grady (OFF)",
                "significance": "ICONIC LINE - Hotel's judgment: Jack lacks commitment to violence, questioning his worth",
                "context": "Hotel's verdict delivered through Grady"
            },
            {
                "quote": "Just give me one more chance to prove it, Mr. Grady. That's all I ask.",
                "speaker": "Jack",
                "significance": "Jack begging for redemption from evil forces - desperate to prove murderous commitment",
                "context": "Jack pleading with supernatural judgment"
            },
            {
                "quote": "Your wife appears to be stronger than we imagined, Mr. Torrance. Somewhat more resourceful, she seems to have got the better of you.",
                "speaker": "Grady (OFF)",
                "significance": "Grady mocking Jack - emasculating him, Wendy defeated him",
                "context": "Psychological manipulation, attacking Jack's pride"
            },
            {
                "quote": "For the moment, Mr. Grady. Only for the moment.",
                "speaker": "Jack",
                "significance": "Jack's pride wounded, swearing revenge against Wendy",
                "context": "Defensive response to Grady's mockery"
            },
            {
                "quote": "I fear that you will have to deal with this matter in the harshest possible way, Mr. Torrance. I fear that is the only thing to do.",
                "speaker": "Grady (OFF)",
                "significance": "CRITICAL - Explicit order to murder wife and child in 'harshest possible way'",
                "context": "Hotel demanding brutal family murder as price of liberation"
            },
            {
                "quote": "There's nothing I look forward to with the greater pleasure, Mr. Grady.",
                "speaker": "Jack",
                "significance": "CHILLING - Jack pledging to murder his family with pleasure, fully possessed by evil",
                "context": "Jack's promise of brutal violence"
            },
            {
                "quote": "You give your word on that do you, Mr. Torrance?",
                "speaker": "Grady (OFF)",
                "significance": "Grady demanding binding oath of murder",
                "context": "Sealing the pact"
            },
            {
                "quote": "I give you my word.",
                "speaker": "Jack",
                "significance": "Jack's solemn vow to brutally murder Wendy and Danny - deal with devil complete",
                "context": "Jack nodding head, giving word. Followed by SOUND OF BOLT BEING DRAWN"
            }
        ]

        # Correct character development
        scene['characterDevelopment'] = {
            "Jack": {
                "state": "Locked in pantry, desperate, making pact with supernatural forces to escape and murder family",
                "arc": "CRITICAL TURNING POINT - Judged and found wanting by hotel, must prove commitment by promising brutal murder. Gives his word to kill Wendy and Danny. Door unlocked by Grady as reward."
            },
            "Grady": {
                "state": "Ghost speaking through door, judging Jack's failure, demanding murder oath",
                "arc": "Hotel's spokesman delivering judgment and terms: brutal family murder required for liberation"
            },
            "Halloran": {
                "state": "Intercut scenes - driving snowcat through night storm toward hotel",
                "arc": "Rescue mission progressing through treacherous conditions while Jack makes murder pact"
            }
        }

        # Add thematic elements
        scene['thematicElements'] = [
            "Judgment from evil",
            "Pact with devil",
            "Emasculation",
            "Murder oath",
            "Supernatural liberation",
            "Family annihilation pledged"
        ]

        # Add supernatural elements
        scene['supernaturalElements'] = [
            "Grady's ghost appearing to locked-in Jack",
            "Hotel speaking through Grady - collective evil ('I and others')",
            "Door supernaturally unlocked by ghost - bolt drawn without physical presence"
        ]

        scene['significance'] = "PIVOTAL SUPERNATURAL SCENE - Jack makes explicit pact with hotel's evil forces. Grady (speaking for 'I and others') judges Jack's failure, questions his commitment, demands proof. Jack vows to murder Wendy and Danny 'in the harshest possible way' with 'greater pleasure.' Upon giving his word, door supernaturally unlocks. Devil's bargain complete. Intercut with Halloran's rescue attempt creates dramatic irony."

        print(f"✓ Fixed Scene 124: Grady conversation and murder pact")

# Write back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("\n✅ Scene 124 fixed!")
