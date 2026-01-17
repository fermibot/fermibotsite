#!/usr/bin/env python3
"""
Fix dialogue extraction and summaries for The Lighthouse scenes.
Processes scene by scene with progress updates.
"""

import json
import re

def extract_dialogue_from_text(text):
    """Extract dialogue lines from screenplay text."""
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

        # Check if line is all caps (character name in screenplay format)
        # But exclude scene headings and technical directions
        is_char_name = (line.isupper() and
                       len(line) < 40 and
                       not line.startswith(('INT.', 'EXT.', 'CUT', 'FADE', 'DISSOLVE', 'CLOSE', 'WIDE', 'ANGLE', 'HOLD', 'PAN', 'ZOOM', 'THE ')))

        if is_char_name and i + 1 < len(lines):
            # Next line should be dialogue or parenthetical
            char_name = line
            dialogue_text = ""
            j = i + 1

            # Collect dialogue lines (may be interrupted by parentheticals)
            while j < len(lines):
                next_line = lines[j].strip()

                # Stop if we hit another character name or empty line
                if not next_line:
                    break
                if next_line.isupper() and len(next_line) < 40:
                    break
                if next_line.startswith(('INT.', 'EXT.', 'CUT', 'FADE')):
                    break

                # Skip parentheticals but continue collecting
                if next_line.startswith('(') and next_line.endswith(')'):
                    j += 1
                    continue

                # Add dialogue line
                dialogue_text += " " + next_line
                j += 1

            # Clean up and store
            dialogue_text = dialogue_text.strip()
            if dialogue_text and len(dialogue_text) > 5:
                # Replace character names with proper formatting
                char_display = char_name.title() if char_name not in ['OLD', 'YOUNG'] else char_name.title()
                dialogue.append(f'"{dialogue_text}" — {char_display}')

            i = j - 1

        i += 1

    return dialogue

def create_scene_summary(scene_data):
    """Create a concise summary from scene text."""
    text = scene_data.get('text', '')
    title = scene_data.get('title', '')

    if not text:
        return "No scene description available."

    # Remove technical directions
    text_clean = re.sub(r'\b(CLOSE ON|WIDE SHOT|ANGLE ON|CUT TO|FADE|DISSOLVE|PAN|ZOOM|HOLD)\b:?', '', text)
    text_clean = re.sub(r'\s+', ' ', text_clean).strip()

    # If there's dialogue, focus on action + key dialogue
    dialogue = extract_dialogue_from_text(text)

    # Create summary based on content type
    sentences = [s.strip() + '.' for s in text_clean.split('.') if s.strip()]

    if dialogue:
        # Scene with dialogue - summarize action + one key line
        action_sentences = [s for s in sentences if not any(char in s.upper() for char in ['OLD', 'YOUNG'])][:2]
        summary = ' '.join(action_sentences[:1])
        if len(summary) > 200:
            summary = summary[:197] + "..."
    else:
        # Scene without dialogue - summarize key visual/action
        summary = ' '.join(sentences[:2])
        if len(summary) > 200:
            summary = summary[:197] + "..."

    return summary if summary else text[:150] + "..."

def process_scenes():
    """Process all scenes with progress updates."""

    # Load JSON
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    total = len(scenes)

    print(f"🎬 Processing {total} scenes from The Lighthouse...")
    print(f"=" * 60)

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get('id', i)
        title = scene.get('title', f'Scene {scene_id}')

        print(f"\n[{i}/{total}] Scene {scene_id}: {title}")

        # Extract dialogue
        text = scene.get('text', '')
        dialogue = extract_dialogue_from_text(text)

        if dialogue:
            print(f"  ✓ Extracted {len(dialogue)} dialogue lines")
            scene['keyDialogue'] = dialogue
        else:
            print(f"  • No dialogue found")
            scene['keyDialogue'] = []

        # Create summary
        print(f"  • Creating summary...")
        summary = create_scene_summary(scene)
        scene['summary'] = summary
        print(f"  ✓ Summary: {summary[:60]}...")

        # Save progress every 10 scenes
        if i % 10 == 0:
            with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Progress saved ({i}/{total} scenes)")

    # Final save
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n{'=' * 60}")
    print(f"✅ Complete! Processed all {total} scenes.")
    print(f"💾 Saved to: RobertEggers_2019_TheLighthouse_scenes_analyzed.json")

if __name__ == '__main__':
    process_scenes()
