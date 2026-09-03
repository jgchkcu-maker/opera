import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


class ProfessionalBuilderPolishTests(unittest.TestCase):
    def test_builder_loads_professional_polish_after_product_picker(self):
        ux = read("assets/builder-ux.js")
        self.assertIn("assets/builder-pro-v4.css", ux)
        self.assertIn("assets/builder-pro-v4.js", ux)
        self.assertIn("pickerScript.addEventListener('load',loadProfessionalPolish", ux)
        self.assertIn("existingPickerScript.addEventListener('load',loadProfessionalPolish", ux)

    def test_builder_preloads_picker_and_polish_without_flash(self):
        html = read("builder.html")
        self.assertIn('href="assets/product-picker-v3.css"', html)
        self.assertIn('href="assets/builder-pro-v4.css"', html)
        self.assertIn('src="assets/product-picker-v3.js"', html)
        self.assertIn('src="assets/builder-pro-v4.js"', html)
        self.assertLess(html.index('src="assets/product-picker-v3.js"'), html.index('src="assets/builder-pro-v4.js"'))
        self.assertLess(html.index('src="assets/builder-pro-v4.js"'), html.index('src="assets/builder-ux.js"'))

    def test_mobile_step_label_sits_outside_progress_grid(self):
        js = read("assets/builder-pro-v4.js")
        self.assertIn("progress[0].parentElement?.before(mobileLabel)", js)
        self.assertNotIn("insertBefore(mobileLabel,progress[0].parentElement.firstChild)", js)

    def test_mobile_intro_is_task_first_and_removes_redundant_copy(self):
        js = read("assets/builder-pro-v4.js")
        css = read("assets/builder-pro-v4.css")
        self.assertIn("Рассчитать заказ", js)
        self.assertIn("Заполните только то, что знаете", js)
        self.assertIn(".builder-hero .breadcrumb", css)
        self.assertIn(".builder-hero .eyebrow", css)
        self.assertIn("display:none", css)
        self.assertIn("builder-mobile-step-label", js)

    def test_catalog_is_a_compact_disclosure_not_a_second_form(self):
        js = read("assets/builder-pro-v4.js")
        css = read("assets/builder-pro-v4.css")
        self.assertIn("Не нашли нужное?", js)
        self.assertIn("Открыть весь каталог", js)
        self.assertIn("product-picker-search .sr-only", css)
        self.assertIn("product-picker-row", css)
        self.assertIn("max-height", css)

    def test_finishing_options_are_compact_clear_multiselect_rows(self):
        js = read("assets/builder-pro-v4.js")
        css = read("assets/builder-pro-v4.css")
        self.assertIn("Можно выбрать несколько", js)
        self.assertIn("builder-finish-block", js)
        self.assertIn(".builder-finish-block .finish", css)
        self.assertIn(".builder-finish-block .finish::after", css)
        self.assertIn(".builder-finish-block .finish.checked::after", css)
        self.assertIn(".builder-finish-block .glyph", css)
        self.assertIn("display:none", css)

    def test_mobile_action_is_glass_floating_and_safe_area_aware(self):
        css = read("assets/builder-pro-v4.css")
        for marker in (
            ".builder-mobile-action",
            "backdrop-filter",
            "env(safe-area-inset-bottom)",
            ".mobile-next::after",
            "linear-gradient",
            "pointer-events:none",
        ):
            self.assertIn(marker, css)

    def test_global_palette_uses_logo_colors_as_primary_accents(self):
        css = read("assets/brand-v5.css")
        app = read("assets/app.js")
        self.assertIn("--red:#c13b78", css)
        self.assertIn("--cyan:#1595a8", css)
        self.assertIn("--magenta:#c13b78", css)
        self.assertIn("backdrop-filter:blur(22px) saturate(1.15)", css)
        self.assertIn("assets/brand-v5.css", app)

    def test_dual_logo_colors_are_visible_in_real_interactive_states(self):
        css = read("assets/brand-v5.css")
        for marker in (
            "--cyan-soft:#e5f4f6",
            ".navlinks a:hover,.navlinks a.active",
            ".customer-hero-notes span:before",
            ".builder-progress button.active i",
            ".product-picker-option.is-selected",
            ".builder-finish-block .finish.checked",
            ".builder-mobile-action .mobile-next",
            "var(--cyan)",
            "var(--magenta)",
        ):
            self.assertIn(marker, css)


if __name__ == "__main__":
    unittest.main()
