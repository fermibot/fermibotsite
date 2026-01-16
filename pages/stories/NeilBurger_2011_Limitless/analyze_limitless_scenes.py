#!/usr/bin/env python3
"""
Analyze Limitless screenplay scenes and create comprehensive JSON structure
similar to The Shining format.

This script processes all 187 scenes from NeilBurger_2011_Limitless_scenes.json
and generates detailed analysis including:
- Scene summaries (brief, detailed, subtext)
- Key dialogue with speakers and significance
- Character development tracking
- Enhancement state (baseline/enhanced/withdrawal/crisis)
- Thematic elements
- Act structure
- Tags and connections
"""

import json
import re
from typing import Dict, List, Any

def extract_dialogue(text: str) -> List[Dict[str, str]]:
    """
    Extract dialogue from screenplay text.
    Returns list of {speaker, quote, context} dicts.
    """
    dialogues = []
    lines = text.split('\n')

    current_speaker = None
    current_quote = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Character names are typically ALL CAPS at start of line
        # Look for patterns like "EDDIE", "LINDY", "VERNON", etc.
        if line.isupper() and len(line.split()) <= 3:
            # Save previous dialogue if exists
            if current_speaker and current_quote:
                quote_text = ' '.join(current_quote).strip()
                if len(quote_text) > 10:  # Only keep substantial dialogue
                    dialogues.append({
                        'speaker': current_speaker,
                        'quote': quote_text
                    })

            current_speaker = line
            current_quote = []
        elif current_speaker:
            # This is dialogue text
            # Skip parentheticals like (CONT'D), (V.O.), stage directions
            if not (line.startswith('(') and line.endswith(')')):
                # Remove inline parentheticals
                cleaned = re.sub(r'\([^)]*\)', '', line)
                if cleaned.strip():
                    current_quote.append(cleaned.strip())

    # Save last dialogue
    if current_speaker and current_quote:
        quote_text = ' '.join(current_quote).strip()
        if len(quote_text) > 10:
            dialogues.append({
                'speaker': current_speaker,
                'quote': quote_text
            })

    return dialogues


def determine_act(scene_id: int) -> str:
    """
    Determine which act a scene belongs to (3-act structure).

    Act 1 (Setup): Scenes 1-50 - Eddie's failure, meeting NZT, initial success
    Act 2 (Confrontation): Scenes 51-150 - Power, danger, addiction, escalation
    Act 3 (Resolution): Scenes 151-187 - Crisis, showdown, resolution
    """
    if scene_id <= 50:
        return "act1"
    elif scene_id <= 150:
        return "act2"
    else:
        return "act3"


def determine_enhancement_state(scene_id: int, text: str) -> str:
    """
    Determine Eddie's cognitive enhancement state in this scene.

    States:
    - baseline: Normal Eddie, before NZT or when it wears off
    - enhanced: On NZT, superhuman cognition
    - withdrawal: Coming down, losing abilities
    - crisis: Desperate, running out, severe consequences
    """
    text_lower = text.lower()

    # Early scenes before NZT
    if scene_id < 20:
        return "baseline"

    # Look for keywords
    if any(word in text_lower for word in ['enhanced', 'sharp', 'clear', 'brilliant', 'perfect']):
        return "enhanced"
    elif any(word in text_lower for word in ['withdrawal', 'sick', 'shaking', 'pain', 'headache']):
        return "withdrawal"
    elif any(word in text_lower for word in ['crisis', 'desperate', 'running out', 'dying']):
        return "crisis"

    # Default patterns by act
    if scene_id < 30:
        return "baseline"
    elif scene_id < 130:
        return "enhanced"
    elif scene_id < 170:
        return "withdrawal"
    else:
        return "crisis"


def extract_tags(text: str, scene_id: int) -> List[str]:
    """
    Extract thematic tags from scene text.
    """
    tags = []
    text_lower = text.lower()

    # Character tags
    if 'eddie' in text_lower:
        tags.append('eddie')
    if 'lindy' in text_lower:
        tags.append('lindy')
    if 'vernon' in text_lower or 'vern' in text_lower:
        tags.append('vernon')
    if 'van loon' in text_lower or 'carl' in text_lower:
        tags.append('van-loon')
    if 'gennady' in text_lower or 'russian' in text_lower:
        tags.append('gennady')
    if 'melissa' in text_lower:
        tags.append('melissa')

    # Thematic tags
    if any(word in text_lower for word in ['nzt', 'pill', 'drug', 'tablet']):
        tags.append('nzt')
    if any(word in text_lower for word in ['smart', 'genius', 'brilliant', 'intelligence']):
        tags.append('intelligence')
    if any(word in text_lower for word in ['money', 'stock', 'market', 'trading', 'deal']):
        tags.append('finance')
    if any(word in text_lower for word in ['danger', 'threat', 'violence', 'kill', 'murder']):
        tags.append('danger')
    if any(word in text_lower for word in ['withdrawal', 'sick', 'pain', 'symptoms']):
        tags.append('withdrawal')
    if any(word in text_lower for word in ['power', 'control', 'influence']):
        tags.append('power')
    if any(word in text_lower for word in ['relationship', 'love', 'girlfriend']):
        tags.append('relationship')
    if 'v.o.' in text_lower or 'voiceover' in text_lower:
        tags.append('voiceover')

    return list(set(tags))  # Remove duplicates


