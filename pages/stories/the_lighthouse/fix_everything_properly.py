#!/usr/bin/env python3
"""
Fix dialogue format AND create proper summaries.
"""

import json
import re

def convert_dialogue_format(key_dialogue):
    """Convert 'text — Speaker' to {speaker: 'Speaker', quote: 'text'}"""
    quotes = []
    for line in key_dialogue:
        # Parse format: "quote text" — Speaker
        match = re.match(r'"(.+?)"\s*—\s*(.+)', line)
        if match:
            quote_text = match.group(1).strip()
            speaker = match.group(2).strip()
            quotes.append({
                "speaker": speaker,
                "quote": quote_text
            })
    return quotes

def create_proper_summary(scene):
    """Create a proper 2-3 sentence summary from the text."""
    text = scene.get('text', '')
    title = scene.get('title', '')

    if not text:
        return "No description available."

    # Remove technical directions
    text = re.sub(r'\b(CLOSE ON|WIDE SHOT|ANGLE ON|CUT TO|FADE|DISSOLVE|PAN|ZOOM|HOLD|MUSIC CUE|IMAGE:|OMITTED)\b:?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\d+\.\s*$', '', text)  # Remove page numbers
    text = re.sub(r'\s+', ' ', text).strip()

    # Split into sentences
    sentences = []
    for sent in text.split('.'):
        sent = sent.strip()
        if sent and len(sent) > 10:
            # Skip if it's a character name line
            if not sent.isupper() or len(sent) > 50:
                sentences.append(sent)

    # Create summary based on content
    if sentences:
        # Take first 2-3 meaningful sentences
        summary_parts = []
        for sent in sentences[:4]:
            # Skip if it starts with dialogue markers
            if not any(sent.startswith(x) for x in ['OLD', 'YOUNG', 'He says', 'She says']):
                summary_parts.append(sent)
                if len(' '.join(summary_parts)) > 150:
                    break

        summary = '. '.join(summary_parts[:3])
        if summary and not summary.endswith('.'):
            summary += '.'

        # Limit length
        if len(summary) > 250:
            summary = summary[:247] + '...'

        return summary if summary else sentences[0][:200] + "..."

    return text[:200] + "..." if len(text) > 200 else text

def main():
    """Fix dialogue format and summaries for all scenes."""
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    total = len(scenes)
    dialogue_count = 0

    print(f"🎬 Fixing {total} scenes...")
    print(f"=" * 70 + "\n")

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get('id', i)

        # Fix dialogue format
        if scene.get('keyDialogue'):
            quotes = convert_dialogue_format(scene['keyDialogue'])
            scene['quotes'] = quotes
            if quotes:
                dialogue_count += 1
                print(f"[{i:3d}/{total}] Scene {scene_id}: {len(quotes)} dialogue lines")
        else:
            scene['quotes'] = []

        # Create proper summary
        summary = create_proper_summary(scene)
        scene['summary'] = summary

        # Show summary preview
        preview = summary[:65] + "..." if len(summary) > 65 else summary
        print(f"          Summary: {preview}")

        # Save progress every 20 scenes
        if i % 20 == 0:
            with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Saved ({i}/{total})\n")

    # Final save
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n" + "=" * 70)
    print(f"✅ Complete!")
    print(f"   - {dialogue_count}/{total} scenes have dialogue")
    print(f"   - All {total} scenes have proper summaries")
    print(f"💾 Saved to: RobertEggers_2019_TheLighthouse_scenes_analyzed.json")

if __name__ == '__main__':
    main()
