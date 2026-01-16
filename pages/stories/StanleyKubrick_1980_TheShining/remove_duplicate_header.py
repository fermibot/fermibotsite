#!/usr/bin/env python3
"""
Remove duplicate TAG BADGE COLORS header
"""

with open('StanleyKubrick_1980_TheShining_custom.css', 'r') as f:
    lines = f.readlines()

# Find and remove lines 995-1005 (the duplicate section)
# Keep only one instance starting from line 1002
output = []
skip_start = None
skip_end = None

for i, line in enumerate(lines):
    if i >= 994 and i <= 1005:
        if 'TAG BADGE COLORS' in line and skip_start is None:
            skip_start = i
            skip_end = i + 6  # Skip header and first selector
    if skip_start is not None and i >= skip_start and i < skip_end:
        continue  # Skip these lines
    else:
        output.append(line)

with open('StanleyKubrick_1980_TheShining_custom.css', 'w') as f:
    f.writelines(output)

print("✅ Removed duplicate header section")
