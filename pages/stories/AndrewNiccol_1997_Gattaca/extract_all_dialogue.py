#!/usr/bin/env python3
"""
Extract ALL dialogue from Gattaca scenes and update the analyzed JSON.
This will replace the limited keyDialogue with comprehensive dialogue extraction.
"""

import json
import re

def clean_text(text):
    """Clean OCR artifacts from text"""
    if not text:
        return ""
    # Replace common OCR errors
    text = text.replace('~', '-').replace('I:', ':').replace('II', 'H')
    return text.strip()

def extract_all_dialogue(text):
    """
    Extract ALL dialogue from screenplay text.
    Looks for lines where character names are in ALL CAPS followed by dialogue.
    """
    if not text:
        return []

    dialogue_entries = []
    lines = text.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Check if line is a character name (ALL CAPS, possibly with (V.O.), (O.S.), etc.)
        # Must be mostly uppercase letters
        if line and len(line) > 1 and len(line) < 50:  # Character names aren't too long
            # Remove parentheticals like (V.O.), (O.S.), (CONT'D)
            clean_name = re.sub(r'\([^)]*\)', '', line).strip()

            # Check if it's mostly uppercase (character name indicator)
            if clean_name and len(clean_name) >= 2:
                uppercase_count = sum(1 for c in clean_name if c.isupper())
                letter_count = sum(1 for c in clean_name if c.isalpha())

                if letter_count > 0 and uppercase_count / letter_count > 0.8:
                    # This looks like a character name
                    speaker = clean_name

                    # Collect dialogue lines that follow (until we hit another character or blank lines)
                    dialogue_lines = []
                    i += 1

                    while i < len(lines):
                        next_line = lines[i].strip()

                        # Stop if we hit an empty line or another character name
                        if not next_line:
                            i += 1
                            break

                        # Stop if this looks like another character name (ALL CAPS)
                        next_clean = re.sub(r'\([^)]*\)', '', next_line).strip()
                        if next_clean and len(next_clean) < 50:
                            next_uppercase = sum(1 for c in next_clean if c.isupper())
                            next_letters = sum(1 for c in next_clean if c.isalpha())
                            if next_letters > 0 and next_uppercase / next_letters > 0.8:
                                # This is another character name, don't consume it
                                break

                        # Stop if this looks like a scene header (INT., EXT., etc.)
                        if next_line.startswith(('INT.', 'EXT.', 'INT ', 'EXT ', 'FADE', 'CUT')):
                            break

                        # Skip parentheticals (stage directions in dialogue)
                        if next_line.startswith('(') and next_line.endswith(')'):
                            i += 1
                            continue

                        # Add this dialogue line
                        dialogue_lines.append(next_line)
                        i += 1

                    # If we collected dialogue, add it
                    if dialogue_lines:
                        quote = ' '.join(dialogue_lines)
                        quote = clean_text(quote)

                        # Skip if quote is too short or looks like stage direction
                        if len(quote) > 3 and not quote.startswith('[') and not quote.startswith('('):
                            dialogue_entries.append({
                                "speaker": speaker,
                                "quote": quote
                            })
                    continue

        i += 1

    return dialogue_entries

def normalize_character_name(name):
    """Normalize character names for consistency"""
    name = name.upper().strip()

    # Common name variations
    name_map = {
        'VINCENT': 'VINCENT',
        'JEROME': 'JEROME',
        'EUGENE': 'JEROME',  # Same person
        'IRENE': 'IRENE',
        'ANTON': 'ANTON',
        'DETECTIVE HUGO': 'DETECTIVE HUGO',
        'HUGO': 'DETECTIVE HUGO',
        'DIRECTOR JOSEF': 'DIRECTOR JOSEF',
        'JOSEF': 'DIRECTOR JOSEF',
        'LAMAR': 'LAMAR',
        'GENETICIST': 'GENETICIST',
        'MARIE': 'MARIE',
        'ANTONIO': 'ANTONIO',
        'CAESAR': 'CAESAR',
        'GERMAN': 'GERMAN',
    }

    return name_map.get(name, name)

# Load the analyzed JSON
print("Loading Gattaca analyzed scenes JSON...")
with open('AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Found {len(data['scenes'])} scenes to process")

# Extract all dialogue for each scene
total_dialogue = 0
scenes_with_dialogue = 0

for scene in data['scenes']:
    scene_text = scene.get('text', '')

    # Extract all dialogue
    all_dialogue = extract_all_dialogue(scene_text)

    # Normalize character names
    for dialogue in all_dialogue:
        dialogue['speaker'] = normalize_character_name(dialogue['speaker'])

    # Update the scene
    scene['keyDialogue'] = all_dialogue

    if all_dialogue:
        scenes_with_dialogue += 1
        total_dialogue += len(all_dialogue)
        print(f"Scene {scene['id']}: {len(all_dialogue)} dialogue entries")

print(f"\n✓ Extracted {total_dialogue} total dialogue entries")
print(f"✓ {scenes_with_dialogue} scenes have dialogue")

# Save updated JSON
output_file = 'AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json'
print(f"\nSaving to {output_file}...")
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✓ Complete! All dialogue has been extracted.")
