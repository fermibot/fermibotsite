#!/usr/bin/env python3
"""Add comprehensive discussion questions to Gattaca's analyzed JSON."""

import json

# Load the JSON
with open('AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json', 'r') as f:
    data = json.load(f)

# Comprehensive discussion questions for Gattaca
discussion_questions = [
    # Genetic Determinism & Ethics
    {
        "id": 1,
        "question": "In Gattaca's world, genetic discrimination is illegal but 'we now have discrimination down to a science.' How does this reflect real-world tensions between law and practice?",
        "category": "Ethics",
        "theme": "Genetic Discrimination",
        "relatedTags": ["genetic-discrimination", "society", "ethics"]
    },
    {
        "id": 2,
        "question": "Vincent's parents chose to have Anton 'the natural way' for their first child but then used genetic selection for their second. What does this choice reveal about their values and fears?",
        "category": "Ethics",
        "theme": "Genetic Discrimination",
        "relatedTags": ["family", "genetics", "choice"]
    },
    {
        "id": 3,
        "question": "The geneticist tells Vincent's parents they've given him 'a wonderful gift: any child not given it would resent you.' Is genetic enhancement a gift or a curse?",
        "category": "Ethics",
        "theme": "Genetic Discrimination",
        "relatedTags": ["genetics", "enhancement", "ethics"]
    },

    # Identity & Deception
    {
        "id": 4,
        "question": "Vincent lives as Jerome, scrubbing away his own cells daily. At what point does the deception become his true identity, or does it ever?",
        "category": "Identity",
        "theme": "Identity",
        "relatedTags": ["identity", "deception", "transformation"]
    },
    {
        "id": 5,
        "question": "Eugene says 'I got the better end of the deal - I only lent you my body, you lent me your dream.' What does each character gain and lose in their arrangement?",
        "category": "Identity",
        "theme": "Identity",
        "relatedTags": ["eugene", "vincent", "identity-swap"]
    },
    {
        "id": 6,
        "question": "Vincent tells Irene 'I'm not who you think I am.' She responds 'I don't care.' Can love survive such fundamental deception?",
        "category": "Relationships",
        "theme": "Identity",
        "relatedTags": ["irene", "love", "deception", "truth"]
    },

    # Human Will vs. Determinism
    {
        "id": 7,
        "question": "Vincent says 'There is no gene for fate.' Is the film ultimately optimistic or pessimistic about human potential overcoming genetic limitations?",
        "category": "Philosophy",
        "theme": "Human Will",
        "relatedTags": ["fate", "determination", "philosophy"]
    },
    {
        "id": 8,
        "question": "The swimming contests between Vincent and Anton - the In-Valid consistently beating the Valid - serve as the film's central metaphor. Why does Vincent win?",
        "category": "Characters",
        "theme": "Human Will",
        "relatedTags": ["swimming", "vincent", "anton", "competition"]
    },
    {
        "id": 9,
        "question": "'You want to know how I did it? This is how I did it: I never saved anything for the swim back.' What does Vincent's strategy reveal about his approach to life?",
        "category": "Philosophy",
        "theme": "Human Will",
        "relatedTags": ["swimming", "sacrifice", "determination"]
    },

    # Society & Systems
    {
        "id": 10,
        "question": "Gattaca's workplace has constant DNA testing, urine samples, and blood tests. How does this surveillance society compare to modern workplace monitoring?",
        "category": "Society",
        "theme": "Society",
        "relatedTags": ["surveillance", "workplace", "dna-testing"]
    },
    {
        "id": 11,
        "question": "The 'Invalids' do menial jobs while 'Valids' reach for the stars. Is this genetic caste system fundamentally different from other forms of social stratification?",
        "category": "Society",
        "theme": "Society",
        "relatedTags": ["class", "discrimination", "labor"]
    },
    {
        "id": 12,
        "question": "Director Josef is murdered because he wanted to cancel the Titan mission. What does his death suggest about the cost of progress in this society?",
        "category": "Society",
        "theme": "Society",
        "relatedTags": ["murder", "investigation", "corruption"]
    },

    # Characters
    {
        "id": 13,
        "question": "Eugene/Jerome is genetically perfect but paralyzed and alcoholic. What does his character say about the relationship between genetic potential and happiness?",
        "category": "Characters",
        "theme": "Characters",
        "relatedTags": ["eugene", "perfection", "suffering"]
    },
    {
        "id": 14,
        "question": "Irene has a heart condition that bars her from the Titan mission despite being a Valid. How does her 'imperfection' change her perspective on Vincent's deception?",
        "category": "Characters",
        "theme": "Characters",
        "relatedTags": ["irene", "heart-defect", "empathy"]
    },
    {
        "id": 15,
        "question": "Anton becomes the detective investigating the murder, bringing him face-to-face with his brother. How does their childhood rivalry inform the investigation?",
        "category": "Characters",
        "theme": "Characters",
        "relatedTags": ["anton", "investigation", "brothers", "rivalry"]
    },
    {
        "id": 16,
        "question": "Dr. Lamar, who performs the final urine test, reveals he always knew Vincent was an Invalid. Why does he let Vincent pass, and what does this say about the system?",
        "category": "Characters",
        "theme": "Characters",
        "relatedTags": ["lamar", "revelation", "compassion"]
    },

    # Science Fiction & Predictions
    {
        "id": 17,
        "question": "The film was made in 1997. How accurately did it predict developments in genetic technology, and what warnings remain relevant?",
        "category": "Science",
        "theme": "Science Fiction",
        "relatedTags": ["genetics", "prediction", "technology"]
    },
    {
        "id": 18,
        "question": "The opening quote states the film takes place 'in the not too distant future.' Do you think we're moving toward or away from Gattaca's vision?",
        "category": "Science",
        "theme": "Science Fiction",
        "relatedTags": ["future", "prediction", "society"]
    },

    # Sacrifice & Redemption
    {
        "id": 19,
        "question": "Eugene's final act - climbing into the incinerator with his silver medal - is profoundly tragic. Was his suicide a failure or a form of transcendence?",
        "category": "Philosophy",
        "theme": "Sacrifice",
        "relatedTags": ["eugene", "suicide", "silver-medal", "sacrifice"]
    },
    {
        "id": 20,
        "question": "Vincent achieves his dream of reaching the stars, but at enormous personal cost. Was the journey worth the destination?",
        "category": "Philosophy",
        "theme": "Sacrifice",
        "relatedTags": ["vincent", "titan-mission", "achievement"]
    }
]