def analyze_scene(scene: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze a single scene and return comprehensive structure.
    """
    scene_id = scene['id']
    title = scene['title']
    text = scene['text']

    # Extract dialogue
    dialogues = extract_dialogue(text)

    # Determine properties
    act = determine_act(scene_id)
    enhancement_state = determine_enhancement_state(scene_id, text)
    tags = extract_tags(text, scene_id)

    # Build comprehensive scene object
    analyzed_scene = {
        'id': scene_id,
        'act': act,
        'title': title,
        'location': {
            'primary': extract_location(title),
            'description': ''  # To be filled manually or with more analysis
        },
        'time': {
            'narrative': '',  # To be filled
            'approximate': f'Scene {scene_id}'
        },
        'plotSummary': {
            'brief': generate_brief_summary(text, scene_id),
            'detailed': generate_detailed_summary(text, scene_id, dialogues),
            'subtext': ''  # To be filled with thematic analysis
        },
        'keyDialogue': format_key_dialogue(dialogues[:3]),  # Top 3 most important
        'characterDevelopment': extract_character_development(text, scene_id),
        'enhancementState': enhancement_state,
        'tensionLevel': estimate_tension(text, scene_id),
        'significance': '',  # To be filled
        'foreshadowing': [],  # To be filled later
        'callbacks': [],  # To be filled later
        'tags': tags,
        'screenplayPage': scene_id  # Approximate
    }

    return analyzed_scene


def extract_location(title: str) -> str:
    """Extract location from scene title."""
    # Scene titles typically start with INT. or EXT. followed by location
    # Examples: "INT. EDDIE'S APARTMENT", "EXT. NEW YORK STREET"

    title = title.replace('INT.', '').replace('EXT.', '').strip()
    title = title.replace('- DAY', '').replace('- NIGHT', '').strip()

    return title if title else "Unknown Location"


def generate_brief_summary(text: str, scene_id: int) -> str:
    """Generate a brief one-sentence summary."""
    # This is a simplified version - ideally would use AI/LLM for better summaries

    text_lower = text.lower()

    # Pattern matching for key scenes
    if scene_id == 1:
        return "Eddie narrates from the future as armed men break into his luxury apartment"
    elif scene_id <= 10:
        if 'lindy' in text_lower and 'key' in text_lower:
            return "Lindy breaks up with Eddie at a coffee shop, returning her key"
        elif 'vernon' in text_lower or 'vern' in text_lower:
            return "Eddie encounters his ex-brother-in-law Vernon on the street"

    # Generic based on content
    if 'v.o.' in text_lower or 'voiceover' in text_lower:
        return "Eddie's voiceover narration"

    return f"Scene {scene_id}"


def generate_detailed_summary(text: str, scene_id: int, dialogues: List[Dict]) -> str:
    """Generate detailed summary from text and dialogue."""
    # Simplified version - would ideally use AI for comprehensive analysis

    summary_parts = []

    # Include key dialogue
    if dialogues:
        speakers = set(d['speaker'] for d in dialogues)
        summary_parts.append(f"Characters present: {', '.join(speakers)}")

    # Describe action
    if len(text) > 200:
        summary_parts.append("Extended scene with significant action and dialogue.")

    return ' '.join(summary_parts) if summary_parts else "Scene requires detailed analysis."


def format_key_dialogue(dialogues: List[Dict]) -> List[Dict[str, str]]:
    """Format dialogue for the key dialogue section."""
    formatted = []

    for d in dialogues:
        formatted.append({
            'quote': d['quote'],
            'speaker': d['speaker'],
            'significance': 'Key dialogue for character development',
            'context': 'During scene'
        })

    return formatted


def extract_character_development(text: str, scene_id: int) -> Dict[str, Dict[str, str]]:
    """Extract character development insights."""
    characters = {}
    text_lower = text.lower()

    # Eddie (protagonist)
    if 'eddie' in text_lower or scene_id >= 1:
        if scene_id < 20:
            characters['Eddie'] = {
                'state': 'Struggling writer, depressed, overweight, blocked',
                'arc': 'At rock bottom before discovering NZT'
            }
        elif scene_id < 50:
            characters['Eddie'] = {
                'state': 'Discovering enhanced abilities',
                'arc': 'Transformation from failure to success'
            }
        elif scene_id < 150:
            characters['Eddie'] = {
                'state': 'Enhanced but facing consequences',
                'arc': 'Managing power and danger'
            }
        else:
            characters['Eddie'] = {
                'state': 'In crisis, seeking resolution',
                'arc': 'Final confrontation and resolution'
            }

    # Other characters
    if 'lindy' in text_lower:
        characters['Lindy'] = {
            'state': 'Eddie\'s girlfriend/ex-girlfriend',
            'arc': 'Relationship dynamics'
        }

    if 'vernon' in text_lower or 'vern' in text_lower:
        characters['Vernon'] = {
            'state': 'Ex-brother-in-law, drug dealer',
            'arc': 'Introduces NZT to Eddie'
        }

    return characters


def estimate_tension(text: str, scene_id: int) -> int:
    """Estimate tension level 1-10."""
    text_lower = text.lower()

    tension = 3  # Base tension

    # Increase for action/danger words
    if any(word in text_lower for word in ['kill', 'murder', 'gun', 'shot', 'blood', 'dead']):
        tension += 4
    elif any(word in text_lower for word in ['threat', 'danger', 'chase', 'running']):
        tension += 3
    elif any(word in text_lower for word in ['crisis', 'desperate', 'panic']):
        tension += 2

    # Act 3 is generally higher tension
    if scene_id > 150:
        tension += 2

    return min(10, tension)


def create_metadata() -> Dict[str, Any]:
    """Create metadata section for the JSON."""
    return {
        'title': 'Limitless',
        'director': 'Neil Burger',
        'writer': 'Leslie Dixon (based on novel "The Dark Fields" by Alan Glynn)',
        'year': 2011,
        'runtime': '105 minutes',
        'genre': 'Sci-Fi Thriller',
        'themes': [
            'Cognitive Enhancement',
            'Ambition',
            'Addiction',
            'Power',
            'Consequences',
            'Identity',
            'Intelligence',
            'Success',
            'Danger',
            'Transformation'
        ],
        'totalScenes': 187,
        'analysisDate': '2026-01-16'
    }


def main():
    """Main processing function."""
    print("🎬 Analyzing Limitless screenplay scenes...")
    print("=" * 60)

    # Load original JSON
    with open('NeilBurger_2011_Limitless_scenes.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    print(f"📊 Total scenes to analyze: {len(scenes)}")

    # Analyze each scene
    analyzed_scenes = []
    for i, scene in enumerate(scenes, 1):
        if i % 20 == 0:
            print(f"   Processed {i}/{len(scenes)} scenes...")

        analyzed_scene = analyze_scene(scene)
        analyzed_scenes.append(analyzed_scene)

    # Create output structure
    output = {
        'metadata': create_metadata(),
        'scenes': analyzed_scenes
    }

    # Save to new file
    output_file = 'NeilBurger_2011_Limitless_scenes_analyzed.json'
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n✅ Analysis complete!")
    print(f"💾 Saved to: {output_file}")
    print(f"\n📈 Statistics:")
    print(f"   Total scenes: {len(analyzed_scenes)}")
    print(f"   Act 1 scenes: {sum(1 for s in analyzed_scenes if s['act'] == 'act1')}")
    print(f"   Act 2 scenes: {sum(1 for s in analyzed_scenes if s['act'] == 'act2')}")
    print(f"   Act 3 scenes: {sum(1 for s in analyzed_scenes if s['act'] == 'act3')}")
    print(f"\n🧠 Enhancement States:")
    states = {}
    for scene in analyzed_scenes:
        state = scene['enhancementState']
        states[state] = states.get(state, 0) + 1
    for state, count in sorted(states.items()):
        print(f"   {state}: {count} scenes")

    print("\n⚠️  Note: This is an automated first pass.")
    print("   Manual review and enhancement recommended for:")
    print("   - Detailed plot summaries and subtext")
    print("   - Scene significance and thematic analysis")
    print("   - Foreshadowing and callback connections")
    print("   - Location descriptions")
    print("   - Discussion questions")


if __name__ == '__main__':
    main()
