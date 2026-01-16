#!/usr/bin/env python3
"""
Universal Tag System for The Shining
Creates a consistent, comprehensive tag vocabulary for all scenes
"""

UNIVERSAL_TAGS = {
    # ============ CHARACTER ARCS ============
    "jack-declining": "Jack's mental deterioration and transformation",
    "jack-violence": "Jack commits or threatens physical violence",
    "jack-supernatural": "Jack encounters supernatural forces",
    "jack-drunk": "Jack drinking or drunk (breaking sobriety)",

    "wendy-discovering": "Wendy discovers evidence of danger",
    "wendy-defending": "Wendy fights back or protects Danny",
    "wendy-supernatural": "Wendy encounters supernatural forces",

    "danny-shining": "Danny using psychic abilities or having visions",
    "danny-endangered": "Danny in physical danger",
    "danny-tony": "Tony speaking or appearing",

    "halloran-shining": "Halloran using psychic abilities",
    "halloran-rescue": "Halloran's rescue attempt",

    # ============ LOCATIONS ============
    "hotel-tour": "Touring/exploring the Overlook Hotel",
    "gold-ballroom": "Scenes in the Gold Ballroom",
    "room-237": "Scenes in/about Room 237",
    "maze": "Hedge maze scenes",
    "pantry": "Food storage room/pantry",
    "apartment": "Torrance family apartment",
    "colorado-lounge": "Colorado Lounge scenes",
    "bathroom": "Bathroom scenes",

    # ============ SUPERNATURAL ELEMENTS ============
    "ghost-encounter": "Character encounters ghosts/apparitions",
    "ghost-party": "The July 4th Ball 1921 party manifestation",
    "lloyd": "Lloyd the bartender ghost",
    "grady": "Delbert Grady ghost",
    "grady-twins": "The murdered Grady daughters",
    "woman-237": "The woman in bathtub ghost",
    "blood-elevator": "Elevator doors releasing blood",
    "possession": "Jack being influenced/possessed by hotel",
    "shining-vision": "Psychic visions of past/future violence",
    "time-distortion": "Time paradoxes or temporal anomalies",

    # ============ ICONIC MOMENTS ============
    "heres-johnny": "The 'Here's Johnny!' door scene",
    "all-work-no-play": "Discovery of typed manuscript",
    "red-rum": "REDRUM/MURDER revelation",
    "twins": "Grady twins appearances",
    "photograph": "Final 1921 photograph reveal",
    "baseball-bat": "Wendy with baseball bat on stairs",
    "tricycle": "Danny riding tricycle through halls",
    "always-been-caretaker": "Grady tells Jack he's always been caretaker",
    "footprint-trick": "Danny's backwards footprint escape",

    # ============ VIOLENCE & HORROR ============
    "physical-violence": "Actual physical violence occurs",
    "threatened-violence": "Violence threatened but not enacted",
    "psychological-horror": "Mental/emotional horror without physical violence",
    "murder": "Murder or murder attempt",
    "chase": "Chase sequences",
    "weapon": "Character obtains or uses weapon",

    # ============ KEY DIALOGUE/PHRASES ============
    "iconic-dialogue": "Famous/memorable dialogue",
    "gaslighting": "Jack gaslighting Wendy",
    "dark-humor": "Kubrick's dark comedic moments",

    # ============ PLOT PROGRESSION ============
    "arrival": "Arrival at hotel/setup",
    "interview": "Job interview scenes",
    "closing-day": "Last day with hotel staff",
    "isolation-begins": "Family alone in hotel",
    "one-month-later": "Time jump to December",
    "escalation": "Situation worsening",
    "breaking-point": "Jack's complete breakdown",
    "crisis": "Life-threatening crisis",
    "climax": "Final confrontation/escape",
    "resolution": "Aftermath/epilogue",

    # ============ THEMES ============
    "isolation": "Physical and psychological isolation",
    "family-breakdown": "Family unit disintegrating",
    "alcoholism": "Jack's drinking problem/history",
    "violence-history": "References to past violence",
    "writer-block": "Jack's inability to write",
    "responsibility": "Jack's responsibilities as father/caretaker",
    "parent-child": "Parent-child relationship dynamics",
    "marriage-strain": "Wendy and Jack's deteriorating marriage",

    # ============ OBJECTS/PROPS ============
    "typewriter": "Jack's typewriter/writing",
    "axe": "Jack with fire axe",
    "knife": "Kitchen knife (Wendy's weapon)",
    "radio": "Radio communication attempts",
    "snowcat": "Halloran's snowcat vehicle",
    "telephone": "Phone communication/attempts",

    # ============ COMMUNICATION ============
    "outside-contact": "Attempted contact with outside world",
    "radio-call": "Radio communication",
    "phone-call": "Telephone communication",
    "contact-blocked": "Communication attempts blocked",

    # ============ WEATHER/ENVIRONMENT ============
    "storm": "Snowstorm/weather event",
    "snow": "Heavy snow/winter conditions",
    "trapped-by-weather": "Hotel isolated by weather",

    # ============ CALLBACKS/STRUCTURE ============
    "callback": "References earlier scene/event",
    "foreshadowing": "Hints at future events",
    "intercutting": "Scene intercuts between locations/characters",

    # ============ ACT STRUCTURE ============
    "act1": "Act 1 - Setup",
    "act2": "Act 2 - Isolation and escalation",
    "act3": "Act 3 - Crisis and escape",
    "epilogue": "Epilogue - Resolution",
}

# Tag categories for organization
TAG_CATEGORIES = {
    "Characters": [
        "jack-declining", "jack-violence", "jack-supernatural", "jack-drunk",
        "wendy-discovering", "wendy-defending", "wendy-supernatural",
        "danny-shining", "danny-endangered", "danny-tony",
        "halloran-shining", "halloran-rescue"
    ],
    "Locations": [
        "hotel-tour", "gold-ballroom", "room-237", "maze", "pantry",
        "apartment", "colorado-lounge", "bathroom"
    ],
    "Supernatural": [
        "ghost-encounter", "ghost-party", "lloyd", "grady", "grady-twins",
        "woman-237", "blood-elevator", "possession", "shining-vision", "time-distortion"
    ],
    "Iconic Moments": [
        "heres-johnny", "all-work-no-play", "red-rum", "twins", "photograph",
        "baseball-bat", "tricycle", "always-been-caretaker", "footprint-trick"
    ],
    "Violence & Horror": [
        "physical-violence", "threatened-violence", "psychological-horror",
        "murder", "chase", "weapon"
    ],
    "Themes": [
        "isolation", "family-breakdown", "alcoholism", "violence-history",
        "writer-block", "responsibility", "parent-child", "marriage-strain"
    ],
    "Objects": [
        "typewriter", "axe", "knife", "radio", "snowcat", "telephone"
    ]
}

def get_tag_description(tag):
    """Get description for a tag"""
    return UNIVERSAL_TAGS.get(tag, "")

def validate_tags(scene_tags):
    """Check if all tags are in universal system"""
    invalid = [tag for tag in scene_tags if tag not in UNIVERSAL_TAGS]
    return invalid

if __name__ == "__main__":
    print("Universal Tag System for The Shining")
    print("=" * 60)
    print(f"\nTotal tags defined: {len(UNIVERSAL_TAGS)}\n")

    for category, tags in TAG_CATEGORIES.items():
        print(f"\n{category}:")
        for tag in tags:
            print(f"  • {tag}: {UNIVERSAL_TAGS[tag]}")
