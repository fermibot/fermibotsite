#!/usr/bin/env python3
"""
Remove old legend tag styles and update tag colors to apply to both
.tag-badge and .legend-question-item
"""

# Read the CSS file
with open('StanleyKubrick_1980_TheShining_custom.css', 'r') as f:
    lines = f.readlines()

# Find the start and end of old styles to remove
# Lines 993-1410: old .legend-question-item.tag-* styles
start_remove = None
end_remove = None

for i, line in enumerate(lines):
    if '.legend-question-item.tag-supernatural' in line and start_remove is None:
        start_remove = i
    if '.legend-question-item.tag-trap' in line and end_remove is None:
        # Find the closing brace after this
        for j in range(i, min(i + 5, len(lines))):
            if '}' in lines[j]:
                end_remove = j + 1
                break

if start_remove and end_remove:
    print(f"Removing old legend styles from line {start_remove+1} to {end_remove}")
    # Remove old styles
    del lines[start_remove:end_remove]

    # Insert comment
    lines.insert(start_remove, "/* Old legend tag styles removed - using universal tag system below */\n\n")

# Now update all .tag-badge selectors to also include .legend-question-item
output_lines = []
for line in lines:
    # Replace .tag-badge with both selectors
    if line.startswith('.tag-badge.tag-'):
        # Extract the tag name
        updated = line.replace('.tag-badge.tag-', '.tag-badge.tag-, .legend-question-item.tag-')
        output_lines.append(updated)
    else:
        output_lines.append(line)

# Write back
with open('StanleyKubrick_1980_TheShining_custom.css', 'w') as f:
    f.writelines(output_lines)

print(f"✅ Fixed legend styles!")
print(f"✅ Old styles removed")
print(f"✅ Universal tag colors now apply to both .tag-badge and .legend-question-item")
