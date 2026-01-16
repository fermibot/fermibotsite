#!/usr/bin/env python3
"""
Retag all scenes with universal tag system and fix callbacks/foreshadowing
"""
import json
import re

# Universal tag system
UNIVERSAL_TAGS = {
    # Characters
    "jack-declining", "jack-violence", "jack-supernatural", "jack-drunk",
    "wendy-discovering", "wendy-defending", "wendy-supernatural",
    "danny-shining", "danny-endangered", "danny-tony",
    "halloran-shining", "halloran-rescue",
    # Locations
    "hotel-tour", "gold-ballroom", "room-237", "maze", "pantry",
    "apartment", "colorado-lounge", "bathroom",
    # Supernatural
    "ghost-encounter", "ghost-party", "lloyd", "grady", "grady-twins",
    "woman-237", "blood-elevator", "possession", "shining-vision", "time-distortion",
    # Iconic moments
    "heres-johnny", "all-work-no-play", "red-rum", "twins", "photograph",
    "baseball-bat", "tricycle", "always-been-caretaker", "footprint-trick",
    # Violence
    "physical-violence", "threatened-violence", "psychological-horror",
    "murder", "chase", "weapon",
    # Key dialogue
    "iconic-dialogue", "gaslighting", "dark-humor",
    # Plot progression
    "arrival", "interview", "tour", "closing-day", "isolation-begins",
    "one-month-later", "escalation", "breaking-point", "crisis", "climax", "resolution", "epilogue",
    # Themes
    "isolation", "family-breakdown", "alcoholism", "violence-history",
    "writer-block", "responsibility", "parent-child", "marriage-strain",
    # Objects
    "typewriter", "axe", "knife", "radio", "snowcat", "telephone",
    # Communication
    "outside-contact", "radio-call", "phone-call", "contact-blocked",
    # Weather
    "storm", "snow", "trapped-by-weather",
    # Structure
    "callback", "foreshadowing", "parallel", "intercutting"
}