# Add to metadata
data['metadata']['discussionQuestions'] = discussion_questions

# Map questions to scenes based on content
scene_question_mapping = {
    # Opening ritual scenes (1-10) - Identity, Deception
    1: [4, 10], 2: [4, 10], 3: [4], 4: [4], 5: [4, 5],
    6: [4, 5], 7: [4, 10], 8: [4], 9: [4], 10: [4, 10],

    # Birth flashback (11-24) - Genetic discrimination
    11: [1, 2], 12: [1, 2, 3], 13: [1, 2], 14: [1, 2], 15: [2, 3],
    16: [1, 11], 17: [1, 11], 18: [8, 9], 19: [8, 9], 20: [8, 9],
    21: [1, 7], 22: [1, 7], 23: [1, 7, 11], 24: [1, 7],

    # Identity swap (25-44) - Eugene, Identity
    25: [5, 13], 26: [5, 13], 27: [5, 13], 28: [4, 5], 29: [4, 5],
    30: [4, 5, 13], 31: [4, 5], 32: [4, 5], 33: [4, 5, 10], 34: [4, 5],
    35: [5, 13], 36: [5, 13], 37: [4, 5], 38: [4, 10], 39: [4, 5],
    40: [5, 13], 41: [4, 5], 42: [4, 5], 43: [4, 5], 44: [4, 5],

    # Gattaca life & Irene (45-65) - Romance, Work
    45: [10, 11], 46: [10, 11], 47: [6, 14], 48: [6, 14], 49: [10, 11],
    50: [10, 11], 51: [6, 14], 52: [6, 14], 53: [10, 11], 54: [6, 14],
    55: [6, 14], 56: [6, 14], 57: [6, 14], 58: [6, 14], 59: [10, 11],
    60: [6, 14], 61: [6, 14], 62: [6, 14], 63: [6, 14], 64: [6, 14], 65: [6, 14],

    # Investigation begins (66-80) - Murder, Anton
    66: [12, 15], 67: [12, 15], 68: [12, 15], 69: [12, 15], 70: [12, 15],
    71: [12, 15], 72: [12, 15], 73: [12, 15], 74: [12, 15], 75: [12, 15],
    76: [12, 15], 77: [12, 15], 78: [12, 15], 79: [12, 15], 80: [12, 15],

    # Crisis & revelation (81-100)
    81: [6, 15], 82: [6, 15], 83: [4, 6], 84: [4, 6], 85: [4, 6],
    86: [6, 15], 87: [6, 15], 88: [6, 15], 89: [6, 15], 90: [6, 15],
    91: [8, 9, 15], 92: [8, 9, 15], 93: [8, 9, 15], 94: [8, 9, 15], 95: [8, 9, 15],
    96: [7, 8, 9], 97: [7, 8, 9], 98: [7, 8, 9], 99: [7, 8, 9], 100: [7, 8, 9],

    # Final act & launch (101-125) - Transcendence
    101: [7, 19, 20], 102: [7, 19, 20], 103: [7, 19, 20], 104: [7, 19, 20], 105: [7, 19, 20],
    106: [13, 19], 107: [13, 19], 108: [13, 19], 109: [13, 19], 110: [13, 19],
    111: [16], 112: [16], 113: [16], 114: [16], 115: [16, 20],
    116: [7, 20], 117: [7, 20], 118: [7, 20], 119: [19, 20], 120: [19, 20],
    121: [7, 19, 20], 122: [7, 19, 20], 123: [7, 19, 20], 124: [7, 19, 20], 125: [7, 17, 18, 19, 20]
}

# Update scenes with discussion question IDs
for scene in data['scenes']:
    scene_id = scene['id']
    if scene_id in scene_question_mapping:
        scene['discussionQuestions'] = scene_question_mapping[scene_id]
    else:
        scene['discussionQuestions'] = []

# Save the updated JSON
with open('AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Added {len(discussion_questions)} discussion questions to Gattaca")
print("Updated scene-question mappings for all 125 scenes")
