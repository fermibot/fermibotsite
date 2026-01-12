#!/usr/bin/env python3
"""
Update book club question tags to match the standardized scene tags.
Each question's tags should be the union of all tags from its referenced scenes.
"""

import json
import re
from bs4 import BeautifulSoup

# Load scenes data
with open('limitless_scenes_50.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

# Create scene lookup by ID
scene_lookup = {scene['id']: scene for scene in scenes}

# Tag icons for display
TAG_ICONS = {
    'ethics': '⚖️',
    'power': '👑',
    'identity': '🎭',
    'enhancement': '🧠',
    'addiction': '💊',
    'consequence': '⚠️',
    'violence': '⚔️',
    'relationships': '👥',
    'transformation': '🦋',
    'ambition': '🎯',
    'hubris': '🔥',
    'withdrawal': '💢',
    'control': '🎮',
    'memory': '🧩',
    'sacrifice': '🕯️'
}

# Read HTML file
with open('limitless.html', 'r') as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')

# Find all book club questions
questions = soup.find_all('div', class_='book-club-question')

print(f"Found {len(questions)} questions\n")

updated_count = 0

for question_div in questions:
    scene_refs = question_div.get('data-scenes', '')
    if not scene_refs:
        continue

    # Parse scene IDs
    scene_ids = [int(s.strip()) for s in scene_refs.split(',')]

    # Collect all unique tags from referenced scenes
    all_tags = set()
    for scene_id in scene_ids:
        if scene_id in scene_lookup:
            scene = scene_lookup[scene_id]
            if 'tags' in scene:
                all_tags.update(scene['tags'])

    # Sort tags for consistency
    sorted_tags = sorted(all_tags)

    # Find the question-tags div
    tags_div = question_div.find('div', class_='question-tags')

    if tags_div and sorted_tags:
        # Clear existing tags
        tags_div.clear()

        # Add new tags
        for tag in sorted_tags:
            icon = TAG_ICONS.get(tag, '🏷️')
            label = tag.capitalize()

            # Create new tag span
            tag_span = soup.new_tag('span', **{'class': f'question-tag tag-{tag}'})
            tag_span.string = f'{icon} {label}'
            tags_div.append(tag_span)
            tags_div.append('\n                    ')

        # Get question number
        q_num = question_div.find('span', class_='question-number')
        q_num_text = q_num.string if q_num else '?'

        print(f"Question {q_num_text} (Scenes {scene_refs}):")
        print(f"  Tags: {', '.join(sorted_tags)}")
        print()

        updated_count += 1

# Write updated HTML
with open('limitless.html', 'w') as f:
    f.write(str(soup.prettify()))

print(f"\n✓ Updated {updated_count} questions with standardized tags")
print(f"✓ Written to limitless.html")
