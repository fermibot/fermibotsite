#!/usr/bin/env python3
"""
Fix the keyDialogue format to be objects (not strings) and improve summaries.
"""

import json
import re

def parse_dialogue_string_to_object(dialogue_string):
    """Convert '"quote" — Speaker' to {speaker: 'Speaker', quote: 'quote'}"""
    match = re.match(r'"(.+?)"\s*—\s*(.+)', dialogue_string)
    if match:
        return {
            "speaker": match.group(2).strip(),
            "quote": match.group(1).strip()
        }
    return None

def enhance_summary(scene):
    """Create detailed summaries from the full text."""
    text = scene.get('text', '').strip()
    title = scene.get('title', '')
    scene_id = scene.get('id', 0)

    if not text or len(text) < 20:
        return "Scene description unavailable."

    # Remove screenplay formatting
    cleaned = text
    cleaned = re.sub(r'\b(CLOSE ON|WIDE SHOT|EXTREMELY WIDE|ANGLE ON|CUT TO|FADE|DISSOLVE|PAN TO|ZOOM|HOLD|MUSIC CUE|MUSIC CONTINUES|IMAGE:|OMITTED|CONTINUOUS|LATER|MOMENTS LATER|A BIT LATER|THAT SAME|INT/EXT)\b\.?', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\(MORE\)|\(O\.S\.\)|\(V\.O\.\)|\(CONT\'D\)', '', cleaned)
    cleaned = re.sub(r'\d+\.', '', cleaned)  # Remove page numbers
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    # Split into sentences
    sentences = []
    for sent in re.split(r'[.!?]+', cleaned):
        sent = sent.strip()
        if len(sent) > 20 and not sent.isupper():
            # Filter out character names and parentheticals
            if not re.match(r'^(OLD|YOUNG)\s*$', sent):
                sentences.append(sent)

    if not sentences:
        return text[:200].strip() + "..."

    # Build summary from first 2-4 sentences
    summary_parts = []
    char_count = 0

    for sent in sentences[:6]:
        # Clean up the sentence
        sent = sent.strip()
        if sent:
            summary_parts.append(sent)
            char_count += len(sent)

            # Stop if we have enough content (250-400 chars is good)
            if char_count > 250:
                break

    if summary_parts:
        summary = '. '.join(summary_parts)
        if not summary.endswith('.'):
            summary += '.'

        # Cap at 400 characters
        if len(summary) > 400:
            summary = summary[:397] + '...'

        return summary

    return text[:300].strip() + "..."

def main():
    """Fix keyDialogue format and enhance all summaries."""
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    total = len(scenes)
    dialogue_count = 0

    print(f"🎬 Fixing {total} scenes...")
    print(f"=" * 70 + "\n")

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get('id', i)
        title = scene.get('title', '')[:50]

        # Fix keyDialogue format
        if scene.get('keyDialogue'):
            old_format = scene['keyDialogue']
            new_format = []

            for dialogue_str in old_format:
                obj = parse_dialogue_string_to_object(dialogue_str)
                if obj:
                    new_format.append(obj)

            scene['keyDialogue'] = new_format

            if new_format:
                dialogue_count += 1
                print(f"[{i:3d}/{total}] Scene {scene_id:3d}: {len(new_format):2d} dialogue | {title}")

        # Enhance summary
        enhanced_summary = enhance_summary(scene)
        scene['summary'] = enhanced_summary

        # Show preview
        preview = enhanced_summary[:70] + "..." if len(enhanced_summary) > 70 else enhanced_summary
        print(f"          {preview}")

        # Save progress every 20 scenes
        if i % 20 == 0:
            with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Saved ({i}/{total})\n")

    # Final save
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n" + "=" * 70)
    print(f"✅ COMPLETE!")
    print(f"   - Fixed keyDialogue format for {dialogue_count} scenes")
    print(f"   - Enhanced summaries for all {total} scenes")
    print(f"💾 Saved to: RobertEggers_2019_TheLighthouse_scenes_analyzed.json")

if __name__ == '__main__':
    main()
