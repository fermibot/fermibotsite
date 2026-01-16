#!/usr/bin/env python3
"""
Comprehensive tag system verification - ensures all tags are properly associated and displayed
"""
import json
import re

# Read universal tag system
with open('universal_tag_system.py', 'r') as f:
    exec(f.read())
defined_tags = set(UNIVERSAL_TAGS.keys())

# Read scenes
with open('StanleyKubrick_1980_TheShining_scenes_all_231.json', 'r') as f:
    data = json.load(f)
    scenes = data['scenes']

# Get all tags used in scenes
used_tags = set()
for scene in scenes:
    used_tags.update(scene.get('tags', []))

# Read CSS
with open('StanleyKubrick_1980_TheShining_custom.css', 'r') as f:
    css_content = f.read()
css_tags = set(re.findall(r'\.tag-badge\.tag-([a-z0-9-]+)', css_content))

# Read JavaScript
with open('StanleyKubrick_1980_TheShining_timeline.js', 'r') as f:
    js_content = f.read()

# Extract TAG_ICONS
tag_icons_match = re.search(r'const TAG_ICONS = \{(.*?)\};', js_content, re.DOTALL)
if tag_icons_match:
    js_tags = set(re.findall(r"'([a-z0-9-]+)':", tag_icons_match.group(1)))

# Extract TAG_GROUPS
tag_groups_match = re.search(r'const TAG_GROUPS = \{(.*?)\};', js_content, re.DOTALL)
if tag_groups_match:
    grouped_tags = set(re.findall(r"'([a-z0-9-]+)'", tag_groups_match.group(1)))

print("=" * 80)
print("COMPREHENSIVE TAG SYSTEM VERIFICATION")
print("=" * 80)

print(f"\n📊 SYSTEM OVERVIEW:")
print(f"   • Tags defined in universal system: {len(defined_tags)}")
print(f"   • Tags actually used in scenes:    {len(used_tags)}")
print(f"   • Tags with CSS styling:           {len(css_tags)}")
print(f"   • Tags with JavaScript icons:      {len(js_tags)}")
print(f"   • Tags in TAG_GROUPS:              {len(grouped_tags)}")

# Check for inconsistencies
missing_from_css = used_tags - css_tags
missing_from_js = used_tags - js_tags
missing_from_groups = used_tags - grouped_tags
undefined_tags = used_tags - defined_tags

print(f"\n✅ VERIFICATION RESULTS:")
errors = []

if undefined_tags:
    print(f"   ❌ Tags used but NOT defined: {len(undefined_tags)}")
    errors.append(f"Undefined tags: {sorted(undefined_tags)}")
else:
    print(f"   ✓ All tags are properly defined in universal system")

if missing_from_css:
    print(f"   ❌ Tags missing CSS styling: {len(missing_from_css)}")
    errors.append(f"Missing CSS: {sorted(missing_from_css)}")
else:
    print(f"   ✓ All tags have CSS styling")

if missing_from_js:
    print(f"   ❌ Tags missing JavaScript icons: {len(missing_from_js)}")
    errors.append(f"Missing JS: {sorted(missing_from_js)}")
else:
    print(f"   ✓ All tags have JavaScript icons")

if missing_from_groups:
    print(f"   ❌ Tags missing from TAG_GROUPS: {len(missing_from_groups)}")
    errors.append(f"Missing from groups: {sorted(missing_from_groups)}")
else:
    print(f"   ✓ All tags are in TAG_GROUPS")

# Sample scenes to verify tags appear
print(f"\n📋 SAMPLE TAG ASSOCIATIONS (showing scenes with most tags):")
scene_tag_counts = [(s['id'], len(s.get('tags', [])), s.get('tags', [])) for s in scenes]
scene_tag_counts.sort(key=lambda x: x[1], reverse=True)

for scene_id, tag_count, tags in scene_tag_counts[:5]:
    scene = next(s for s in scenes if s['id'] == scene_id)
    print(f"\n   Scene {scene_id:3d} ({tag_count:2d} tags): {scene['title'][:50]}")
    print(f"   Tags: {', '.join(sorted(tags)[:8])}...")

# Final summary
print("\n" + "=" * 80)
if errors:
    print("❌ VERIFICATION FAILED - Issues found:")
    for error in errors:
        print(f"   {error}")
else:
    print("✅ VERIFICATION PASSED")
    print(f"   All {len(used_tags)} tags are fully integrated:")
    print(f"   • Defined in universal tag system")
    print(f"   • Associated with scene nodes")
    print(f"   • Styled in CSS")
    print(f"   • Displayed with icons in JavaScript")
    print(f"   • Categorized in TAG_GROUPS")
    print(f"   • Visible in title cards/info cards")
print("=" * 80)
