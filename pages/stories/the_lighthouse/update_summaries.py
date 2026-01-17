#!/usr/bin/env python3
"""
Generate clean prose summaries for each scene in The Lighthouse.
No markdown formatting - just readable text.
"""

import json
import re

def parse_screenplay_text(text):
    """Parse screenplay text into action descriptions and dialogue exchanges."""
    lines = text.split('\n')

    action_descriptions = []
    dialogue_exchanges = []
    current_speaker = None
    current_dialogue = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Skip page numbers like "77." or "78."
        if re.match(r'^\d+\.$', line):
            continue

        # Check if it's a character name (all caps, typically short)
        if re.match(r'^[A-Z][A-Z\s\']+(\s*\(.*\))?$', line) and len(line) < 30:
            # Save previous dialogue if any
            if current_speaker and current_dialogue:
                dialogue_exchanges.append((current_speaker, ' '.join(current_dialogue)))
            # Start new speaker
            current_speaker = line.split('(')[0].strip()
            current_dialogue = []
        elif current_speaker:
            # Skip stage directions in parentheses like "(suddenly)"
            if re.match(r'^\(.*\)$', line):
                continue
            # It's dialogue
            if line == '--':
                current_dialogue.append('[pause]')
            else:
                current_dialogue.append(line)
        else:
            # It's action/description (no current speaker)
            action_descriptions.append(line)

    # Capture last dialogue
    if current_speaker and current_dialogue:
        dialogue_exchanges.append((current_speaker, ' '.join(current_dialogue)))

    return action_descriptions, dialogue_exchanges


def generate_clean_summary(scene):
    """Generate a clean prose summary without markdown."""
    text = scene.get('text', '')

    if not text:
        return "No description available."

    # Parse the screenplay text
    action_descriptions, dialogue_exchanges = parse_screenplay_text(text)

    summary_parts = []

    # Action/Visual description - main narrative
    if action_descriptions:
        action_text = ' '.join(action_descriptions)
        action_text = re.sub(r'\b\d+\.\s*', '', action_text)  # Remove page numbers
        action_text = re.sub(r'\s+', ' ', action_text).strip()
        if action_text:
            summary_parts.append(action_text)

    # Dialogue summary - convert to readable format
    if dialogue_exchanges:
        dialogue_narrative = []
        for speaker, dialogue in dialogue_exchanges:
            dialogue = re.sub(r'\b\d+\.\s*', '', dialogue)
            dialogue = re.sub(r'\s+', ' ', dialogue).strip()

            if dialogue and dialogue != '[pause]':
                if len(dialogue) > 250:
                    dialogue = dialogue[:247] + "..."
                dialogue_narrative.append(f'{speaker}: "{dialogue}"')
            elif dialogue == '[pause]':
                dialogue_narrative.append(f'{speaker} remains silent.')

        if dialogue_narrative:
            summary_parts.append(' '.join(dialogue_narrative))

    # Combine into prose
    full_summary = ' '.join(summary_parts)
    full_summary = re.sub(r'\s+', ' ', full_summary).strip()

    # Fallback if too short
    if len(full_summary) < 50 and text:
        clean_text = re.sub(r'\b\d+\.\s*', '', text)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        if len(clean_text) > 800:
            clean_text = clean_text[:797] + "..."
        full_summary = clean_text

    return full_summary


def main():
    print("Loading JSON...")
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Processing {len(data['scenes'])} scenes...")

    for scene in data['scenes']:
        detailed_summary = generate_clean_summary(scene)

        if 'plotSummary' not in scene:
            scene['plotSummary'] = {}
        scene['plotSummary']['detailed'] = detailed_summary
        scene['summary'] = detailed_summary

    print("Writing updated JSON...")
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("Done! Sample summaries:")
    for i in [1, 23, 98]:
        if i <= len(data['scenes']):
            summary = data['scenes'][i-1]['summary']
            print(f"\n--- Scene {i} ---")
            print(summary[:400] + "..." if len(summary) > 400 else summary)


if __name__ == '__main__':
    main()

