#!/usr/bin/env python3
"""
Create final comprehensive Limitless JSON matching The Shining structure.

Includes:
- Complete scene analysis
- Discussion questions
- Chapters/sequences
- Character tracking
- Thematic connections
"""

import json
import re
from typing import Dict, List, Any


# Discussion Questions (book club style)
DISCUSSION_QUESTIONS = [
    {
        'id': 1,
        'question': 'Is using NZT fundamentally different from using caffeine, vitamins, or other cognitive enhancers we use daily?',
        'category': 'Ethics',
        'relatedScenes': [14, 20, 25],  # Vernon offers NZT, Eddie takes it, first effects
        'theme': 'What defines cheating vs. legitimate enhancement?'
    },
    {
        'id': 2,
        'question': 'Eddie says he came close to "becoming the perfect version of ourselves." Is there such a thing as a perfect self?',
        'category': 'Identity',
        'relatedScenes': [3, 180, 187],  # Opening meditation, transformation complete
        'theme': 'The nature of human potential and perfection'
    },
    {
        'id': 3,
        'question': 'Does Eddie earn his success, or does NZT steal his agency and accomplishments?',
        'category': 'Merit',
        'relatedScenes': [30, 50, 100],  # Early success, financial wins, power plays
        'theme': 'What makes an achievement meaningful?'
    },
    {
        'id': 4,
        'question': 'Lindy leaves Eddie because he wants Melissa, not her. Does NZT change who Eddie truly loves?',
        'category': 'Relationships',
        'relatedScenes': [6, 40, 120],  # Breakup, Melissa memories, Lindy returns
        'theme': 'Does enhanced intelligence change emotional connections?'
    },
    {
        'id': 5,
        'question': 'Vernon says the drug is "FDA approved and coming on-stream next year." Does that make it safe or ethical to use?',
        'category': 'Ethics',
        'relatedScenes': [14, 60],  # Vernon\'s pitch, consequences emerge
        'theme': 'Trust in authority and pharmaceutical industry'
    },
    {
        'id': 6,
        'question': 'Is Eddie\'s transformation an enhancement of his existing self, or does NZT create a new person?',
        'category': 'Identity',
        'relatedScenes': [4, 25, 100, 187],  # Before/after contrasts
        'theme': 'Continuity of self under radical enhancement'
    },
    {
        'id': 7,
        'question': 'The film shows Eddie\'s success in finance, but we never see him write his book. What does this say about his true ambitions?',
        'category': 'Ambition',
        'relatedScenes': [5, 50, 100],  # Writer\'s block, abandons writing, financial success
        'theme': 'Do we pursue what we say we want, or what we really want?'
    },
    {
        'id': 8,
        'question': 'Carl Van Loon tells Eddie "Information is not knowledge." What\'s the difference, and does NZT provide both?',
        'category': 'Intelligence',
        'relatedScenes': [70, 90],  # Van Loon meetings
        'theme': 'Data vs. wisdom vs. intelligence'
    },
    {
        'id': 9,
        'question': 'Should cognitive enhancement be a human right, a regulated privilege, or prohibited entirely?',
        'category': 'Society',
        'relatedScenes': [14, 150, 187],  # Introduction to NZT, widespread use, ending
        'theme': 'Social policy and human enhancement'
    },
    {
        'id': 10,
        'question': 'Eddie solves his NZT dependence problem, but is his final state actually better than being unenhanced?',
        'category': 'Consequences',
        'relatedScenes': [187],  # Ending
        'theme': 'What are we willing to sacrifice for power?'
    }
]


