#!/usr/bin/env python3
"""
Retag discussion questions with universal tag system
Maps old question tags to new universal tags
"""

# Map each discussion question to appropriate universal tags
DISCUSSION_QUESTION_TAGS = {
    1: ["jack-declining", "possession", "psychological-horror", "supernatural"],
    2: ["ghost-encounter", "ghost-party", "time-distortion", "possession"],
    3: ["grady-twins", "gold-ballroom", "hotel-tour", "psychological-horror"],
    4: ["danny-shining", "halloran-shining", "shining-vision", "danny-tony"],
    5: ["family-breakdown", "physical-violence", "alcoholism", "parent-child"],
    6: ["photograph", "time-distortion", "always-been-caretaker", "ghost-party"],
    7: ["isolation", "jack-declining", "psychological-horror", "trapped-by-weather"],
    8: ["maze", "chase", "footprint-trick", "climax"],
    9: ["photograph", "possession", "time-distortion", "room-237"],
    10: ["room-237", "woman-237", "ghost-encounter", "psychological-horror"],
    11: ["wendy-defending", "wendy-discovering", "baseball-bat", "weapon"],
    12: ["gold-ballroom", "lloyd", "alcoholism", "ghost-party"],
    13: ["ghost-encounter", "possession", "psychological-horror", "shining-vision"],
    14: ["alcoholism", "jack-drunk", "jack-violence", "family-breakdown"],
    15: ["red-rum", "danny-shining", "danny-tony", "shining-vision"],
    16: ["grady-twins", "murder", "ghost-encounter", "parent-child"],
    17: ["always-been-caretaker", "grady", "time-distortion", "possession"],
    18: ["gold-ballroom", "room-237", "psychological-horror", "ghost-encounter"],
    19: ["violence-history", "ghost-encounter", "hotel-tour"],
    20: ["maze", "footprint-trick", "danny-shining", "chase"]
}

# Generate JavaScript array
print("const DISCUSSION_QUESTIONS = [")

for q_id, tags in DISCUSSION_QUESTION_TAGS.items():
    tags_str = '", "'.join(tags)
    print(f'    // Question {q_id}')
    print(f'    tags: ["{tags_str}"],')
    print()

print("];")

print("\n// Summary:")
for q_id, tags in DISCUSSION_QUESTION_TAGS.items():
    print(f"Q{q_id:2d}: {', '.join(tags)}")
