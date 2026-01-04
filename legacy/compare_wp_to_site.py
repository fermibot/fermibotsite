import csv
import os
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
WP_CSV = ROOT / 'legacy' / 'wp_index.csv'

SITE_HTML = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    for name in filenames:
        if name.endswith('.html'):
            full = Path(dirpath) / name
            # store relative to project root
            rel = full.relative_to(ROOT)
            SITE_HTML.append(rel)


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip('-')


def main():
    # Load WP items
    wp_items = []
    with WP_CSV.open(encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            wp_items.append(row)

    # Build site slug index
    site_slug_index = {}
    for rel in SITE_HTML:
        name = rel.stem  # filename without .html
        slug = slugify(name)
        site_slug_index.setdefault(slug, []).append(str(rel))

    missing = []
    matched = []
    ambiguous = []

    for item in wp_items:
        slug = item['slug'] or slugify(item['title'])
        paths = site_slug_index.get(slug)
        if not paths:
            missing.append(item)
        elif len(paths) == 1:
            matched.append((item, paths[0]))
        else:
            ambiguous.append((item, paths))

    # Write a summary markdown file
    out_md = ROOT / 'legacy' / 'wordpress_migration_plan.md'
    with out_md.open('w', encoding='utf-8') as f:
        f.write('# WordPress → Static Site Migration Plan\n\n')
        f.write('Generated from wp_index.csv and current HTML files.\n\n')

        f.write('## 1. Pages to Transfer (not found in static site by slug)\n\n')
        for item in missing:
            f.write(f"- [ ] **{item['title']}**  "+
                    f"  Type: `{item['type']}`, slug: `{item['slug']}`, date: `{item['date']}`  "
                    f"  \\n  WordPress URL: {item['link']}\n")

        f.write('\n## 2. Already Matched (WordPress → HTML path)\n\n')
        for item, path in matched:
            f.write(f"- [x] **{item['title']}** → `{path}`  "+
                    f"  (slug: `{item['slug']}`, date: `{item['date']}`)\n")

        f.write('\n## 3. Ambiguous Matches (same slug, multiple HTML candidates)\n\n')
        for item, paths in ambiguous:
            f.write(f"- [ ] **{item['title']}** (slug: `{item['slug']}`) could map to:\n")
            for p in paths:
                f.write(f"  - `{p}`\n")
            f.write('\n')

    print(f"Wrote migration plan to {out_md}")


if __name__ == '__main__':
    main()