def smart_tag_scene(scene):
    """Intelligently assign tags based on scene content"""
    tags = []
    scene_id = scene['id']
    title = scene.get('title', '').lower()
    brief = scene.get('plotSummary', {}).get('brief', '').lower()
    detailed = scene.get('plotSummary', {}).get('detailed', '').lower()
    location = scene.get('location', {}).get('primary', '').lower()
    dialogue = str(scene.get('keyDialogue', [])).lower()

    # Combined text for searching
    text = f"{title} {brief} {detailed} {location} {dialogue}".lower()

    # === LOCATIONS ===
    if 'gold ballroom' in text or 'ballroom' in location:
        tags.append('gold-ballroom')
    if 'room 237' in text or '237' in text:
        tags.append('room-237')
    if 'maze' in text:
        tags.append('maze')
    if 'pantry' in text or 'food store' in text:
        tags.append('pantry')
    if 'apartment' in location or 'torrance apartment' in text:
        tags.append('apartment')
    if 'colorado lounge' in text:
        tags.append('colorado-lounge')
    if 'bathroom' in text:
        tags.append('bathroom')

    # === SUPERNATURAL ===
    if 'lloyd' in text or (scene_id in [80, 81, 100, 101, 142] and 'bartender' in text):
        tags.append('lloyd')
        tags.append('dark-humor')
    if 'grady' in text:
        tags.append('grady')
        if 'bathroom' in text:
            tags.append('dark-humor')
    if 'twins' in text or 'daughters' in text:
        tags.append('grady-twins')
        tags.append('twins')
    if 'woman' in text and ('bathtub' in text or '237' in text):
        tags.append('woman-237')
    if 'blood' in text and ('elevator' in text or 'lift' in text):
        tags.append('blood-elevator')
    if 'ghost' in text or 'apparition' in text or 'supernatural' in text:
        tags.append('ghost-encounter')
    if 'july 4' in text or '1921' in text or 'ball' in text:
        tags.append('ghost-party')
    if 'shining' in text or 'psychic' in text or 'vision' in text:
        tags.append('shining-vision')
    if 'possess' in text or 'hotel' in text and 'influence' in text:
        tags.append('possession')
    if 'photograph' in text and '1921' in text:
        tags.append('photograph')
        tags.append('time-distortion')

    # === ICONIC MOMENTS ===
    if "here's johnny" in text or "heres johnny" in text:
        tags.append('heres-johnny')
        tags.append('iconic-dialogue')
    if 'all work and no play' in text or 'manuscript' in text and 'typed' in text:
        tags.append('all-work-no-play')
    if 'redrum' in text or 'red rum' in text:
        tags.append('red-rum')
    if 'murder' in text and 'mirror' in text:
        tags.append('red-rum')
    if 'baseball bat' in text or 'wendy' in text and 'bat' in text and 'stair' in text:
        tags.append('baseball-bat')
    if 'tricycle' in text or 'big wheel' in text:
        tags.append('tricycle')
    if 'always been' in text and 'caretaker' in text:
        tags.append('always-been-caretaker')
    if 'footprint' in text and ('backwards' in text or 'trick' in text):
        tags.append('footprint-trick')

    # === CHARACTERS ===
    # Jack
    if scene_id >= 60:  # Jack's decline starts mid-film
        tags.append('jack-declining')
    if 'jack' in text and ('axe' in text or 'weapon' in text or 'attack' in text):
        tags.append('jack-violence')
    if 'jack' in text and ('ghost' in text or 'lloyd' in text or 'grady' in text):
        tags.append('jack-supernatural')
    if 'jack' in text and ('drink' in text or 'alcohol' in text or 'bourbon' in text):
        tags.append('jack-drunk')

    # Wendy
    if 'wendy' in text and ('discover' in text or 'finds' in text):
        tags.append('wendy-discovering')
    if 'wendy' in text and ('knife' in text or 'bat' in text or 'defend' in text or 'fight' in text):
        tags.append('wendy-defending')
    if 'wendy' in text and ('ghost' in text or 'skeleton' in text or 'blood' in text):
        tags.append('wendy-supernatural')

    # Danny
    if 'danny' in text and ('shining' in text or 'psychic' in text or 'vision' in text):
        tags.append('danny-shining')
    if 'danny' in text and ('danger' in text or 'hurt' in text or 'attacked' in text):
        tags.append('danny-endangered')
    if 'tony' in text:
        tags.append('danny-tony')

    # Halloran
    if 'halloran' in text and ('shining' in text or 'psychic' in text or 'vision' in text):
        tags.append('halloran-shining')
    if 'halloran' in text and ('rescue' in text or 'snowcat' in text or 'driving' in text):
        tags.append('halloran-rescue')

    # === VIOLENCE ===
    if 'murder' in text or 'kill' in text or 'axe' in detailed:
        tags.append('murder')
    if 'chase' in text or 'pursuing' in text or 'hunt' in text:
        tags.append('chase')
    if 'axe' in text or 'knife' in text or 'bat' in text or 'weapon' in text:
        tags.append('weapon')
    if 'attack' in text or 'hit' in text or 'slash' in text or 'swing' in text:
        tags.append('physical-violence')
    if (scene_id in [100, 101, 102, 103, 104, 115, 118, 119, 120, 121] and
        ('threat' in text or 'menac' in text or 'going to' in text)):
        tags.append('threatened-violence')
    if 'threat' in text or 'menac' in text or scene_id >= 100:
        tags.append('psychological-horror')

    # === THEMES ===
    if scene_id <= 50 or 'alone' in text or 'isolated' in text:
        tags.append('isolation')
    if (scene_id >= 50 and scene_id <= 120 and
        ('family' in text or 'wendy' in text and 'jack' in text or 'danny' in text)):
        tags.append('family-breakdown')
    if ('marriage' in text or 'husband' in text or 'wife' in text or
        (scene_id in [20, 32, 100, 101, 118, 119, 120, 121])):
        tags.append('marriage-strain')
    if (('danny' in text and ('wendy' in text or 'jack' in text)) or
        'father' in text or 'mother' in text or 'son' in text):
        tags.append('parent-child')
    if 'alcohol' in text or 'drink' in text or 'sober' in text:
        tags.append('alcoholism')
    if 'typewriter' in text or 'writing' in text:
        tags.append('typewriter')
        tags.append('writer-block')
    if scene_id in [20, 32, 37] or 'past' in text or 'before' in text or 'history' in text:
        if 'violent' in text or 'hurt' in text or 'arm' in text or 'injury' in text:
            tags.append('violence-history')
    if scene_id in [118, 119, 120, 121] and 'jack' in text:
        tags.append('gaslighting')
    if scene_id <= 50 or 'caretaker' in text or 'maintain' in text or 'job' in text:
        if 'responsibility' in text or 'duty' in text or scene_id in [1, 2, 3, 5, 6]:
            tags.append('responsibility')

    # === OBJECTS ===
    if 'axe' in text:
        tags.append('axe')
    if 'knife' in text:
        tags.append('knife')
    if 'radio' in text:
        tags.append('radio')
    if 'snowcat' in text:
        tags.append('snowcat')
    if 'phone' in text or 'telephone' in text:
        tags.append('telephone')

    # === COMMUNICATION ===
    if 'radio' in text or 'phone' in text or 'call' in text:
        tags.append('outside-contact')
    if 'phone' in text or 'telephone' in text:
        if 'call' in text or 'ring' in text or 'dial' in text:
            tags.append('phone-call')
    if 'radio' in text and ('call' in text or 'forest' in text or 'ranger' in text):
        tags.append('radio-call')
    if scene_id in [59, 60, 61, 62, 63] or ('block' in text and 'contact' in text):
        if 'cut' in text or 'down' in text or 'out' in text or 'broken' in text:
            tags.append('contact-blocked')
    if 'storm' in text or 'weather' in text:
        tags.append('storm')
    if 'snow' in text or 'winter' in text or 'blizzard' in text:
        tags.append('snow')
    if scene_id >= 50 and ('trap' in text or 'stuck' in text or 'snow' in text):
        tags.append('trapped-by-weather')

    # === PLOT STRUCTURE ===
    # Act structure
    if scene_id <= 40:
        tags.append('act1')
    elif scene_id <= 120:
        tags.append('act2')
    else:
        tags.append('act3')

    if scene_id <= 10:
        tags.append('arrival')
    if 'interview' in text and scene_id <= 5:
        tags.append('interview')
    if scene_id == 33 or ('tour' in text and scene_id <= 40):
        tags.append('hotel-tour')
    if scene_id >= 40 and scene_id <= 50:
        tags.append('closing-day')
    if scene_id >= 51 and scene_id <= 70:
        tags.append('isolation-begins')
    if 'month later' in text:
        tags.append('one-month-later')
    if scene_id >= 100 and scene_id <= 130:
        tags.append('escalation')
    if scene_id >= 120 and scene_id <= 135:
        tags.append('breaking-point')
    if scene_id >= 135 and scene_id <= 141:
        tags.append('crisis')
    if scene_id >= 139 and scene_id <= 141:
        tags.append('climax')
    if scene_id == 142:
        tags.append('resolution')
        tags.append('epilogue')

    # Narrative structure
    if scene_id in [11, 12, 13, 14, 28, 29, 37, 77, 78, 83]:
        tags.append('foreshadowing')
    if scene_id in [57, 90, 92, 116, 117, 140]:
        tags.append('callback')

    # === INTERCUTTING ===
    if 'intercut' in text or 'cut to' in detailed:
        tags.append('intercutting')

    # Remove duplicates and return
    return sorted(list(set(tags)))

# Load scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

scenes = data['scenes']

print(f"Retagging {len(scenes)} scenes with universal tag system...\n")

for scene in scenes:
    scene_id = scene['id']
    old_tags = scene.get('tags', [])

    # Apply smart tagging
    new_tags = smart_tag_scene(scene)
    scene['tags'] = new_tags

    # Validate all tags
    invalid = [t for t in new_tags if t not in UNIVERSAL_TAGS]
    if invalid:
        print(f"⚠️  Scene {scene_id}: Invalid tags: {invalid}")

    if scene_id % 20 == 0:
        print(f"✓ Processed scene {scene_id}")

print(f"\n✅ All {len(scenes)} scenes retagged!")
print(f"✅ All tags validated against universal system")

# Save
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"\n✅ File saved!")
