#!/usr/bin/env python3
"""
Create comprehensive summaries from the full text field of each scene.
Aim for 400-600 character summaries that capture the complete scene.
"""

import json
import re

def create_comprehensive_summary(scene):
    """Create a detailed summary capturing the full scene content."""
    text = scene.get('text', '').strip()
    title = scene.get('title', '')
    scene_id = scene.get('id', 0)

    if not text or len(text) < 20:
        return "Scene description unavailable."

    # Step 1: Clean up screenplay formatting
    cleaned = text

    # Remove technical directions
    technical_terms = [
        r'\bCLOSE ON\b:?',
        r'\bWIDE SHOT\b:?',
        r'\bEXTREMELY WIDE SHOT\b:?',
        r'\bANGLE ON\b:?',
        r'\bCUT TO\b:?',
        r'\bFADE\b:?',
        r'\bDISSOLVE\b:?',
        r'\bPAN TO\b:?',
        r'\bZOOM\b:?',
        r'\bHOLD\b\.?',
        r'\bMUSIC CUE\b:?',
        r'\bMUSIC CONTINUES\b\.?',
        r'\bIMAGE:\b',
        r'\bOMITTED\b',
        r'\bCONTINUOUS\b',
        r'\bLATER\b\s*$',
        r'\bMOMENTS LATER\b',
        r'\bA BIT LATER\b',
        r'\bTHAT SAME\b',
        r'\bINT/EXT\b',
        r'\bCAMERA\b',
        r'\bBOOMS? UP\b',
        r'\bBOOMS? DOWN\b',
        r'\bPUSHES? IN\b',
        r'\(MORE\)',
        r'\(O\.S\.\)',
        r'\(V\.O\.\)',
        r'\(CONT\'D\)',
        r'^\s*-\s*$',
    ]

    for term in technical_terms:
        cleaned = re.sub(term, '', cleaned, flags=re.IGNORECASE)

    # Remove page numbers at end of lines
    cleaned = re.sub(r'\d+\.\s*$', '', cleaned, flags=re.MULTILINE)

    # Clean up whitespace
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    # Step 2: Separate dialogue from action
    lines = cleaned.split('.')
    action_sentences = []
    dialogue_context = []

    for line in lines:
        line = line.strip()
        if len(line) < 10:
            continue

        # Check if it's a character name or dialogue
        is_character_line = re.match(r'^(OLD|YOUNG)\s*$', line)
        has_character_nearby = re.search(r'\b(OLD|YOUNG)\s+[A-Z][a-z]', line)

        # If it's action/description (not dialogue)
        if not is_character_line and len(line) > 15:
            # Skip pure character names
            if line not in ['OLD', 'YOUNG']:
                action_sentences.append(line.strip())

    # Step 3: Build comprehensive summary
    if action_sentences:
        # Use more sentences to capture the full scene
        summary_parts = []
        char_count = 0

        for sent in action_sentences:
            if sent:
                summary_parts.append(sent)
                char_count += len(sent)

                # Aim for 400-600 characters
                if char_count >= 500:
                    break

        if summary_parts:
            summary = '. '.join(summary_parts)

            # Add period if missing
            if not summary.endswith(('.', '!', '?')):
                summary += '.'

            # Cap at 700 characters max
            if len(summary) > 700:
                # Find last complete sentence before 700
                truncated = summary[:697]
                last_period = truncated.rfind('.')
                if last_period > 400:
                    summary = summary[:last_period + 1]
                else:
                    summary = truncated + '...'

            return summary

    # Fallback: use cleaned text directly
    if len(cleaned) > 100:
        summary = cleaned[:600]
        # Try to end at sentence boundary
        last_period = summary.rfind('.')
        if last_period > 200:
            return summary[:last_period + 1]
        return summary + '...'

    return text[:400].strip() + '...'

def main():
    """Create comprehensive summaries for all scenes."""
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    total = len(scenes)

    print(f"🎬 Creating COMPREHENSIVE summaries for {total} scenes...")
    print(f"=" * 70 + "\n")

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get('id', i)
        title = scene.get('title', '')[:45]

        # Create comprehensive summary
        summary = create_comprehensive_summary(scene)
        scene['summary'] = summary

        # Show progress with length
        print(f"[{i:3d}/{total}] Scene {scene_id:3d} ({len(summary):3d} chars): {title}")

        # Show preview
        preview = summary[:75] + "..." if len(summary) > 75 else summary
        print(f"          {preview}")

        # Save progress every 20 scenes
        if i % 20 == 0:
            with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Progress saved ({i}/{total})\n")

    # Final save
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
        json.dump(data, f, indent=2)

    # Stats
    lengths = [len(s['summary']) for s in scenes]
    avg_length = sum(lengths) / len(lengths)

    print(f"\n" + "=" * 70)
    print(f"✅ COMPLETE! Comprehensive summaries created for all {total} scenes")
    print(f"📊 Average summary length: {avg_length:.0f} characters")
    print(f"📊 Range: {min(lengths)} - {max(lengths)} characters")
    print(f"💾 Saved to: RobertEggers_2019_TheLighthouse_scenes_analyzed.json")

if __name__ == '__main__':
    main()
