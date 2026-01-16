#!/usr/bin/env python3
"""
Add chapter structure to The Shining scenes
"""
import json

# Define chapters based on narrative structure
CHAPTERS = {
    'ch1-interview': {
        'name': '📋 The Interview',
        'description': "Jack Torrance's job interview at the Overlook Hotel",
        'scenes': range(1, 7),  # Scenes 1-6
        'color': '#5D4037',
        'icon': '📋'
    },
    'ch2-arrival': {
        'name': '🏨 Welcome to the Overlook',
        'description': 'Family arrives, hotel tour, closing day preparations',
        'scenes': range(7, 40),  # Scenes 7-39
        'color': '#795548',
        'icon': '🏨'
    },
    'ch3-month-later': {
        'name': '❄️ A Month Later',
        'description': 'Winter isolation begins, family alone in the hotel',
        'scenes': range(40, 57),  # Scenes 40-56
        'color': '#607D8B',
        'icon': '❄️'
    },
    'ch4-unraveling': {
        'name': '📝 All Work and No Play',
        'description': 'Wendy discovers the manuscript, Jack deteriorates',
        'scenes': range(57, 80),  # Scenes 57-79
        'color': '#455A64',
        'icon': '📝'
    },
    'ch5-gold-room': {
        'name': '🍸 The Gold Room',
        'description': 'Jack meets Lloyd, the Room 237 incident',
        'scenes': range(80, 104),  # Scenes 80-103
        'color': '#F57F17',
        'icon': '🍸'
    },
    'ch6-grady': {
        'name': '👤 Mr. Grady',
        'description': "Bathroom conversation: 'You've always been the caretaker'",
        'scenes': range(104, 114),  # Scenes 104-113
        'color': '#6A1B9A',
        'icon': '👤'
    },
    'ch7-confrontation': {
        'name': '⚾ The Confrontation',
        'description': 'Baseball bat on stairs, locked in the pantry',
        'scenes': range(114, 124),  # Scenes 114-123
        'color': '#D32F2F',
        'icon': '⚾'
    },
    'ch8-heres-johnny': {
        'name': '🪓 Here\'s Johnny',
        'description': "Halloran's rescue attempt, the door scene",
        'scenes': range(124, 134),  # Scenes 124-133
        'color': '#B71C1C',
        'icon': '🪓'
    },
    'ch9-maze': {
        'name': '🌲 The Maze',
        'description': 'Final chase through the frozen hedge maze',
        'scenes': range(134, 142),  # Scenes 134-141
        'color': '#1B5E20',
        'icon': '🌲'
    },
    'ch10-photograph': {
        'name': '📸 July 4th, 1921',
        'description': 'The photograph reveals Jack has always been here',
        'scenes': range(142, 143),  # Scene 142
        'color': '#424242',
        'icon': '📸'
    }
}

# Load scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

# Add chapter to each scene
for chapter_id, chapter_data in CHAPTERS.items():
    for scene_id in chapter_data['scenes']:
        scene = next((s for s in scenes if s['id'] == scene_id), None)
        if scene:
            scene['chapter'] = chapter_id

# Add chapter definitions to metadata
data['metadata']['chapters'] = {
    chapter_id: {
        'name': chapter_data['name'],
        'description': chapter_data['description'],
        'color': chapter_data['color'],
        'icon': chapter_data['icon'],
        'sceneCount': len(list(chapter_data['scenes']))
    }
    for chapter_id, chapter_data in CHAPTERS.items()
}

# Write updated data
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print('✅ Chapters added!')
print(f'   Total chapters: {len(CHAPTERS)}')
print('\nChapter Breakdown:')
for chapter_id, chapter_data in CHAPTERS.items():
    scene_count = len(list(chapter_data['scenes']))
    print(f"   {chapter_data['icon']} {chapter_data['name']:30s} ({scene_count:2d} scenes)")
