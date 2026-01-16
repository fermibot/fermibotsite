import json
import re

def split_script_by_scenes(input_file, output_file):
    # Read the text file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by INT. or EXT. (preserve the delimiter)
    pattern = r'((?:INT\.|EXT\.)[^\n]*)'
    parts = re.split(pattern, content)

    scenes = []
    scene_id = 1

    # Process pairs of (heading, content)
    for i in range(1, len(parts), 2):
        if i < len(parts):
            heading = parts[i].strip()
            text = parts[i + 1].strip() if i + 1 < len(parts) else ""

            if heading:  # Only add if heading exists
                scenes.append({
                    "id": scene_id,
                    "title": heading,
                    "text": text
                })
                scene_id += 1

    # Create output structure
    output = {
        "scenes": scenes,
        "totalScenes": len(scenes)
    }

    # Write to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Successfully split {len(scenes)} scenes and saved to {output_file}")
    print(f"First 5 scene titles:")
    for scene in scenes[:5]:
        print(f"  {scene['id']}: {scene['title']}")

# Usage
input_path = 'NeilBurger_2011_Limitless.txt'
output_path = 'NeilBurger_2011_Limitless_scenes.json'

split_script_by_scenes(input_path, output_path)

