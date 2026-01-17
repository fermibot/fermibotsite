#!/usr/bin/env python3
"""Add 10 more discussion questions to Gattaca (bringing total to 30)."""

import json

# Load the JSON
with open('AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json', 'r') as f:
    data = json.load(f)

# Get existing questions
existing_questions = data['metadata'].get('discussionQuestions', [])
print(f"Existing questions: {len(existing_questions)}")

# 10 additional discussion questions (IDs 21-30)
new_questions = [
    {
        "id": 21,
        "question": "The film's title 'Gattaca' is made entirely of DNA base letters (G, A, T, C). What does this naming choice suggest about the world?",
        "category": "Symbolism",
        "theme": "Symbolism",
        "relatedTags": ["dna", "symbolism", "title"]
    },
    {
        "id": 22,
        "question": "Vincent uses the phrase 'borrowed ladder' to describe his arrangement with Eugene. What are the implications of this metaphor?",
        "category": "Identity",
        "theme": "Identity",
        "relatedTags": ["borrowed-ladder", "identity", "metaphor"]
    },
    {
        "id": 23,
        "question": "The film shows both Vincent's parents and the geneticist treating genetic selection as routine. How has society normalized 'genoism'?",
        "category": "Society",
        "theme": "Society",
        "relatedTags": ["genoism", "normalization", "society"]
    },
    {
        "id": 24,
        "question": "Vincent's heart is supposedly too weak for space travel, yet he outlasts his 'superior' brother in swimming. What does the film say about medical predictions?",
        "category": "Science",
        "theme": "Science Fiction",
        "relatedTags": ["heart-condition", "prediction", "medical"]
    },
    {
        "id": 25,
        "question": "Eugene keeps his silver medal but considers it a symbol of failure. How does society's definition of success damage even the 'winners'?",
        "category": "Characters",
        "theme": "Characters",
        "relatedTags": ["eugene", "silver-medal", "perfectionism"]
    },
    {
        "id": 26,
        "question": "The murder mystery subplot drives the investigation, but who really killed the Director, and does it matter to the film's themes?",
        "category": "Plot",
        "theme": "Plot",
        "relatedTags": ["murder", "director", "investigation"]
    },
    {
        "id": 27,
        "question": "Irene keeps a strand of Vincent's (Jerome's) hair to have it analyzed. What does this say about trust and love in Gattaca's world?",
        "category": "Relationships",
        "theme": "Relationships",
        "relatedTags": ["irene", "hair", "trust", "love"]
    },
    {
        "id": 28,
        "question": "The film uses a muted, sterile color palette. How does the visual design reflect the world's obsession with genetic purity?",
        "category": "Cinematography",
        "theme": "Cinematography",
        "relatedTags": ["color", "design", "sterile"]
    },
    {
        "id": 29,
        "question": "Vincent never tells Irene his real name. If their relationship continues, can it survive being built on a false identity?",
        "category": "Relationships",
        "theme": "Relationships",
        "relatedTags": ["irene", "vincent", "identity", "future"]
    },
    {
        "id": 30,
        "question": "The closing shot shows Vincent ascending to space while Eugene descends into the incinerator. How do these parallel journeys comment on the meaning of success?",
        "category": "Symbolism",
        "theme": "Symbolism",
        "relatedTags": ["ending", "contrast", "ascent", "descent"]
    }
]

# Add new questions to existing
data['metadata']['discussionQuestions'].extend(new_questions)

# Map new questions to scenes
new_scene_mappings = {
    # Question 21 - Title symbolism (opening scenes)
    1: [21], 2: [21], 3: [21],

    # Question 22 - Borrowed ladder (identity swap scenes)
    25: [22], 26: [22], 27: [22], 28: [22],

    # Question 23 - Normalized genoism (birth/genetics scenes)
    11: [23], 12: [23], 13: [23], 14: [23], 15: [23],

    # Question 24 - Heart condition vs swimming (swimming scenes)
    18: [24], 19: [24], 20: [24], 96: [24], 97: [24], 98: [24],

    # Question 25 - Eugene's silver medal
    30: [25], 35: [25], 106: [25], 119: [25],

    # Question 26 - Murder mystery
    66: [26], 67: [26], 68: [26], 75: [26], 76: [26],

    # Question 27 - Irene's hair test
    51: [27], 52: [27], 60: [27], 61: [27],

    # Question 28 - Visual design (throughout)
    45: [28], 46: [28], 47: [28], 49: [28],

    # Question 29 - Vincent/Irene future
    83: [29], 84: [29], 100: [29], 101: [29],

    # Question 30 - Parallel endings
    119: [30], 120: [30], 121: [30], 122: [30], 123: [30], 124: [30], 125: [30]
}

# Update scenes with new question mappings
for scene in data['scenes']:
    scene_id = scene['id']
    if scene_id in new_scene_mappings:
        existing = scene.get('discussionQuestions', [])
        scene['discussionQuestions'] = list(set(existing + new_scene_mappings[scene_id]))

# Save the updated JSON
with open('AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Total questions now: {len(data['metadata']['discussionQuestions'])}")
