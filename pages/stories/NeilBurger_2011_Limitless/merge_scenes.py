#!/usr/bin/env python3
import json

# Read the existing file with scenes 1-20
with open('limitless_scenes_detailed.json', 'r') as f:
    data = json.load(f)

# Scenes 21-50 will be added here
# For now, output current structure
print(f"Current scenes: {len(data['scenes'])}")
print(f"Metadata says: {data['metadata']['totalScenes']} total scenes")

# The file already has 20 scenes, we need to add 30 more (21-50)
print("\nFile is ready to have scenes 21-50 appended to the scenes array")
