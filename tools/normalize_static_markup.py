from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

CATEGORY_ROUTES = {
    "01": "promo",
    "02": "office",
    "03": "retail",
    "04": "books",
}

changed = []
for path in sorted(ROOT.glob("*.html")):
    original = path.read_text(encoding="utf-8")
    text = original.replace(">Собрать заказ<", ">Рассчитать заказ<")
    text = text.replace(' onerror="this.remove()"', "")
    text = re.sub(
        r'(<button\b[^>]*\bdata-menu\b[^>]*>)\s*[☰×]\s*(</button>)',
        r"\1\2",
        text,
    )
    if path.name == "index.html":
        for number, slug in CATEGORY_ROUTES.items():
            before = f'<a class="category-card" href="services.html"><div class="num">{number}</div>'
            after = f'<a class="category-card" href="services.html?category={slug}"><div class="num">{number}</div>'
            text = text.replace(before, after)
    if text != original:
        path.write_text(text, encoding="utf-8")
        changed.append(path.name)

print(f"Normalized {len(changed)} HTML files.")
for name in changed:
    print(name)