# Chapters/Sequences for Limitless
CHAPTERS = {
    'ch01-rock-bottom': {
        'name': '📉 Rock Bottom',
        'description': "Eddie's life is falling apart: writer's block, breakup, no prospects",
        'scenes': list(range(1, 15)),
        'color': '#5D4037',
        'icon': '📉'
    },
    'ch02-nzt-discovery': {
        'name': '💊 The Pill',
        'description': "Vernon offers NZT; Eddie takes it and experiences superhuman cognition",
        'scenes': list(range(15, 35)),
        'color': '#1976D2',
        'icon': '💊'
    },
    'ch03-transformation': {
        'name': '⚡ Limitless',
        'description': "Eddie transforms: finishing book, learning languages, making money",
        'scenes': list(range(35, 60)),
        'color': '#00BCD4',
        'icon': '⚡'
    },
    'ch04-vernon-dies': {
        'name': '💀 Danger Emerges',
        'description': "Vernon is murdered; Eddie takes his NZT stash; loan shark pursues",
        'scenes': list(range(60, 80)),
        'color': '#8B0000',
        'icon': '💀'
    },
    'ch05-wall-street': {
        'name': '💰 Wall Street',
        'description': "Eddie enters high finance, impresses Carl Van Loon, trades successfully",
        'scenes': list(range(80, 110)),
        'color': '#388E3C',
        'icon': '💰'
    },
    'ch06-threats': {
        'name': '🔪 Closing In',
        'description': "Gennady the Russian, Van Loon's suspicions, Eddie's supply dwindling",
        'scenes': list(range(110, 140)),
        'color': '#C62828',
        'icon': '🔪'
    },
    'ch07-withdrawal': {
        'name': '🤒 Withdrawal',
        'description': "Eddie runs out of NZT, experiences severe withdrawal, loses abilities",
        'scenes': list(range(140, 160)),
        'color': '#9C27B0',
        'icon': '🤒'
    },
    'ch08-crisis': {
        'name': '⚠️ Crisis',
        'description': "Desperate hunt for NZT, violent confrontations, everything at stake",
        'scenes': list(range(160, 175)),
        'color': '#F44336',
        'icon': '⚠️'
    },
    'ch09-resolution': {
        'name': '🎯 Resolution',
        'description': "Eddie solves his dependence problem, confronts Van Loon, seizes control",
        'scenes': list(range(175, 188)),
        'color': '#4CAF50',
        'icon': '🎯'
    }
}


def fix_dialogue_parsing(text: str) -> List[Dict[str, str]]:
    """
    Improved dialogue extraction that correctly identifies speakers.
    """
    dialogues = []
    lines = text.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Look for character names (all caps, usually short, not description)
        # Valid speakers: EDDIE, LINDY, VERNON, etc.
        # Invalid: "THE ADJOINING TERRACE", "30's, lean and stylish"
        if line.isupper() and 2 <= len(line) <= 30:
            # Check if it looks like a person's name, not a description
            words = line.split()

            # Filter out common non-speaker patterns
            if any(word in line for word in ['INT.', 'EXT.', 'CUT', 'FADE', 'DISSOLVE', 'THE']):
                i += 1
                continue

            # Common speaker names
            speaker_match = False
            for name in ['EDDIE', 'LINDY', 'VERNON', 'VERN', 'MELISSA', 'CARL', 'VAN LOON',
                         'GENNADY', 'ATWOOD', 'HANK', 'MORRIS']:
                if name in line:
                    speaker_match = True
                    break

            if not speaker_match and len(words) > 3:
                # Probably not a speaker
                i += 1
                continue

            # This looks like a speaker
            speaker = line.replace('(V.O.)', '').replace('(V.0.)', '').replace('(CONT\'D)', '').strip()

            # Collect dialogue lines
            dialogue_lines = []
            i += 1

            while i < len(lines):
                dialogue_line = lines[i].strip()

                # Stop if we hit another speaker or scene heading
                if dialogue_line.isupper() or dialogue_line.startswith('INT.') or dialogue_line.startswith('EXT.'):
                    break

                # Skip empty lines
                if not dialogue_line:
                    i += 1
                    continue

                # Skip pure parentheticals (stage direction)
                if dialogue_line.startswith('(') and dialogue_line.endswith(')'):
                    i += 1
                    continue

                # This is dialogue - add it
                cleaned = re.sub(r'\([^)]*\)', '', dialogue_line)
                if cleaned.strip():
                    dialogue_lines.append(cleaned.strip())

                i += 1

            # Save this dialogue
            if dialogue_lines:
                quote = ' '.join(dialogue_lines)
                if len(quote) > 20:  # Minimum length
                    dialogues.append({
                        'speaker': speaker,
                        'quote': quote
                    })
        else:
            i += 1

    return dialogues


