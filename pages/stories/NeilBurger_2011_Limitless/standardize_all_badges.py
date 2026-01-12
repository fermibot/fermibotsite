#!/usr/bin/env python3
"""
Standardize all tag badges across the entire system:
1. Replace .question-tag with .tag-badge in HTML
2. Remove non-standard tags like "philosophy"
3. Ensure all badges use the same 15 standardized tags
"""

import re

# Read HTML file
with open('limitless.html', 'r') as f:
    html_content = f.read()

# Step 1: Replace all "question-tag" with "tag-badge"
html_content = html_content.replace('class="question-tag tag-', 'class="tag-badge tag-')

print("✓ Replaced all .question-tag with .tag-badge")

# Step 2: Find and report non-standard tags
non_standard_pattern = r'class="tag-badge tag-(\w+)">(.*?)</span>'
all_tags = re.findall(non_standard_pattern, html_content)

standard_tags = {
    'ethics', 'power', 'identity', 'enhancement', 'addiction',
    'consequence', 'withdrawal', 'transformation', 'ambition',
    'hubris', 'violence', 'relationships', 'sacrifice', 'control', 'memory'
}

non_standard = set()
for tag_class, tag_text in all_tags:
    if tag_class not in standard_tags:
        non_standard.add(tag_class)
        print(f"⚠ Non-standard tag found: '{tag_class}' with text '{tag_text}'")

# Step 3: Fix non-standard tags
# Replace "philosophy" with proper tags - but these should have been fixed by update_question_tags_v3.py
# Let's just remove the text-only badges and keep icon ones
if non_standard:
    print(f"\n⚠ Found {len(non_standard)} non-standard tag(s): {', '.join(non_standard)}")
    print("These should be removed or mapped to standard tags")

    # Remove philosophy tags without icons (they don't match our system)
    html_content = re.sub(r'<span class="tag-badge tag-philosophy">Philosophy</span>\n\s*', '', html_content)
    print("✓ Removed non-standard 'philosophy' tags without icons")

# Write updated HTML
with open('limitless.html', 'w') as f:
    f.write(html_content)

print("\n✓ Standardized all badges in limitless.html")
print("\nNext: Verify CSS is consistent across:")
print("  - .tag-badge (tooltips, info cards, questions)")
print("  - .legend-question-item (legend filters)")
