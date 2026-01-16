#!/usr/bin/env python3
"""
Generate JavaScript tag system from universal tags
Creates TAG_ICONS and TAG_GROUPS for the timeline.js file
"""

# Universal tag system with icons and descriptions
TAG_SYSTEM = {
    # === CHARACTER ARCS ===
    "jack-declining": {"icon": "📉", "label": "Jack Declining", "group": "Character Arcs"},
    "jack-violence": {"icon": "🔪", "label": "Jack Violence", "group": "Character Arcs"},
    "jack-supernatural": {"icon": "👻", "label": "Jack Supernatural", "group": "Character Arcs"},
    "jack-drunk": {"icon": "🥃", "label": "Jack Drunk", "group": "Character Arcs"},
    "wendy-discovering": {"icon": "🔍", "label": "Wendy Discovering", "group": "Character Arcs"},
    "wendy-defending": {"icon": "🛡️", "label": "Wendy Defending", "group": "Character Arcs"},
    "wendy-supernatural": {"icon": "👤", "label": "Wendy Supernatural", "group": "Character Arcs"},
    "danny-shining": {"icon": "✨", "label": "Danny Shining", "group": "Character Arcs"},
    "danny-endangered": {"icon": "⚠️", "label": "Danny Endangered", "group": "Character Arcs"},
    "danny-tony": {"icon": "🗣️", "label": "Danny/Tony", "group": "Character Arcs"},
    "halloran-shining": {"icon": "🔮", "label": "Halloran Shining", "group": "Character Arcs"},
    "halloran-rescue": {"icon": "🚁", "label": "Halloran Rescue", "group": "Character Arcs"},

    # === LOCATIONS ===
    "hotel-tour": {"icon": "🚶", "label": "Hotel Tour", "group": "Locations"},
    "gold-ballroom": {"icon": "🏛️", "label": "Gold Ballroom", "group": "Locations"},
    "room-237": {"icon": "🚪", "label": "Room 237", "group": "Locations"},
    "maze": {"icon": "🌿", "label": "Maze", "group": "Locations"},
    "pantry": {"icon": "🔒", "label": "Pantry", "group": "Locations"},
    "apartment": {"icon": "🏠", "label": "Apartment", "group": "Locations"},
    "colorado-lounge": {"icon": "🪑", "label": "Colorado Lounge", "group": "Locations"},
    "bathroom": {"icon": "🚿", "label": "Bathroom", "group": "Locations"},

    # === SUPERNATURAL ===
    "ghost-encounter": {"icon": "👻", "label": "Ghost Encounter", "group": "Supernatural"},
    "ghost-party": {"icon": "🎭", "label": "Ghost Party", "group": "Supernatural"},
    "lloyd": {"icon": "🍸", "label": "Lloyd", "group": "Supernatural"},
    "grady": {"icon": "👔", "label": "Grady", "group": "Supernatural"},
    "grady-twins": {"icon": "👯", "label": "Grady Twins", "group": "Supernatural"},
    "woman-237": {"icon": "🛁", "label": "Woman in 237", "group": "Supernatural"},
    "blood-elevator": {"icon": "🩸", "label": "Blood Elevator", "group": "Supernatural"},
    "possession": {"icon": "😈", "label": "Possession", "group": "Supernatural"},
    "shining-vision": {"icon": "👁️", "label": "Shining Vision", "group": "Supernatural"},
    "time-distortion": {"icon": "⏰", "label": "Time Distortion", "group": "Supernatural"},

    # === ICONIC MOMENTS ===
    "heres-johnny": {"icon": "🚪", "label": "Here's Johnny", "group": "Iconic Moments"},
    "all-work-no-play": {"icon": "📝", "label": "All Work No Play", "group": "Iconic Moments"},
    "red-rum": {"icon": "🪞", "label": "REDRUM", "group": "Iconic Moments"},
    "twins": {"icon": "👯", "label": "Twins", "group": "Iconic Moments"},
    "photograph": {"icon": "📸", "label": "Photograph", "group": "Iconic Moments"},
    "baseball-bat": {"icon": "⚾", "label": "Baseball Bat", "group": "Iconic Moments"},
    "tricycle": {"icon": "🚲", "label": "Tricycle", "group": "Iconic Moments"},
    "always-been-caretaker": {"icon": "♾️", "label": "Always Been Here", "group": "Iconic Moments"},
    "footprint-trick": {"icon": "👣", "label": "Footprint Trick", "group": "Iconic Moments"},

    # === VIOLENCE & HORROR ===
    "physical-violence": {"icon": "💥", "label": "Physical Violence", "group": "Violence & Horror"},
    "threatened-violence": {"icon": "⚔️", "label": "Threatened Violence", "group": "Violence & Horror"},
    "psychological-horror": {"icon": "🌀", "label": "Psychological Horror", "group": "Violence & Horror"},
    "murder": {"icon": "🔪", "label": "Murder", "group": "Violence & Horror"},
    "chase": {"icon": "🏃", "label": "Chase", "group": "Violence & Horror"},
    "weapon": {"icon": "🪓", "label": "Weapon", "group": "Violence & Horror"},

    # === KEY DIALOGUE ===
    "iconic-dialogue": {"icon": "💬", "label": "Iconic Dialogue", "group": "Key Dialogue"},
    "gaslighting": {"icon": "🌫️", "label": "Gaslighting", "group": "Key Dialogue"},
    "dark-humor": {"icon": "😏", "label": "Dark Humor", "group": "Key Dialogue"},

    # === PLOT PROGRESSION ===
    "arrival": {"icon": "🚗", "label": "Arrival", "group": "Plot Progression"},
    "interview": {"icon": "📋", "label": "Interview", "group": "Plot Progression"},
    "tour": {"icon": "🚶", "label": "Tour", "group": "Plot Progression"},
    "closing-day": {"icon": "👋", "label": "Closing Day", "group": "Plot Progression"},
    "isolation-begins": {"icon": "🏔️", "label": "Isolation Begins", "group": "Plot Progression"},
    "one-month-later": {"icon": "📅", "label": "One Month Later", "group": "Plot Progression"},
    "escalation": {"icon": "📈", "label": "Escalation", "group": "Plot Progression"},
    "breaking-point": {"icon": "💔", "label": "Breaking Point", "group": "Plot Progression"},
    "crisis": {"icon": "🚨", "label": "Crisis", "group": "Plot Progression"},
    "climax": {"icon": "⚡", "label": "Climax", "group": "Plot Progression"},
    "resolution": {"icon": "✓", "label": "Resolution", "group": "Plot Progression"},
    "epilogue": {"icon": "🎬", "label": "Epilogue", "group": "Plot Progression"},

    # === THEMES ===
    "isolation": {"icon": "❄️", "label": "Isolation", "group": "Themes"},
    "family-breakdown": {"icon": "💔", "label": "Family Breakdown", "group": "Themes"},
    "alcoholism": {"icon": "🍺", "label": "Alcoholism", "group": "Themes"},
    "violence-history": {"icon": "📜", "label": "Violence History", "group": "Themes"},
    "writer-block": {"icon": "✍️", "label": "Writer's Block", "group": "Themes"},
    "responsibility": {"icon": "⚖️", "label": "Responsibility", "group": "Themes"},
    "parent-child": {"icon": "👨‍👦", "label": "Parent-Child", "group": "Themes"},
    "marriage-strain": {"icon": "💍", "label": "Marriage Strain", "group": "Themes"},

    # === OBJECTS ===
    "typewriter": {"icon": "⌨️", "label": "Typewriter", "group": "Objects"},
    "axe": {"icon": "🪓", "label": "Axe", "group": "Objects"},
    "knife": {"icon": "🔪", "label": "Knife", "group": "Objects"},
    "radio": {"icon": "📻", "label": "Radio", "group": "Objects"},
    "snowcat": {"icon": "🚜", "label": "Snowcat", "group": "Objects"},
    "telephone": {"icon": "☎️", "label": "Telephone", "group": "Objects"},

    # === COMMUNICATION ===
    "outside-contact": {"icon": "📡", "label": "Outside Contact", "group": "Communication"},
    "radio-call": {"icon": "📻", "label": "Radio Call", "group": "Communication"},
    "phone-call": {"icon": "☎️", "label": "Phone Call", "group": "Communication"},
    "contact-blocked": {"icon": "🚫", "label": "Contact Blocked", "group": "Communication"},

    # === WEATHER ===
    "storm": {"icon": "🌨️", "label": "Storm", "group": "Weather"},
    "snow": {"icon": "❄️", "label": "Snow", "group": "Weather"},
    "trapped-by-weather": {"icon": "🌨️", "label": "Trapped by Weather", "group": "Weather"},

    # === STRUCTURE ===
    "callback": {"icon": "↩️", "label": "Callback", "group": "Structure"},
    "foreshadowing": {"icon": "🔮", "label": "Foreshadowing", "group": "Structure"},
    "parallel": {"icon": "⫴", "label": "Parallel", "group": "Structure"},
    "intercutting": {"icon": "✂️", "label": "Intercutting", "group": "Structure"},
}

