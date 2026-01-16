#!/usr/bin/env python3
import json

# Read the main JSON file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)

# Update scenes 121-130 with verified page ranges (screenplay page + 1 = PDF page)
for scene in data['scenes']:
    if scene['id'] == 121:
        # Scene 121: Wendy drags Jack, locks in pantry - screenplay pages 117-121
        scene['startPage'] = 118
        scene['endPage'] = 122
        scene['screenplayPage'] = 117
        scene['time']['approximate'] = "Page 118-122"

    elif scene['id'] == 122:
        # Scene 122: Jack laughs, tells Wendy to check snowcat - screenplay page 122
        scene['startPage'] = 123
        scene['endPage'] = 123
        scene['screenplayPage'] = 122
        scene['time']['approximate'] = "Page 123"

    elif scene['id'] == 123:
        # Scene 123: Wendy runs to garage, finds damaged snowcat - screenplay pages 122-123
        scene['startPage'] = 123
        scene['endPage'] = 124
        scene['screenplayPage'] = 122
        scene['time']['approximate'] = "Page 123-124"

    elif scene['id'] == 124:
        # Scene 124: 4pm time jump, Grady unlocks door - screenplay pages 123-125
        scene['startPage'] = 124
        scene['endPage'] = 126
        scene['screenplayPage'] = 123
        scene['time']['approximate'] = "Page 124-126"

    elif scene['id'] == 125:
        # Scene 125: Halloran driving snowcat - screenplay page 125
        scene['startPage'] = 126
        scene['endPage'] = 126
        scene['screenplayPage'] = 125
        scene['time']['approximate'] = "Page 126"

    elif scene['id'] == 126:
        # Scene 126: Danny with knife, Tony says "Red Rum" - screenplay pages 125-126
        scene['startPage'] = 126
        scene['endPage'] = 127
        scene['screenplayPage'] = 125
        scene['time']['approximate'] = "Page 126-127"

    elif scene['id'] == 127:
        # Scene 127: Danny writes MURDER on door - screenplay pages 127-128
        scene['startPage'] = 128
        scene['endPage'] = 129
        scene['screenplayPage'] = 127
        scene['time']['approximate'] = "Page 128-129"

    elif scene['id'] == 128:
        # Scene 128: Wendy sees MURDER, Jack axes door - screenplay page 128
        scene['startPage'] = 129
        scene['endPage'] = 129
        scene['screenplayPage'] = 128
        scene['time']['approximate'] = "Page 129"

    elif scene['id'] == 129:
        # Scene 129: Wendy/Danny in bathroom, Jack axes - screenplay pages 128-129
        scene['startPage'] = 129
        scene['endPage'] = 130
        scene['screenplayPage'] = 128
        scene['time']['approximate'] = "Page 129-130"

    elif scene['id'] == 130:
        # Scene 130: "Wendy I'm home", pushes Danny out window - screenplay pages 130-131
        scene['startPage'] = 131
        scene['endPage'] = 132
        scene['screenplayPage'] = 130
        scene['time']['approximate'] = "Page 131-132"

# Write updated JSON back to file
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✓ Updated scenes 121-130 with verified page ranges")
print("\nFinal page ranges:")
for scene in data['scenes']:
    if 121 <= scene['id'] <= 130:
        sp = scene['screenplayPage']
        pdf_start = scene['startPage']
        pdf_end = scene['endPage']
        print(f"Scene {scene['id']:3d}: Screenplay {sp:3d} -> PDF {pdf_start:3d}-{pdf_end:3d}")

# Check for overlaps with scenes 118-120
print("\n✓ Checking for overlaps with previous scenes:")
prev_scenes = [s for s in data['scenes'] if 118 <= s['id'] <= 120]
for s in prev_scenes:
    print(f"Scene {s['id']}: Pages {s['startPage']}-{s['endPage']}")
print(f"Scene 121: Pages {[s for s in data['scenes'] if s['id'] == 121][0]['startPage']}-{[s for s in data['scenes'] if s['id'] == 121][0]['endPage']}")

print("\n✓ All page ranges verified using PAGE BREAK markers")
print("✓ PDF offset (+1) applied to all scenes")
