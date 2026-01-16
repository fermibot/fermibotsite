#!/usr/bin/env python3
"""
Enhanced scene analysis for Limitless - provides detailed summaries,
dialogue extraction, and thematic analysis by carefully reading each scene's text.
"""

import json
import re
from typing import Dict, List, Any, Tuple


class LimitlessSceneAnalyzer:
    """Analyzes Limitless screenplay scenes in detail."""

    def __init__(self):
        # Track story progression
        self.story_state = {
            'eddie_has_nzt': False,
            'vernon_dead': False,
            'with_van_loon': False,
            'gennady_threat': False,
            'lindy_relationship': 'together'
        }

    def analyze_detailed_summary(self, scene_id: int, title: str, text: str) -> Tuple[str, str, str]:
        """
        Generate detailed brief and detailed summaries plus subtext.
        Returns (brief, detailed, subtext)
        """
        text_lower = text.lower()

        # Key plot points extraction
        brief = ""
        detailed = ""
        subtext = ""

        # Scene-by-scene custom analysis for key scenes
        if scene_id == 1:
            brief = "Opening: Eddie's voiceover reveals he's in mortal danger"
            detailed = "In a flash-forward cold open, Eddie's voice reveals cryptically: 'They found me.' The film opens in media res with immediate tension."
            subtext = "Hooks the audience with mystery - who is Eddie? Who found him? Why is he in danger? The answer lies in the past."

        elif scene_id == 2:
            brief = "Armed men break into Eddie's luxury high-rise apartment"
            detailed = "Professional, determined people pound on Eddie's reinforced steel door with power tools. Despite half-billion dollar building security, they've gotten through. Eddie estimates he has five minutes."
            subtext = "Eddie has achieved massive wealth (luxury apartment) but it's brought deadly consequences. His success has made him a target."

        elif scene_id == 3:
            brief = "Eddie stands on his terrace ledge, about to jump as neighbor is killed"
            detailed = "Eddie stands on the exterior ledge of his 80-floor penthouse terrace, prepared to jump rather than be caught. Through adjoining windows, he sees his neighbor shot dead for opening his door. Eddie reflects bitterly on coming so close to 'becoming the perfect version of ourselves' and having an impact, only to end up impacting the sidewalk."
            subtext = "The entire film's central question: what does it mean to become perfect? Eddie achieved it and now faces death. Was it worth it? The film will flash back to answer."

        elif scene_id == 4:
            brief = "Flashback: Eddie as a struggling, out-of-shape writer eating falafel"
            detailed = "Contrast to the sleek future Eddie: messy hair, schlumy clothes, overweight with belly bulge, wearing a worn corduroy jacket. He's a writer who, two years after being fired from copywriting, bullshitted his way into a book contract."
            subtext = "The 'before' picture. Eddie is at rock bottom - physically, professionally, emotionally. This sets up the dramatic transformation to come."

        elif scene_id == 5:
            brief = "Eddie procrastinates instead of writing: computer games, TV, sleeping"
            detailed = "Quick cuts show Eddie's 'writer's life': playing computer Scrabble, sprawled watching TV with takeout, sleeping until noon, sitting on the toilet with Game Boy. His phone never rings. Bills pile up. He says he's 'gearing up' and 'getting psyched' but months pass without writing a word."
            subtext = "Eddie is paralyzed by self-doubt and lack of discipline. The book contract didn't magically grant him ability - he still can't access his potential. He needs external help (foreshadowing NZT)."

        elif scene_id == 6:
            brief = "Girlfriend Lindy breaks up with Eddie at coffee shop, returning his key"
            detailed = "Lindy, attractive and professionally dressed, sadly slides Eddie's apartment key across the counter. Eddie is blindsided. She tells him she knows what he does all day, knows 'the good stuff and the shit.' She sees where it's going: he'll lose his apartment, move in with her, she'll eventually boot him out, and he'll end up in his childhood bedroom in Newark. She admits she'd have had him move in anyway - if it was her he wanted, and not his ex-wife Melissa."
            subtext = "Lindy loves Eddie but can't watch him destroy himself. She's protecting herself from inevitable heartbreak. The Melissa revelation shows Eddie isn't even emotionally available - he's stuck in the past."

        elif scene_id == 7:
            brief = "Flash: Memory of Melissa (Eddie's ex-wife) bending seductively over him"
            detailed = "A brief, beautiful memory in Eddie's POV: a lovely, willowy brunette in an undershirt, intimate and seductive."
            subtext = "Melissa haunts Eddie. He's chasing a memory of perfection he once had, unable to move forward."

        elif scene_id == 8:
            brief = "Lindy got her promotion; she pays for coffee as Eddie can't afford it"
            detailed = "Lindy reveals she got the promotion - her own assistant now. Eddie is genuinely happy for her, saying she deserves it. She grabs the check, both knowing Eddie can't pay."
            subtext = "Lindy is moving up while Eddie spirals down. The gap between them is widening. Her paying symbolizes the power imbalance in their relationship."

        elif scene_id == 9:
            brief = "Eddie meets ex-brother-in-law Vernon on the street"
            detailed = "Walking home, eyeing homeless people and feeling his dismal future, Eddie (almost 35) reflects that 'no one talks about potential at 35.' Vernon Gant, his ex-brother-in-law from his marriage to Melissa, approaches with condescending bemusement. Vernon looks rich: expensive suit, clearly comes from money. He whacks Eddie's arms genially, comments on Eddie's weight gain ('pack it on, why don't you?'), and asks if he's still trying to write."
            subtext = "Vernon represents everything Eddie isn't: successful, wealthy, confident. This chance meeting will change Eddie's life - Vernon has access to NZT."

        elif scene_id == 10:
            brief = "Vernon invites Eddie for a beer; Eddie reluctantly agrees"
            detailed = "Vernon is surprised/impressed Eddie has a book contract. When Eddie asks if Vernon is still dealing drugs, Vernon smugly says 'Do I look like I'm still dealing?' Eddie sizes up the suit, shoes, watch, haircut and says 'No.' Vernon invites Eddie for a drink to hear about the book, and when Eddie declines, Vernon plucks his cigarette pack and holds it hostage until Eddie agrees."
            subtext = "Vernon's wealth came from somewhere - legitimate pharmaceutical consulting or illegal dealing? The answer will matter. Eddie's weakness (cigarette addiction) makes him manipulable."

        elif 'nzt' in text_lower or 'pill' in text_lower or 'tablet' in text_lower:
            if scene_id < 20:
                brief = "Vernon offers Eddie an experimental drug called NZT"
                detailed = text[:300] + "..." if len(text) > 300 else text
                subtext = "The inciting incident - Eddie is offered a shortcut to unlocking his potential."

        # Generic analysis based on content
        if not brief:
            # Extract from voiceover if present
            vo_match = re.search(r'EDDIE \(V\.O?\.\)\s+(.+?)(?:\n|$)', text, re.IGNORECASE)
            if vo_match:
                brief = vo_match.group(1).strip()[:100]
            else:
                # Use first action line
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                if lines:
                    brief = lines[0][:100]
                else:
                    brief = f"Scene {scene_id}: {title}"

        if not detailed:
            # Build from scene content
            detailed = self._extract_action_description(text)

        return brief, detailed, subtext

    def _extract_action_description(self, text: str) -> str:
        """Extract action/description lines (non-dialogue) from scene text."""
        lines = text.split('\n')
        action_lines = []

        skip_next = False
        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Skip character names (all caps) and parentheticals
            if line.isupper() and len(line.split()) <= 3:
                skip_next = True
                continue

            if line.startswith('(') and line.endswith(')'):
                continue

            # Skip dialogue lines (after character names)
            if skip_next:
                skip_next = False
                continue

            # This is likely action/description
            action_lines.append(line)

        return ' '.join(action_lines)[:500]  # Limit length

    def extract_enhanced_dialogue(self, text: str, scene_id: int) -> List[Dict[str, str]]:
        """
        Extract dialogue with better context and significance analysis.
        """
        dialogues = []
        lines = text.split('\n')

        current_speaker = None
        current_quote = []
        context_before = []

        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue

            # Character names (all caps, short)
            if line.isupper() and len(line.split()) <= 4:
                # Save previous dialogue
                if current_speaker and current_quote:
                    quote_text = ' '.join(current_quote).strip()
                    if len(quote_text) > 15:
                        significance = self._determine_dialogue_significance(
                            current_speaker, quote_text, scene_id
                        )
                        context = ' '.join(context_before[-2:]) if context_before else "During scene"

                        dialogues.append({
                            'speaker': current_speaker.replace('(V.O.)', '').replace('(V.0.)', '').replace('(CONT\'D)', '').strip(),
                            'quote': quote_text,
                            'significance': significance,
                            'context': context[:100]
                        })

                current_speaker = line
                current_quote = []

            elif current_speaker:
                # This is dialogue
                # Remove parentheticals but keep the dialogue
                if not (line.startswith('(') and line.endswith(')')):
                    cleaned = re.sub(r'\([^)]*\)', '', line)
                    if cleaned.strip():
                        current_quote.append(cleaned.strip())
            else:
                # Action/description - save as context
                context_before.append(line)
                if len(context_before) > 5:
                    context_before.pop(0)

        # Save last dialogue
        if current_speaker and current_quote:
            quote_text = ' '.join(current_quote).strip()
            if len(quote_text) > 15:
                significance = self._determine_dialogue_significance(
                    current_speaker, quote_text, scene_id
                )
                context = ' '.join(context_before[-2:]) if context_before else "During scene"

                dialogues.append({
                    'speaker': current_speaker.replace('(V.O.)', '').replace('(V.0.)', '').replace('(CONT\'D)', '').strip(),
                    'quote': quote_text,
                    'significance': significance,
                    'context': context[:100]
                })

        return dialogues

    def _determine_dialogue_significance(self, speaker: str, quote: str, scene_id: int) -> str:
        """Determine why this dialogue is significant."""
        quote_lower = quote.lower()
        speaker_clean = speaker.replace('(V.O.)', '').replace('(V.0.)', '').strip()

        # Key thematic dialogue
        if 'potential' in quote_lower or 'perfect version' in quote_lower:
            return "Central theme: human potential and transformation"

        if 'nzt' in quote_lower:
            return "Key plot device: the drug that changes everything"

        if 'brain' in quote_lower and ('percent' in quote_lower or '20' in quote_lower):
            return "The film's premise: unlocking full brain capacity"

        if 'melissa' in quote_lower and speaker_clean == 'LINDY':
            return "Reveals Eddie's emotional unavailability and past relationship"

        if 'book' in quote_lower and scene_id < 30:
            return "Eddie's failed writing career and creative block"

        if 'kill' in quote_lower or 'murder' in quote_lower or 'dead' in quote_lower:
            return "Escalating danger and violence"

        # Character development
        if speaker_clean == 'EDDIE' and scene_id < 20:
            return "Shows Eddie's initial state before NZT"
        elif speaker_clean == 'EDDIE' and 20 <= scene_id < 100:
            return "Eddie's transformation and growing confidence"
        elif speaker_clean == 'EDDIE' and scene_id >= 100:
            return "Eddie dealing with consequences of enhanced success"

        return "Character development and plot progression"

    def create_comprehensive_scene(self, original_scene: Dict, source_scene: Dict) -> Dict:
        """Combine automated analysis with enhanced analysis."""
        scene_id = original_scene['id']
        title = original_scene['title']
        text = original_scene['text']

        # Get enhanced summaries
        brief, detailed, subtext = self.analyze_detailed_summary(scene_id, title, text)

        # Get enhanced dialogue
        enhanced_dialogue = self.extract_enhanced_dialogue(text, scene_id)

        # Select most important dialogue (top 4)
        key_dialogue = enhanced_dialogue[:4]

        # Build comprehensive scene
        scene = source_scene.copy()
        scene['plotSummary']['brief'] = brief if brief else scene['plotSummary']['brief']
        scene['plotSummary']['detailed'] = detailed if detailed else scene['plotSummary']['detailed']
        scene['plotSummary']['subtext'] = subtext if subtext else scene['plotSummary']['subtext']
        scene['keyDialogue'] = key_dialogue if key_dialogue else scene['keyDialogue']

        # Enhance location description
        scene['location']['description'] = self._enhance_location(title, text)

        # Add significance
        scene['significance'] = self._determine_significance(scene_id, text)

        return scene

    def _enhance_location(self, title: str, text: str) -> str:
        """Generate better location description."""
        # Parse title for location info
        title_lower = title.lower()

        if 'apartment' in title_lower:
            if 'eddie' in text.lower()[:200]:
                return "Eddie's cramped, messy rent-controlled apartment on Avenue A"
            else:
                return "Apartment interior"

        if 'street' in title_lower or 'ext' in title_lower:
            if 'new york' in text.lower():
                return "New York City street"
            return "Exterior street scene"

        if 'bar' in title_lower:
            return "Bar interior, casual daytime drinking"

        if 'office' in title_lower:
            return "Professional office space"

        if 'bedroom' in title_lower:
            return "Bedroom interior, intimate setting"

        return "Scene location"

    def _determine_significance(self, scene_id: int, text: str) -> str:
        """Determine scene's narrative significance."""
        text_lower = text.lower()

        if scene_id == 1:
            return "Opens the film with mystery and tension, hooks audience"
        elif scene_id <= 5:
            return "Establishes Eddie's rock bottom before transformation"
        elif scene_id == 6:
            return "Lindy breakup is the final straw - Eddie has lost everything"
        elif 'nzt' in text_lower and scene_id < 20:
            return "Inciting incident - Eddie is offered the drug that will change his life"
        elif scene_id < 50:
            return "Act 1: Setup and Eddie's initial transformation"
        elif scene_id < 150:
            return "Act 2: Eddie's success escalates along with danger"
        else:
            return "Act 3: Crisis and resolution"


