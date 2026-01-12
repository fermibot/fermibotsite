#!/usr/bin/env python3
"""
Update all book club questions to show ALL tags in grouped format,
with only the relevant tags highlighted (active) for each question.
"""

# Tag groups in canonical order
TAG_GROUPS = {
    'Core Themes': ['ethics', 'power', 'identity'],
    'Enhancement': ['enhancement', 'addiction', 'withdrawal'],
    'Consequences': ['consequence', 'violence', 'sacrifice'],
    'Personal': ['transformation', 'ambition', 'hubris'],
    'Social': ['relationships', 'control', 'memory']
}

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

# Active tags per question
QUESTION_TAGS = {
    1: ['consequence', 'hubris', 'power'],
    2: ['identity', 'relationships'],
    3: ['identity', 'relationships', 'transformation'],
    4: ['transformation'],
    5: ['addiction', 'ambition', 'consequence', 'enhancement', 'identity', 'transformation', 'withdrawal'],
    6: ['addiction', 'consequence', 'enhancement', 'hubris', 'withdrawal'],
    7: ['addiction', 'ambition', 'consequence', 'power', 'relationships'],
    8: ['consequence', 'hubris', 'identity', 'power', 'transformation'],
    9: ['consequence', 'ethics', 'hubris', 'memory', 'violence'],
    10: ['addiction', 'consequence', 'hubris', 'power', 'relationships', 'withdrawal'],
    11: ['addiction', 'consequence', 'control', 'power', 'violence', 'withdrawal'],
    12: ['addiction', 'consequence', 'ethics', 'relationships', 'withdrawal'],
    13: ['consequence', 'hubris', 'power', 'sacrifice'],
    14: ['consequence', 'hubris', 'identity', 'power', 'relationships', 'transformation', 'withdrawal'],
    15: ['consequence', 'control', 'ethics', 'hubris', 'power', 'sacrifice'],
    16: ['consequence', 'control', 'identity', 'power', 'transformation'],
    17: ['consequence', 'ethics', 'sacrifice', 'violence'],
    18: ['consequence', 'control', 'hubris', 'power'],
    19: ['ambition', 'consequence', 'control', 'hubris', 'power'],
    20: ['consequence', 'ethics', 'hubris', 'identity', 'power']
}

def generate_tag_html(question_num):
    """Generate HTML for all tags with only relevant ones highlighted."""
    active_tags = set(QUESTION_TAGS.get(question_num, []))

    html_parts = []

    for group_name, group_tags in TAG_GROUPS.items():
        group_html = f'<div class="tag-group">'
        group_html += f'<span class="tag-group-label">{group_name}:</span>'

        for tag in group_tags:
            icon = TAG_ICONS[tag]
            label = tag.capitalize()
            is_active = tag in active_tags
            active_class = '' if is_active else 'inactive'

            group_html += f'<span class="tag-badge tag-{tag} {active_class}">{icon} {label}</span>'

        group_html += '</div>'
        html_parts.append(group_html)

    return '\n                    '.join(html_parts)

def update_html():
    """Update the limitless.html file with new tag structure."""
    import re

    with open('limitless.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match question divs
    pattern = r'(<div class="book-club-question"[^>]*>.*?)<div class="question-tags">.*?</div>(.*?</div>\s*</div>)'

    def replace_tags(match):
        question_div_start = match.group(1)
        after_tags = match.group(2)

        # Extract question number from the content
        num_match = re.search(r'<span class="question-number">(\d+)</span>', question_div_start)
        if not num_match:
            return match.group(0)

        question_num = int(num_match.group(1))
        new_tags_html = generate_tag_html(question_num)

        return f'{question_div_start}<div class="question-tags">\n                    {new_tags_html}\n                </div>{after_tags}'

    # Replace all question tag sections
    updated_content = re.sub(pattern, replace_tags, content, flags=re.DOTALL)

    with open('limitless.html', 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print("✓ Updated all 20 questions with grouped tag display")
    print("✓ All tags shown in canonical order")
    print("✓ Only relevant tags highlighted per question")

if __name__ == '__main__':
    update_html()