def create_comprehensive_scenes(original_scenes: List[Dict], enhanced_scenes: List[Dict]) -> List[Dict]:
    """
    Create final comprehensive scenes with fixed dialogue and better analysis.
    """
    comprehensive = []

    for original, enhanced in zip(original_scenes, enhanced_scenes):
        scene_id = original['id']
        text = original['text']

        # Fix dialogue parsing
        better_dialogue = fix_dialogue_parsing(text)

        # Take top 4 most substantial dialogue exchanges
        key_dialogue = []
        for d in better_dialogue[:4]:
            key_dialogue.append({
                'quote': d['quote'][:500],  # Limit length
                'speaker': d['speaker'],
                'significance': determine_significance(d['speaker'], d['quote'], scene_id),
                'context': f'Scene {scene_id}'
            })

        # Use enhanced scene as base
        scene = enhanced.copy()
        scene['keyDialogue'] = key_dialogue

        # Add chapter
        scene['chapter'] = determine_chapter(scene_id)

        # Add discussion questions if relevant
        scene['discussionQuestions'] = [q['id'] for q in DISCUSSION_QUESTIONS if scene_id in q['relatedScenes']]

        comprehensive.append(scene)

    return comprehensive


def determine_significance(speaker: str, quote: str, scene_id: int) -> str:
    """Better significance determination."""
    quote_lower = quote.lower()

    if 'perfect version' in quote_lower:
        return "Film's central theme: what does it mean to be perfect?"
    if 'nzt' in quote_lower:
        return "Key plot device: the cognitive enhancement drug"
    if '20 percent' in quote_lower or 'brain' in quote_lower and 'access' in quote_lower:
        return "The film's premise about unlocking brain potential"
    if 'melissa' in quote_lower and speaker == 'LINDY':
        return "Reveals Eddie's emotional unavailability"
    if 'book' in quote_lower and scene_id < 30:
        return "Eddie's creative block and failed ambitions"
    if speaker == 'EDDIE' and scene_id < 20:
        return "Eddie at rock bottom before NZT"
    if speaker == 'EDDIE' and 20 <= scene_id < 100:
        return "Eddie's enhanced transformation"
    if speaker == 'VERNON' or speaker == 'VERN':
        return "Vernon as catalyst for Eddie's journey"

    return "Character and plot development"


def determine_chapter(scene_id: int) -> str:
    """Determine which chapter a scene belongs to."""
    for chapter_id, chapter_data in CHAPTERS.items():
        if scene_id in chapter_data['scenes']:
            return chapter_id
    return 'ch09-resolution'  # Default for scenes beyond 187


def main():
    print("🎬 Creating final comprehensive Limitless JSON...")
    print("=" * 60)

    # Load files
    with open('NeilBurger_2011_Limitless_scenes.json', 'r') as f:
        original = json.load(f)

    with open('NeilBurger_2011_Limitless_scenes_enhanced.json', 'r') as f:
        enhanced = json.load(f)

    # Create comprehensive scenes
    print("📊 Processing all scenes with improved dialogue extraction...")
    comprehensive_scenes = create_comprehensive_scenes(original['scenes'], enhanced['scenes'])

    # Build final output
    output = {
        'metadata': enhanced['metadata'],
        'chapters': CHAPTERS,
        'discussionQuestions': DISCUSSION_QUESTIONS,
        'scenes': comprehensive_scenes
    }

    # Save final JSON
    final_file = 'NeilBurger_2011_Limitless_scenes_comprehensive.json'
    with open(final_file, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n✅ Final comprehensive JSON created!")
    print(f"💾 Saved to: {final_file}")
    print(f"\n📈 Contents:")
    print(f"   Total scenes: {len(comprehensive_scenes)}")
    print(f"   Chapters: {len(CHAPTERS)}")
    print(f"   Discussion questions: {len(DISCUSSION_QUESTIONS)}")
    print(f"\n🎭 Chapter breakdown:")
    for chapter_id, chapter_data in CHAPTERS.items():
        scene_count = len(chapter_data['scenes'])
        print(f"   {chapter_data['icon']} {chapter_data['name']}: {scene_count} scenes")

    print(f"\n✨ This JSON now matches The Shining structure and is ready for visualization!")


if __name__ == '__main__':
    main()
