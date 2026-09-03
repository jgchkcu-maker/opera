import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class SmartOrderingContractTests(unittest.TestCase):
    def test_every_builder_product_has_valid_plain_language_presets(self):
        probe = r"""
const builder=require('./assets/builder.js');
const smart=require('./assets/smart-ordering.js');
const out={missing:[],invalid:[],defaults:[],labels:[]};
for(const [key,product] of Object.entries(builder.PRODUCTS)){
  const presets=smart.recommendationsForProduct(key);
  if(!Array.isArray(presets)||presets.length<1){out.missing.push(key);continue;}
  const def=smart.defaultPresetForProduct(key);
  if(!def) out.defaults.push(key);
  for(const preset of presets){
    if(!preset.label||!preset.description) out.labels.push(`${key}:${preset.id||'unknown'}`);
    if(!smart.presetMatchesProduct(preset,product)) out.invalid.push(`${key}:${preset.id}`);
  }
}
console.log(JSON.stringify(out));
"""
        result = subprocess.run(
            ["node", "-e", probe],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads(result.stdout)
        self.assertEqual(data["missing"], [])
        self.assertEqual(data["invalid"], [])
        self.assertEqual(data["defaults"], [])
        self.assertEqual(data["labels"], [])

    def test_builder_ux_loads_smart_ordering_layer(self):
        ux = (ROOT / "assets/builder-ux.js").read_text(encoding="utf-8")
        self.assertIn("assets/smart-ordering.css", ux)
        self.assertIn("assets/smart-ordering.js", ux)
        self.assertIn("data-smart-ordering", ux)


if __name__ == "__main__":
    unittest.main()
