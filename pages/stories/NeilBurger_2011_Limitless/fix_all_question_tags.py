#!/usr/bin/env python3
"""
Fix all question tags by directly parsing and replacing each question's tag section.
"""

import json
import re

# Load scenes data
with open('limitless_scenes_50.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

# Create scene lookup by ID
scene_lookup = {scene['id']: scene for scene in scenes}

# Tag icons
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

# Read HTML
with open('limitless.html', 'r') as f:
    html = f.read()

# Find all book-club-question divs with their data-scenes attribute
pattern = r'<div class="book-club-question" data-scenes="([^"]+)">'
matches = list(re.finditer(pattern, html))

print(f"Found {len(matches)} questions\n")

# Process each question
for match in matches:
    scene_refs = match.group(1)
    scene_ids = [int(s.strip()) for s in scene_refs.split(',')]

    # Collect all tags from these scenes
    all_tags = set()
    for scene_id in scene_ids:
        if scene_id in scene_lookup and 'tags' in scene_lookup[scene_id]:
            all_tags.update(scene_lookup[scene_id]['tags'])

    if not all_tags:
        continue

    sorted_tags = sorted(all_tags)

    # Find the question-tags div after this match
    # Look for next occurrence of <div class="question-tags">...</div>
    start_pos = match.end()
    tags_div_pattern = r'<div class="question-tags">(.*?)</div>'
    tags_match = re.search(tags_div_pattern, html[start_pos:start_pos+2000], re.DOTALL)

    if not tags_match:
        print(f"⚠ Could not find question-tags div for scenes {scene_refs}")
        continue

    # Build new tags HTML
    new_tags_html = '\n'
    for tag in sorted_tags:
        icon = TAG_ICONS.get(tag, '🏷️')
        label = tag.capitalize()
        new_tags_html += f'                    <span class="tag-badge tag-{tag}">{icon} {label}</span>\n'
    new_tags_html += '                '

    # Replace old tags with new tags
    old_full = tags_match.group(0)
    new_full = f'<div class="question-tags">{new_tags_html}</div>'

    # Calculate absolute position
    abs_pos = start_pos + tags_match.start()

    # Replace in HTML
    html = html[:abs_pos] + new_full + html[abs_pos + len(old_full):]

    print(f"✓ Updated scenes {scene_refs}: {', '.join(sorted_tags)}")

# Write updated HTML
with open('limitless.html', 'w') as f:
    f.write(html)

print(f"\n✓ All question tags updated with icons")
