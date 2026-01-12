#!/usr/bin/env python3
"""
Update book club question tags to match the standardized scene tags.
Each question's tags should be the union of all tags from its referenced scenes.
"""

import json
import re

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

def update_question_tags(match):
    """Process each question and update its tags"""
    scene_refs = match.group(1)
    full_question = match.group(0)

    # Parse scene IDs
    try:
        scene_ids = [int(s.strip()) for s in scene_refs.split(',')]
    except:
        return full_question

    # Collect all unique tags from referenced scenes
    all_tags = set()
    for scene_id in scene_ids:
        if scene_id in scene_lookup:
            scene = scene_lookup[scene_id]
            if 'tags' in scene:
                all_tags.update(scene['tags'])

    if not all_tags:
        return full_question

    # Sort tags for consistency
    sorted_tags = sorted(all_tags)

    # Find and replace the question-tags div
    tags_pattern = r'<div class="question-tags">.*?</div>'
    tags_match = re.search(tags_pattern, full_question, re.DOTALL)

    if not tags_match:
        return full_question

    # Build new tags HTML
    new_tags_html = '<div class="question-tags">\n'
    for tag in sorted_tags:
        icon = TAG_ICONS.get(tag, '🏷️')
        label = tag.capitalize()
        new_tags_html += f'                    <span class="question-tag tag-{tag}">{icon} {label}</span>\n'
    new_tags_html += '                </div>'

    # Replace old tags with new tags
    updated_question = full_question.replace(tags_match.group(0), new_tags_html)

    print(f"Updated scenes {scene_refs}: {', '.join(sorted_tags)}")

    return updated_question

# Pattern to match each book club question div
question_pattern = r'<div class="book-club-question" data-scenes="([^"]+)">(.*?)</div>\s*(?=\n\s*(?:<div class="book-club-question"|<!-- (?:ACT|End)))'

# Update all questions
new_html = re.sub(question_pattern, update_question_tags, html_content, flags=re.DOTALL)

# Write updated HTML
with open('limitless.html', 'w') as f:
    f.write(new_html)

print(f"\n✓ Updated question tags")
print(f"✓ Written to limitless.html")
