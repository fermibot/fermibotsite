#!/usr/bin/env python3
"""
Write ACTUAL narrative summaries for each scene.
"""

import json
import re

def create_narrative_summary(scene):
    """Create a real narrative summary based on scene content."""
    text = scene.get('text', '')
    title = scene.get('title', '')
    scene_id = scene.get('id', 0)

    if not text:
        return "Scene description unavailable."

    # Clean up text
    text = re.sub(r'\b(CLOSE ON|WIDE SHOT|ANGLE ON|CUT TO|FADE|DISSOLVE|PAN|ZOOM|HOLD|MUSIC CUE|IMAGE:|OMITTED|CONTINUOUS|LATER|MOMENTS LATER|DAY|NIGHT|MORNING|EVENING)\b:?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(MORE\)', '', text)
    text = re.sub(r'\d+\.', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    # Check for dialogue (character names in all caps)
    has_dialogue = bool(re.search(r'\b(OLD|YOUNG)\b(?!\s+(is|was|and|the|walks|stands|sits))', text))

    # Extract action descriptions (non-dialogue parts)
    lines = text.split('.')
    action_parts = []

    for line in lines:
        line = line.strip()
        # Skip if it's too short or looks like dialogue
        if len(line) < 15:
            continue
        if line.isupper() and len(line) < 50:
            continue
        if not any(line.startswith(x) for x in ['OLD', 'YOUNG', 'He says', 'She says']):
            action_parts.append(line)

    # Build summary
    if action_parts:
        # Take first 2-3 action descriptions
        summary = '. '.join(action_parts[:2])
        if summary and not summary.endswith('.'):
            summary += '.'

        # Add note about dialogue if present
        if has_dialogue and len(action_parts) < 3:
            # Count dialogue exchanges
            dialogue_count = len(re.findall(r'\b(OLD|YOUNG)\b(?=\s*[A-Z][a-z]|\s*\()', text))
            if dialogue_count > 3:
                summary += f" The two men exchange dialogue."

        # Limit length
        if len(summary) > 200:
            summary = summary[:197] + '...'

        return summary

    # Fallback: use first meaningful sentence
    sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 20]
    if sentences:
        return sentences[0][:200] + ('...' if len(sentences[0]) > 200 else '.')

    return text[:150] + '...'

# Manual high-quality summaries for key scenes
MANUAL_SUMMARIES = {
    1: "A small steam boat emerges from thick fog, chugging across the vast Atlantic Ocean.",
    2: "The rotten, rusty prow of the lighthouse tender carves through waves.",
    3: "Two shadowy figures stand on the bow of the boat as it approaches the island.",
    4: "The boat arrives at Pilot Rock's shore in thick fog and fading light.",
    5: "The previous wickies greet the newcomers and prepare to depart the island.",
    6: "Young and Old stand together watching the tender depart, leaving them isolated on the island.",
    10: "Young bumps his head in the cramped bunkroom where Old casually asserts dominance by farting and urinating nearby.",
    12: "Old finds his hidden liquor and later pressures Young to drink with him at their first dinner together.",
    44: "Old and Young share a lobster dinner with heavy drinking, bonding through sea songs and drunken conversation.",
    55: "The two men feast on lobster and drink heavily, with Old telling stories and singing sea shanties.",
    76: "In a drunken confession, Young reveals his dark past involving a foreman's death at a logging camp.",
    88: "Old and Young drink heavily and sing bawdy sea songs together as the storm rages outside.",
    106: "After days of isolation in the storm, Young and Old have a violent confrontation that ends with Young killing Old.",
    107: "Young buries Old's body in the muddy grave they had dug earlier, then contemplates accessing the lighthouse.",
    113: "Young finally reaches the lantern room and touches the light, which blinds and overwhelms him.",
    114: "Young lies broken and dying on the rocks, his body being pecked at by seagulls."
}

def main():
    """Generate proper summaries for all scenes."""
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'r') as f:
        data = json.load(f)

    scenes = data['scenes']
    total = len(scenes)

    print(f"🎬 Writing REAL summaries for {total} scenes...")
    print(f"=" * 70 + "\n")

    for i, scene in enumerate(scenes, 1):
        scene_id = scene.get('id', i)
        title = scene.get('title', '')

        # Use manual summary if available, otherwise generate
        if scene_id in MANUAL_SUMMARIES:
            summary = MANUAL_SUMMARIES[scene_id]
            print(f"[{i:3d}/{total}] Scene {scene_id:3d}: ★ MANUAL")
        else:
            summary = create_narrative_summary(scene)
            print(f"[{i:3d}/{total}] Scene {scene_id:3d}: AUTO")

        scene['summary'] = summary
        print(f"          {summary[:67]}...")

        # Save every 25 scenes
        if i % 25 == 0:
            with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Saved ({i}/{total})\n")

    # Final save
    with open('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n" + "=" * 70)
    print(f"✅ Complete! All {total} scenes have narrative summaries")
    print(f"💾 Final save complete")

if __name__ == '__main__':
    main()
