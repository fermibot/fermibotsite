#!/usr/bin/env python3
"""
Generate semantic embeddings for How to Talk to Anyone techniques
Uses Sentence Transformers for free, high-quality embeddings
"""

import json
import sys

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Error: sentence-transformers not installed")
    print("Install with: pip install sentence-transformers")
    sys.exit(1)

def generate_embeddings(input_file, output_file):
    """Generate embeddings and add to JSON file"""

    print("Loading Sentence Transformer model...")
    # Using all-MiniLM-L6-v2: fast, lightweight, good quality
    # Produces 384-dimensional embeddings
    model = SentenceTransformer('all-MiniLM-L6-v2')

    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Generating embeddings for {len(data)} techniques...")

    # Extract title + summary for embedding (better semantic understanding)
    texts = []
    for item in data:
        # Get title (clean it from the name field)
        name = item.get('name', '')
        # Extract just the title part (e.g., "01 The Flooding Smile" from "main.chapter_name.01 The Flooding Smile")
        if 'chapter_name.' in name or 'section_name.' in name:
            title = name.split('.')[-1].strip()
        else:
            title = name

        # Get summary/description
        summary = item.get('summary', '')

        # Combine title and summary for richer semantic understanding
        combined_text = f"{title}. {summary}" if summary else title
        texts.append(combined_text)

    print(f"Sample text for embedding: {texts[0][:150]}...")  # Show first sample

    # Generate all embeddings in one batch (much faster)
    embeddings = model.encode(texts, show_progress_bar=True)

    # Add embeddings to each item
    for i, item in enumerate(data):
        # Convert numpy array to list for JSON serialization
        item['embedding'] = embeddings[i].tolist()

    print(f"Writing to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent='\t', ensure_ascii=False)

    print("✓ Done! Embeddings added to JSON file")
    print(f"  Total items: {len(data)}")
    print(f"  Embedding dimensions: {len(embeddings[0])}")
    print(f"  File size increase: ~{len(data) * len(embeddings[0]) * 8 / 1024:.1f} KB")

if __name__ == '__main__':
    input_file = 'LifeSkills_HowToTalkToAnyone.json'
    output_file = 'LifeSkills_HowToTalkToAnyone.json'

    generate_embeddings(input_file, output_file)
