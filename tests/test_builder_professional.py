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


if __name__ == "__main__":
    unittest.main()
