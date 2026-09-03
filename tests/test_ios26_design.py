import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def public_pages():
    return sorted(ROOT.glob("*.html"))


class IOS26DesignTests(unittest.TestCase):
    def test_global_liquid_glass_tokens_and_fallbacks(self):
        css = read("assets/brand-v5.css")
        for marker in (
            "--glass-bg:",
            "--glass-elevated:",
            "--radius-xl:",
            "--motion-spring:",
            "@media (prefers-reduced-transparency:reduce)",
            "@media (prefers-reduced-motion:reduce)",
        ):
            self.assertIn(marker, css)

    def test_every_public_page_loads_final_design_before_first_paint(self):
        enhancement_link = 'href="assets/enhancements.css"'
        brand_link = 'href="assets/brand-v5.css"'
        for page in public_pages():
            html = page.read_text(encoding="utf-8")
            with self.subTest(page=page.name):
                self.assertIn(enhancement_link, html)
                self.assertIn(brand_link, html)
                self.assertLess(html.index(enhancement_link), html.index(brand_link))
                self.assertLess(html.index(brand_link), html.lower().index("</head>"))

    def test_source_navigation_copy_does_not_flash_old_order_wording(self):
        for page in public_pages():
            html = page.read_text(encoding="utf-8")
            with self.subTest(page=page.name):
                self.assertNotIn(">Собрать заказ<", html)

    def test_mobile_drawer_animates_without_display_switching(self):
        css = read("assets/brand-v5.css") + read("assets/enhancements.css")
        self.assertIn(".drawer{", css)
        self.assertIn("max-height:0", css)
        self.assertIn("visibility:hidden", css)
        self.assertIn("pointer-events:none", css)
        self.assertIn(".drawer.open", css)
        self.assertIn("max-height:560px", css)

    def test_menu_icon_is_drawn_consistently_instead_of_using_font_glyphs(self):
        css = read("assets/brand-v5.css")
        app = read("assets/app.js")
        self.assertIn(".menu-btn:before", css)
        self.assertIn(".menu-btn:after", css)
        self.assertIn('.menu-btn[aria-expanded="true"]', css)
        self.assertNotIn("btn.textContent=open?'×':'☰'", app)

    def test_catalogue_filter_scroller_and_empty_state_are_enhanced(self):
        app = read("assets/app.js")
        css = read("assets/brand-v5.css")
        self.assertIn("initFilterScroller", app)
        self.assertIn("filter-scroller", app)
        self.assertIn("catalogue-empty", app)
        self.assertIn("scroll-snap-type:x proximity", css)
        self.assertIn("overscroll-behavior-x:contain", css)

    def test_home_category_links_preserve_catalogue_context(self):
        home = read("index.html")
        app = read("assets/app.js")
        for slug in ("promo", "office", "retail", "books"):
            self.assertIn(f"services.html?category={slug}", home)
        self.assertIn("URLSearchParams", app)
        self.assertIn("categoryAliases", app)
        self.assertIn("params.get('category')", app)

    def test_mobile_filter_scroller_avoids_viewport_math_overflow(self):
        css = read("assets/brand-v5.css")
        self.assertNotIn("min(100vw", css)
        self.assertIn("width:calc(100% + 24px)", css)
        self.assertIn("margin-inline:-12px", css)

    def test_mobile_ambient_background_does_not_use_fixed_attachment(self):
        css = read("assets/brand-v5.css")
        self.assertIn("body{background-attachment:scroll}", css)

    def test_service_detail_noise_and_image_failure_are_handled(self):
        app = read("assets/app.js")
        css = read("assets/brand-v5.css")
        self.assertIn("upgradeServiceDetails", app)
        self.assertIn("service-guidance", app)
        self.assertIn(".service-photo.image-error", css)
        self.assertIn("Фото временно недоступно", css)

    def test_detail_image_is_recreated_if_inline_error_removed_it_early(self):
        app = read("assets/app.js")
        self.assertIn("detailWrap", app)
        self.assertIn("detailWrap.querySelector('img')", app)
        self.assertIn("doc.createElement('img')", app)
        self.assertIn("detailWrap.appendChild", app)

    def test_builder_sheet_supports_drag_dismiss_and_modal_stacks_above_it(self):
        ux = read("assets/builder-ux.js")
        css = read("assets/builder-pro-v4.css")
        self.assertIn("bindSummaryDrag", ux)
        self.assertIn("sheet-dragging", ux)
        self.assertIn("dragStartY", ux)
        self.assertIn("dragDistance", ux)
        self.assertIn("z-index:111", css)
        self.assertIn("z-index:110", css)
        self.assertIn("z-index:140", css)
        self.assertIn(".summary::before", css)

    def test_builder_drag_release_has_explicit_snap_and_dismiss_states(self):
        ux = read("assets/builder-ux.js")
        css = read("assets/builder-pro-v4.css")
        self.assertIn("summary-snap-back", ux)
        self.assertIn("summary-drag-dismiss", ux)
        self.assertIn(".summary.summary-snap-back", css)
        self.assertIn(".summary.summary-drag-dismiss", css)
        self.assertIn("requestAnimationFrame", ux)

    def test_all_buttons_share_tactile_press_feedback(self):
        css = read("assets/brand-v5.css")
        self.assertIn(":where(button,.btn,.navcta", css)
        self.assertIn("transform:scale(.975)", css)
        self.assertIn(":disabled", css)

    def test_ios_motion_is_functional_not_infinite(self):
        css = read("assets/brand-v5.css") + read("assets/builder-pro-v4.css")
        self.assertNotIn("animation-iteration-count:infinite", css)
        self.assertNotIn("animation:infinite", css)
        self.assertIn("scale(.975)", css)
        self.assertIn("cubic-bezier(.22,.86,.3,1.08)", css)


if __name__ == "__main__":
    unittest.main()