# Generate JavaScript code
print("// ============================================")
print("// CENTRALIZED TAG SYSTEM")
print("// ============================================")
print()
print("// Tag icon mapping")
print("const TAG_ICONS = {")

for tag, info in TAG_SYSTEM.items():
    print(f"    '{tag}': '{info['icon']}',")

print("};")
print()
print("// Tag groups organized by category")
print("const TAG_GROUPS = {")

# Group tags by category
groups = {}
for tag, info in TAG_SYSTEM.items():
    group = info['group']
    if group not in groups:
        groups[group] = []
    groups[group].append(tag)

for group_name, tags in groups.items():
    tags_str = "', '".join(tags)
    print(f"    '{group_name}': ['{tags_str}'],")

print("};")
print()
print("// Canonical tag order (flattened from groups)")
print("const ALL_TAGS_ORDERED = [")

all_tags = []
for group_name in ["Character Arcs", "Locations", "Supernatural", "Iconic Moments",
                   "Violence & Horror", "Key Dialogue", "Plot Progression", "Themes",
                   "Objects", "Communication", "Weather", "Structure"]:
    if group_name in groups:
        all_tags.extend(groups[group_name])

tags_str = "', '".join(all_tags)
print(f"    '{tags_str}'")
print("];")

print(f"\n// Total tags: {len(TAG_SYSTEM)}")
