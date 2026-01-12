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

# Find all book club questions and their scene references
question_pattern = r'<div class="book-club-question" data-scenes="([^"]+)">(.*?)</div>\s*(?=<div class="book-club-question"|</div>\s*</div>\s*</div>\s*<!-- End Book Club Questions -->)'

questions = re.findall(question_pattern, html_content, re.DOTALL)

print(f"Found {len(questions)} questions\n")

# Process each question
question_updates = []
for i, (scene_refs, question_html) in enumerate(questions, 1):
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

    # Find the old question-tags div
    old_tags_match = re.search(r'<div class="question-tags">(.*?)</div>', question_html, re.DOTALL)

    if old_tags_match:
        old_tags_html = old_tags_match.group(0)

        # Build new tags HTML
        new_tags_html = '<div class="question-tags">\n'
        for tag in sorted_tags:
            icon = TAG_ICONS.get(tag, '🏷️')
            label = tag.capitalize()
            new_tags_html += f'                    <span class="question-tag tag-{tag}">{icon} {label}</span>\n'
        new_tags_html += '                </div>'

        question_updates.append({
            'number': i,
            'scenes': scene_ids,
            'old_tags': old_tags_html,
            'new_tags': new_tags_html,
            'tag_list': sorted_tags
        })

        print(f"Question {i} (Scenes {scene_refs}):")
        print(f"  Tags: {', '.join(sorted_tags)}")
        print()

# Apply updates to HTML
new_html = html_content
for update in question_updates:
    new_html = new_html.replace(update['old_tags'], update['new_tags'], 1)

# Write updated HTML
with open('limitless.html', 'w') as f:
    f.write(new_html)

print(f"\n✓ Updated {len(question_updates)} questions with standardized tags")
print(f"✓ Written to limitless.html")