def main():
    print("🎬 Enhancing Limitless scene analysis...")
    print("=" * 60)

    # Load original scenes
    with open('NeilBurger_2011_Limitless_scenes.json', 'r') as f:
        original_data = json.load(f)

    # Load automated analysis
    with open('NeilBurger_2011_Limitless_scenes_analyzed.json', 'r') as f:
        analyzed_data = json.load(f)

    analyzer = LimitlessSceneAnalyzer()

    enhanced_scenes = []
    total = len(original_data['scenes'])

    for i, (original_scene, analyzed_scene) in enumerate(zip(original_data['scenes'], analyzed_data['scenes']), 1):
        if i % 20 == 0:
            print(f"   Enhanced {i}/{total} scenes...")

        enhanced = analyzer.create_comprehensive_scene(original_scene, analyzed_scene)
        enhanced_scenes.append(enhanced)

    # Create output
    output = {
        'metadata': analyzed_data['metadata'],
        'scenes': enhanced_scenes
    }

    # Save
    output_file = 'NeilBurger_2011_Limitless_scenes_enhanced.json'
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n✅ Enhancement complete!")
    print(f"💾 Saved to: {output_file}")
    print(f"\n📊 Enhanced {len(enhanced_scenes)} scenes with:")
    print("   - Detailed plot summaries with subtext")
    print("   - Key dialogue with significance analysis")
    print("   - Location descriptions")
    print("   - Scene significance annotations")
    print("\n⚠️  Note: First 10 scenes have manual detailed analysis.")
    print("   Remaining scenes have automated analysis.")
    print("   Manual enhancement recommended for key turning points.")


if __name__ == '__main__':
    main()
