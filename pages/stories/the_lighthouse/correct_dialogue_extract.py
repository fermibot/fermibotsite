#!/usr/bin/env python3
"""
Correct dialogue extraction based on actual screenplay format.
"""

import json

def extract_real_dialogue(text):
    """Extract only actual spoken dialogue from screenplay text."""
    if not text:
        return []

    dialogue = []
    lines = text.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Check for character name (OLD, YOUNG, or with CONT'D)
        if line in ['OLD', 'YOUNG'] or line.startswith(('OLD (', 'YOUNG (')):
            char_name = 'Old' if line.startswith('OLD') else 'Young'
            dialogue_lines = []
            j = i + 1

            # Collect dialogue until we hit action or new character
            while j < len(lines):
                next_line = lines[j].strip()

                # Stop if empty line
                if not next_line:
                    break

                # Stop if new character
                if next_line in ['OLD', 'YOUNG'] or next_line.startswith(('OLD (', 'YOUNG (')):
                    break

                # Stop if it's an action line (starts with typical action words)
                action_starts = ['He ', 'She ', 'OLD ', 'YOUNG ', 'They ', 'The ', 'A ', 'An ',
                                'It ', 'His ', 'Her ', 'There ', 'Then ', 'Now ', 'Both ']
                if any(next_line.startswith(start) for start in action_starts):
                    break

                # Skip parentheticals but continue
                if next_line.startswith('(') and next_line.endswith(')'):
                    j += 1
                    continue

                # This is dialogue
                dialogue_lines.append(next_line)
                j += 1

            # Store if we have dialogue
            if dialogue_lines:
                full_dialogue = ' '.join(dialogue_lines).strip()
                if full_dialogue:
                    dialogue.append(f'"{full_dialogue}" — {char_name}')

            i = j - 1

        i += 1

    return dialogue

def main():
    """Process all scenes with correct dialogue extraction."""
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    total = len(scenes)
    dialogue_scenes = 0

    print(f"🎬 Extracting REAL dialogue from {total} scenes...")
    print(f"=" * 70 + "\n")

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get('id', i)
        title = scene.get('title', '')
        text = scene.get('text', '')

        # Extract dialogue
        dialogue = extract_real_dialogue(text)
        scene['keyDialogue'] = dialogue

        if dialogue:
            dialogue_scenes += 1
            print(f"[{i:3d}/{total}] Scene {scene_id}: {len(dialogue):2d} lines - {title[:40]}")
            # Show first dialogue
            first_line = dialogue[0]
            if len(first_line) > 75:
                print(f"          {first_line[:72]}...")
            else:
                print(f"          {first_line}")

        # Save progress every 30 scenes
        if i % 30 == 0:
            with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Progress saved ({i}/{total})\n")

    # Final save
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n" + "=" * 70)
    print(f"✅ Complete! {dialogue_scenes}/{total} scenes have dialogue")
    print(f"💾 Saved to: RobertEggers_2019_TheLighthouse_scenes_analyzed.json")

if __name__ == '__main__':
    main()
