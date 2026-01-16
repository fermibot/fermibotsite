#!/usr/bin/env python3
"""
Integrate discussion questions into the scenes JSON
"""
import json

# Load questions
with open('discussion_questions_new.json', 'r') as f:
    questions_data = json.load(f)
    questions = questions_data['discussionQuestions']

# Load scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

# Add discussion questions to each scene based on tags and key scenes
for scene in scenes:
    scene['discussionQuestions'] = []
    scene_tags = set(scene.get('tags', []))

    for q in questions:
        # Check if scene is in keyScenes OR has overlapping tags
        is_key_scene = scene['id'] in q['keyScenes']
        related_tags = set(q['relatedTags'])
        has_related_tags = len(scene_tags & related_tags) > 0

        if is_key_scene or has_related_tags:
            scene['discussionQuestions'].append({
                'id': q['id'],
                'question': q['question'],
                'category': q['category'],
                'relevance': 'key' if is_key_scene else 'related'
            })

# Add questions to metadata
data['metadata']['discussionQuestions'] = questions

# Write updated scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✅ Integration complete!")
print(f"   Added questions metadata")
print(f"   Linked questions to {len(scenes)} scenes")

# Show sample
scene_50 = next(s for s in scenes if s['id'] == 50)
print(f"\nSample - Scene 50 now has {len(scene_50['discussionQuestions'])} related questions:")
for q in scene_50['discussionQuestions'][:3]:
    print(f"  Q{q['id']}: {q['question'][:60]}... ({q['relevance']})")
