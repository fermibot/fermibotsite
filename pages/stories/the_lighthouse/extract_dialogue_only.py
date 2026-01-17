#!/usr/bin/env python3
"""
Extract ONLY actual spoken dialogue from The Lighthouse scenes.
"""

import json
import re

def extract_dialogue_properly(text):
    """Extract only actual spoken dialogue, no stage directions."""
    if not text:
        return []

    dialogue = []
    lines = text.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Skip empty lines
        if not line:
            i += 1
            continue

        # Check for character name (ALL CAPS, no scene headings)
        is_char_name = (
            line.isupper() and
            len(line) < 40 and
            not line.startswith(('INT.', 'EXT.', 'CUT', 'FADE', 'DISSOLVE', 'CLOSE', 'WIDE',
                                'ANGLE', 'HOLD', 'PAN', 'ZOOM', 'THE ', 'A ', 'MUSIC',
                                'THUNDER', 'WIND', 'RAIN', 'FLASH', 'BOOM', 'WATER'))
        )

        if is_char_name:
            char_name = line
            dialogue_lines = []
            j = i + 1

            # Skip parenthetical if present
            if j < len(lines) and lines[j].strip().startswith('(') and lines[j].strip().endswith(')'):
                j += 1

            # Collect actual dialogue until we hit something else
            while j < len(lines):
                next_line = lines[j].strip()

                # Stop conditions
                if not next_line:  # Empty line
                    break
                if next_line.isupper() and len(next_line) < 40:  # Next character
                    break
                if next_line.startswith(('INT.', 'EXT.', 'CUT', 'FADE', 'He ', 'She ', 'OLD ', 'YOUNG ', 'THE ', 'A ')):
                    # Action line, not dialogue
                    break

                # Skip nested parentheticals
                if next_line.startswith('(') and next_line.endswith(')'):
                    j += 1
                    continue

                # This is actual dialogue
                dialogue_lines.append(next_line)
                j += 1

            # Store if we found actual dialogue
            if dialogue_lines:
                full_dialogue = ' '.join(dialogue_lines).strip()
                # Only store if it looks like actual speech (not a fragment)
                if full_dialogue and len(full_dialogue) > 2:
                    dialogue.append(f'"{full_dialogue}" — {char_name.title()}')

            i = j - 1

        i += 1

    return dialogue

def process_all_dialogue():
    """Re-extract dialogue for all scenes."""
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    total = len(scenes)
    dialogue_count = 0

    print(f"🎬 Re-extracting dialogue from {total} scenes...")
    print(f"=" * 60)

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get('id', i)
        title = scene.get('title', f'Scene {scene_id}')

        # Extract dialogue
        text = scene.get('text', '')
        dialogue = extract_dialogue_properly(text)

        if dialogue:
            print(f"[{i}/{total}] Scene {scene_id}: {len(dialogue)} lines")
            scene['keyDialogue'] = dialogue
            dialogue_count += 1

            # Show first dialogue line
            if dialogue:
                preview = dialogue[0][:70] + "..." if len(dialogue[0]) > 70 else dialogue[0]
                print(f"          {preview}")
        else:
            scene['keyDialogue'] = []

        # Save progress every 20 scenes
        if i % 20 == 0:
            with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Progress saved ({i}/{total} scenes)\n")

    # Final save
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n{'=' * 60}")
    print(f"✅ Complete! Found dialogue in {dialogue_count}/{total} scenes.")
    print(f"💾 Saved to: RobertEggers_2019_TheLighthouse_scenes_analyzed.json")

if __name__ == '__main__':
    process_all_dialogue()
