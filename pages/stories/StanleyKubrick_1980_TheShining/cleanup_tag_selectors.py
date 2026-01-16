#!/usr/bin/env python3
"""
Clean up corrupted tag selectors
"""
import re

# Read file
with open('StanleyKubrick_1980_TheShining_custom.css', 'r') as f:
    content = f.read()

# Fix corrupted selectors like: .tag-badge.tag-, .legend-question-item.tag-SOMETHING
# Should be: .tag-badge.tag-SOMETHING, .legend-question-item.tag-SOMETHING

# Pattern: .tag-badge.tag-, .legend-question-item.tag-SOMETHING {
pattern = r'\.tag-badge\.tag-, \.legend-question-item\.tag-([a-z0-9-]+)'

def replacer(match):
    tag_name = match.group(1)
    return f'.tag-badge.tag-{tag_name}, .legend-question-item.tag-{tag_name}'

# Apply replacement
updated_content = re.sub(pattern, replacer, content)

# Write back
with open('StanleyKubrick_1980_TheShining_custom.css', 'w') as f:
    f.write(updated_content)

count = len(re.findall(pattern, content))
print(f"✅ Fixed {count} corrupted tag selectors")
print(f"✅ All selectors now properly formatted")
