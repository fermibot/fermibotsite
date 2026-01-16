# Limitless (2011) - Scene Analysis Summary

## Overview

This document summarizes the comprehensive scene-by-scene analysis of **Limitless** (2011, dir. Neil Burger), created to match the structure of The Shining visualization.

## Files Created

### Final Output
- **NeilBurger_2011_Limitless_scenes_analyzed_final.json** (358KB)
  - Complete analysis of all 187 scenes
  - Matches The Shining JSON structure
  - Ready for visualization

### Processing Scripts
1. **analyze_limitless_scenes.py** - Initial automated analysis
2. **enhance_scene_analysis.py** - Enhanced dialogue extraction and summaries
3. **create_final_comprehensive_json.py** - Final comprehensive structure with chapters and discussion questions

## JSON Structure

### Metadata
- Title, director, writer, year, runtime, genre
- 10 major themes: Cognitive Enhancement, Ambition, Addiction, Power, Consequences, Identity, Intelligence, Success, Danger, Transformation
- Total scenes: 187
- Analysis date: 2026-01-16

### Chapters (9 Sequences)
Following Eddie Morra's journey from failure to power:

1. **📉 Rock Bottom** (Scenes 1-14)
   - Eddie's life falling apart: writer's block, breakup, no prospects

2. **💊 The Pill** (Scenes 15-34)
   - Vernon offers NZT; Eddie experiences superhuman cognition

3. **⚡ Limitless** (Scenes 35-59)
   - Transformation: finishing book, learning languages, making money

4. **💀 Danger Emerges** (Scenes 60-79)
   - Vernon murdered; Eddie takes NZT stash; loan shark pursues

5. **💰 Wall Street** (Scenes 80-109)
   - Eddie enters high finance, impresses Carl Van Loon

6. **🔪 Closing In** (Scenes 110-139)
   - Gennady the Russian, Van Loon's suspicions, supply dwindling

7. **🤒 Withdrawal** (Scenes 140-159)
   - Eddie runs out of NZT, severe withdrawal, loses abilities

8. **⚠️ Crisis** (Scenes 160-174)
   - Desperate hunt for NZT, violent confrontations

9. **🎯 Resolution** (Scenes 175-187)
   - Eddie solves dependence problem, confronts Van Loon, seizes control

### Discussion Questions (10 Topics)

Book club style questions exploring themes:
- Ethics of cognitive enhancement vs. caffeine/vitamins
- Nature of the "perfect self"
- Whether Eddie earns his success or NZT steals his agency
- How enhancement affects relationships and identity
- Trust in pharmaceutical authority
- Information vs. knowledge vs. wisdom
- Social policy and human enhancement
- Cost of power and success

### Scene Structure

Each of 187 scenes includes:

- **id**: Scene number (1-187)
- **act**: Three-act structure (act1, act2, act3)
- **title**: Original screenplay scene heading
- **location**: Primary location and description
- **time**: Narrative timing information
- **plotSummary**:
  - brief: One-sentence summary
  - detailed: Comprehensive summary
  - subtext: Thematic/psychological subtext
- **keyDialogue**: Top 4 most important dialogue exchanges
  - quote: Dialogue text
  - speaker: Character name
  - significance: Why this dialogue matters
  - context: Scene context
- **characterDevelopment**: Character states and arcs
- **enhancementState**: Eddie's cognitive state
  - baseline: Normal, before/after NZT
  - enhanced: On NZT, superhuman cognition
  - withdrawal: Coming down, losing abilities
  - crisis: Desperate, severe consequences
- **tensionLevel**: 1-10 scale
- **significance**: Scene's narrative importance
- **foreshadowing**: Array of scene IDs this foreshadows
- **callbacks**: Array of scene IDs that foreshadowed this
- **tags**: Thematic/character tags for filtering
- **chapter**: Which chapter this scene belongs to
- **discussionQuestions**: Related discussion question IDs
- **screenplayPage**: Approximate page number

## Enhancement State Distribution

- **Baseline**: 26 scenes (Eddie normal/before NZT)
- **Enhanced**: 97 scenes (Eddie on NZT)
- **Withdrawal**: 46 scenes (Eddie losing abilities)
- **Crisis**: 18 scenes (Eddie desperate)

## Act Structure

- **Act 1** (Setup): 50 scenes
- **Act 2** (Confrontation): 100 scenes
- **Act 3** (Resolution): 37 scenes

## Key Characters Tracked

- **Eddie Morra**: Protagonist, struggling writer → cognitive superman
- **Lindy**: Eddie's girlfriend, leaves him → returns when he's enhanced
- **Vernon Gant**: Ex-brother-in-law, drug dealer, introduces NZT (murdered mid-film)
- **Carl Van Loon**: Wall Street titan, Eddie's mentor/antagonist
- **Gennady**: Russian loan shark, violent pursuer
- **Melissa**: Eddie's ex-wife, haunts his memories

## Major Themes

1. **Cognitive Enhancement**: The ethics and consequences of pharmaceutical intelligence enhancement
2. **Ambition vs. Authenticity**: Does Eddie abandon his writing dreams for Wall Street?
3. **Addiction**: NZT as both superpower and dependency
4. **Power & Control**: What you're willing to sacrifice for success
5. **Identity**: Does enhancement change who you fundamentally are?
6. **Potential**: What does it mean to become "the perfect version of ourselves"?

## Tags Used for Filtering

Character tags: eddie, lindy, vernon, van-loon, gennady, melissa

Thematic tags: nzt, intelligence, finance, danger, withdrawal, power, relationship, voiceover

## Analysis Quality

### Manually Detailed (High Quality)
- Scenes 1-10: Full manual analysis with detailed summaries, subtext, and significance

### Automated Analysis (Good Quality)
- Scenes 11-187: Automated extraction with pattern matching
- Dialogue parsed from screenplay text
- Tags and enhancement states assigned algorithmically
- Significance and character development templated by act

### Recommended Manual Enhancement

Key turning points that would benefit from manual review:
- Scene ~14: Vernon offers NZT (inciting incident)
- Scene ~25: Eddie first takes NZT
- Scene ~60: Vernon's death
- Scene ~100: Eddie at height of power
- Scene ~140: Withdrawal begins
- Scene ~187: Final resolution

## Next Steps

To use this data for visualization like The Shining:

1. Copy structure from The Shining HTML/CSS/JS
2. Update file references to Limitless JSON
3. Adjust color scheme (The Shining uses horror colors; Limitless could use blues/cyans for enhancement)
4. Update theme descriptions
5. Test chapter filtering
6. Add discussion question integration

## Notes

- Original source: NeilBurger_2011_Limitless_scenes.json (187 scenes with only "id", "title", "text" fields)
- All analysis derived from screenplay text field
- Dialogue extraction uses pattern matching on screenplay format
- Some dialogue may include stage directions (cleaned where possible)
- Enhancement state assignments use keywords and act position as heuristics
