#!/usr/bin/env python3
"""
Final dialogue extraction - ONLY actual spoken words.
"""

import json
import re

def is_action_line(line):
    """Check if a line is an action/description, not dialogue."""
    action_starts = [
        'He ', 'She ', 'They ', 'The ', 'A ', 'An ', 'OLD ', 'YOUNG ',
        'It ', 'His ', 'Her ', 'There ', 'Now ', 'Still ', 'Then ',
        'MUSIC ', 'CLOSE ', 'WIDE ', 'ANGLE ', 'CUT ', 'FADE ', 'DISSOLVE',
        'IMAGE:', 'WHISPERING', 'Pause', 'Hold', 'Beat', 'Silence'
    ]
    return any(line.startswith(start) for start in action_starts)

def extract_clean_dialogue(text):
    """Extract ONLY actual spoken dialogue."""
    if not text:
        return []

    dialogue = []
    lines = [l.strip() for l in text.split('\n') if l.strip()]

    i = 0
    while i < len(lines):
        line = lines[i]

        # Check for character name
        is_char = (
            line.isupper() and
            2 < len(line) < 40 and
            line in ['YOUNG', 'OLD'] or
            line.startswith(('YOUNG', 'OLD')) and '(' not in line and
            not line.startswith(('INT.', 'EXT.', 'CUT', 'FADE', 'CLOSE', 'WIDE', 'THE ', 'A '))
        )

        if is_char:
            char_name = line.split('(')[0].strip()  # Remove parentheticals from name
            dialogue_text = []
            j = i + 1

            # Skip optional parenthetical direction
            if j < len(lines) and lines[j].startswith('(') and lines[j].endswith(')'):
                j += 1

            # Collect dialogue until we hit an action line or new character
            while j < len(lines):
                next_line = lines[j]

                # Stop if we hit another character name
                if next_line.isupper() and 2 < len(next_line) < 40:
                    break

                # Stop if it's clearly an action line
                if is_action_line(next_line):
                    break

                # Skip empty lines
                if not next_line:
                    break

                # Skip internal parentheticals
                if next_line.startswith('(') and next_line.endswith(')'):
                    j += 1
                    continue

                # This is dialogue!
                dialogue_text.append(next_line)
                j += 1

            # Store if we have actual dialogue
            if dialogue_text:
                full_text = ' '.join(dialogue_text).strip()
                # Filter out fragments and action descriptions
                if len(full_text) > 3 and not is_action_line(full_text):
                    dialogue.append(f'"{full_text}" — {char_name.title()}')

            i = j - 1

        i += 1

    return dialogue

def main():
    """Process all scenes."""
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    total = len(scenes)
    found_count = 0

    print(f"🎬 Extracting CLEAN dialogue from {total} scenes...")
    print(f"=" * 60 + "\n")

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get('id', i)
        text = scene.get('text', '')
        dialogue = extract_clean_dialogue(text)

        scene['keyDialogue'] = dialogue

        if dialogue:
            found_count += 1
            print(f"[{i:3d}/{total}] Scene {scene_id:3d}: {len(dialogue):2d} lines")
            # Show first line
            if dialogue:
                print(f"         {dialogue[0][:75]}")

        # Save every 25 scenes
        if i % 25 == 0:
            with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Saved ({i}/{total})\n")

    # Final save
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n" + "=" * 60)
    print(f"✅ Complete! {found_count}/{total} scenes have dialogue")
    print(f"💾 Final save complete")

if __name__ == '__main__':
    main()
