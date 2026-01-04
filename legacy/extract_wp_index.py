import xml.etree.ElementTree as ET
import csv
from pathlib import Path

# Paths
ROOT = Path(__file__).resolve().parent
XML_PATH = ROOT / "fermibot.wordpress.com.2026-01-04.000.xml"
OUT_CSV = ROOT / "wp_index.csv"

# WordPress XML uses namespaces
NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'dc': 'http://purl.org/dc/elements/1.1/'
}


def main():
    print(f"Parsing {XML_PATH} ...")
    tree = ET.parse(XML_PATH)
    root = tree.getroot()

    channel = root.find('channel')
    items = channel.findall('item') if channel is not None else []

    rows = []
    for item in items:
        # Basic fields
        title_el = item.find('title')
        title = title_el.text.strip() if title_el is not None and title_el.text else ''

        link_el = item.find('link')
        link = link_el.text.strip() if link_el is not None and link_el.text else ''

        # Namespaced fields
        post_type_el = item.find('wp:post_type', NS)
        post_type = post_type_el.text.strip() if post_type_el is not None and post_type_el.text else ''

        status_el = item.find('wp:status', NS)
        status = status_el.text.strip() if status_el is not None and status_el.text else ''

        post_name_el = item.find('wp:post_name', NS)
        slug = post_name_el.text.strip() if post_name_el is not None and post_name_el.text else ''

        post_date_el = item.find('wp:post_date', NS)
        post_date = post_date_el.text.strip() if post_date_el is not None and post_date_el.text else ''

        if post_type not in {"post", "page"}:
            continue
        if status != "publish":
            continue

        rows.append({
            'type': post_type,
            'title': title,
            'slug': slug,
            'link': link,
            'date': post_date,
        })

    rows.sort(key=lambda r: (r['type'], r['date'], r['title']))

    print(f"Writing index to {OUT_CSV} ({len(rows)} items)...")
    with OUT_CSV.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['type', 'title', 'slug', 'link', 'date'])
        writer.writeheader()
        writer.writerows(rows)

    print("Done.")


if __name__ == "__main__":
    main()

