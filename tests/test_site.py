import re
import unittest
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])


class SiteStructureTests(unittest.TestCase):
    def test_homepage_is_customer_decision_funnel(self):
        html = read("index.html")
        self.assertIn("Что хотите напечатать?", html)
        self.assertIn("Рассчитать заказ", html)
        self.assertIn("Выбрать продукцию", html)
        for slug in (
            "pechat-vizitok.html",
            "pechat-listovok.html",
            "pechat-katalogov.html",
            "pechat-meniu.html",
            "pechat-nakleek-i-stikerov.html",
            "proizvodstvo-kalendarei.html",
        ):
            self.assertIn(slug, html)
        for label in (
            "Реклама и раздача",
            "Презентация и офис",
            "Для кафе, магазинов и упаковки",
            "Книги и многостраничная печать",
            "Как проходит заказ",
        ):
            self.assertIn(label, html)

    def test_catalogue_uses_four_plain_language_groups(self):
        html = read("services.html")
        expected = (
            "Реклама и раздача",
            "Презентация и офис",
            "Для кафе, магазинов и упаковки",
            "Книги и многостраничная печать",
        )
        for label in expected:
            self.assertIn(f'data-filter="{label}"', html)
        for stale in (
            "Рекламная продукция",
            "Презентационная продукция",
            "В помощь бизнесу",
            "Многостраничные издания",
        ):
            self.assertNotIn(f'data-filter="{stale}"', html)

    def test_builder_has_exactly_four_customer_facing_stages(self):
        html = read("builder.html")
        headings = re.findall(r"<h3>(\d+\.[^<]+)</h3>", html)
        self.assertEqual(
            headings,
            [
                "1. Изделие",
                "2. Размер и тираж",
                "3. Материал и печать",
                "4. Отделка и итог",
            ],
        )
        self.assertIn("data-builder-next", html)
        self.assertIn("data-builder-back", html)
        self.assertIn("data-summary-toggle", html)

    def test_all_summary_triggers_are_bound(self):
        html = read("builder.html")
        ux = read("assets/builder-ux.js")
        self.assertGreaterEqual(html.count("data-summary-toggle"), 2)
        self.assertIn("querySelectorAll('[data-summary-toggle]')", ux)
        self.assertRegex(ux, r"summaryToggles\.forEach")

    def test_ci_runs_build_validator_before_regressions(self):
        workflow = read(".github/workflows/ci.yml")
        self.assertIn("python build_site.py", workflow)
        self.assertIn("python -m unittest tests.test_site -v", workflow)
        self.assertLess(workflow.index("python build_site.py"), workflow.index("python -m unittest tests.test_site -v"))

    def test_exact_source_image_mapping_is_explicit(self):
        app = read("assets/app.js")
        self.assertIn("pechat-knig-fotoknig-foto", app)
        self.assertIn("pechat-fotoalbomov", app)
        for idx in range(1, 16):
            self.assertIn(f"'{idx:02d}'", app)
        photoalbum = read("pechat-knig-fotoknig-foto.html")
        self.assertIn("https://www.operaprint.ru/data/pechat-fotoalbomov/01.jpg", photoalbum)

    def test_motion_is_finite_and_accessible(self):
        app = read("assets/app.js")
        css = read("assets/enhancements.css") + read("assets/styles.css")
        self.assertNotIn("initPointerGlow", app)
        self.assertNotIn("paperFloat", css)
        self.assertNotIn("cardFloat", css)
        self.assertIn("prefers-reduced-motion: reduce", css)
        self.assertIn("(hover:hover) and (pointer:fine)", css)

    def test_mobile_menu_has_escape_scroll_lock_and_resize_cleanup(self):
        app = read("assets/app.js")
        self.assertIn("Escape", app)
        self.assertIn("menu-open", app)
        self.assertIn("resize", app)

    def test_postpress_keeps_all_15_operations(self):
        html = read("postpress.html")
        self.assertEqual(len(re.findall(r'class="post-card"', html)), 15)
        for name in (
            "Листоподбор", "Фальцовка", "Биговка", "Навивка на пружину",
            "Сшивка на скрепку", "Твёрдый переплёт", "Мягкий переплёт",
            "Скрепление на болты", "Перфорация", "Фигурная / плоттерная резка",
            "Скругление углов", "Сверление отверстий", "Конгрев / тиснение",
            "Ламинирование", "Упаковка в термоплёнку",
        ):
            self.assertIn(name, html)

    def test_internal_html_links_resolve_and_critical_ids_are_unique(self):
        pages = list(ROOT.glob("*.html"))
        self.assertGreater(len(pages), 10)
        for page in pages:
            parser = LinkParser()
            parser.feed(page.read_text(encoding="utf-8"))
            for href in parser.links:
                target = href.split("#", 1)[0].split("?", 1)[0]
                if not target or target.startswith(("http:", "https:", "mailto:", "tel:", "#")):
                    continue
                if target.endswith(".html"):
                    self.assertTrue((ROOT / target).exists(), f"{page.name}: broken link {target}")
            duplicates = {item for item in parser.ids if parser.ids.count(item) > 1}
            self.assertFalse(duplicates, f"{page.name}: duplicate IDs {sorted(duplicates)}")


if __name__ == "__main__":
    unittest.main()
