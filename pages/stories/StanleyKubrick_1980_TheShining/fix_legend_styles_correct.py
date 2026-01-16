#!/usr/bin/env python3
"""
Correctly update tag colors to apply to both .tag-badge and .legend-question-item
"""
import re

# Read the CSS file
with open('StanleyKubrick_1980_TheShining_custom.css', 'r') as f:
    content = f.read()

# Pattern to match: .tag-badge.tag-SOMETHING {
# Replace with: .tag-badge.tag-SOMETHING, .legend-question-item.tag-SOMETHING {
pattern = r'\.tag-badge\.tag-([a-z0-9-]+)\s*\{'

def replacer(match):
    tag_name = match.group(1)
    return f'.tag-badge.tag-{tag_name}, .legend-question-item.tag-{tag_name} {{'

# Apply replacement
updated_content = re.sub(pattern, replacer, content)

# Write back
with open('StanleyKubrick_1980_TheShining_custom.css', 'w') as f:
    f.write(updated_content)

# Count replacements
count = len(re.findall(pattern, content))
print(f"✅ Updated {count} tag selectors")
print(f"✅ All tag colors now apply to both .tag-badge AND .legend-question-item")
