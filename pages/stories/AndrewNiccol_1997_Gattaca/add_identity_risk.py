#!/usr/bin/env python3
"""Add identityRisk field to all Gattaca scenes based on narrative context."""

import json

# Load the JSON
with open('AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json', 'r') as f:
    data = json.load(f)

# Define identity risk levels based on scene/chapter context
# secure: Identity safe, routine deception
# watchful: Heightened awareness, need to be careful
# threatened: Identity at risk, close calls
# crisis: Exposure imminent or confrontation

# Scene to identity risk mapping based on narrative
scene_risk_mapping = {
    # Chapter 1: Opening Ritual (1-10) - Routine deception
    1: 'secure', 2: 'secure', 3: 'secure', 4: 'secure', 5: 'secure',
    6: 'secure', 7: 'secure', 8: 'secure', 9: 'secure', 10: 'secure',

    # Chapter 2: Flashback Birth (11-24) - No risk (past)
    11: 'secure', 12: 'secure', 13: 'secure', 14: 'secure', 15: 'secure',
    16: 'secure', 17: 'secure', 18: 'secure', 19: 'secure', 20: 'secure',
    21: 'secure', 22: 'secure', 23: 'secure', 24: 'secure',

    # Chapter 3: Identity Swap (25-44) - Setting up the deception
    25: 'secure', 26: 'secure', 27: 'secure', 28: 'watchful', 29: 'watchful',
    30: 'watchful', 31: 'watchful', 32: 'watchful', 33: 'watchful', 34: 'watchful',
    35: 'watchful', 36: 'watchful', 37: 'watchful', 38: 'watchful', 39: 'watchful',
    40: 'watchful', 41: 'watchful', 42: 'watchful', 43: 'watchful', 44: 'watchful',

    # Chapter 4: Gattaca Life (45-65) - Working at Gattaca, some tension
    45: 'watchful', 46: 'watchful', 47: 'watchful', 48: 'watchful', 49: 'watchful',
    50: 'watchful', 51: 'watchful', 52: 'watchful', 53: 'watchful', 54: 'watchful',
    55: 'watchful', 56: 'watchful', 57: 'watchful', 58: 'watchful', 59: 'watchful',
    60: 'watchful', 61: 'watchful', 62: 'watchful', 63: 'watchful', 64: 'watchful', 65: 'watchful',

    # Chapter 5: Murder Investigation (66-85) - Investigation begins, increasing threat
    66: 'threatened', 67: 'threatened', 68: 'threatened', 69: 'threatened', 70: 'threatened',
    71: 'threatened', 72: 'threatened', 73: 'threatened', 74: 'threatened', 75: 'threatened',
    76: 'threatened', 77: 'crisis', 78: 'crisis', 79: 'crisis', 80: 'crisis',
    81: 'crisis', 82: 'crisis', 83: 'crisis', 84: 'crisis', 85: 'crisis',

    # Chapter 6: Closing In (86-99) - Investigation intensifies
    86: 'crisis', 87: 'crisis', 88: 'crisis', 89: 'crisis', 90: 'crisis',
    91: 'crisis', 92: 'crisis', 93: 'crisis', 94: 'crisis', 95: 'crisis',
    96: 'crisis', 97: 'crisis', 98: 'crisis', 99: 'crisis',

    # Chapter 7: Truth Revealed (100-114) - Confrontation with brother
    100: 'crisis', 101: 'crisis', 102: 'crisis', 103: 'crisis', 104: 'crisis',
    105: 'crisis', 106: 'threatened', 107: 'threatened', 108: 'threatened', 109: 'threatened',
    110: 'threatened', 111: 'watchful', 112: 'watchful', 113: 'watchful', 114: 'watchful',

    # Chapter 8: Final Launch (115-125) - Resolution, final test
    115: 'watchful', 116: 'watchful', 117: 'watchful', 118: 'threatened', 119: 'threatened',
    120: 'threatened', 121: 'threatened', 122: 'secure', 123: 'secure', 124: 'secure', 125: 'secure'
}

# Update scenes with identity risk
for scene in data['scenes']:
    scene_id = scene['id']
    scene['identityRisk'] = scene_risk_mapping.get(scene_id, 'watchful')

# Save the updated JSON
with open('AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added identityRisk to {len(data['scenes'])} scenes")

# Count by risk level
risk_counts = {}
for scene in data['scenes']:
    risk = scene['identityRisk']
    risk_counts[risk] = risk_counts.get(risk, 0) + 1

print("Risk distribution:")
for risk, count in sorted(risk_counts.items()):
    print(f"  {risk}: {count} scenes")
