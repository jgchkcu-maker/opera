const test = require('node:test');
const assert = require('node:assert/strict');
const picker = require('../assets/product-picker-v3.js');

const PRODUCT_KEYS = [
  'businessCards','leaflets','posters','postcards','certificates','booklets','catalogs',
  'forms','folders','notepads','menus','tags','stickers','books','calendars'
];

test('every builder product has consistent UI metadata and an SVG icon', () => {
  for (const key of PRODUCT_KEYS) {
    assert.ok(picker.PRODUCT_UI[key], `missing UI metadata for ${key}`);
    assert.ok(picker.PRODUCT_UI[key].description.length >= 12, `description too short for ${key}`);
    const icon = picker.iconSvg(key);
    assert.match(icon, /^<svg\b/);
    assert.match(icon, /viewBox="0 0 48 48"/);
  }
});

test('catalog search understands normal client wording and aliases', () => {
  assert.deepEqual(picker.filterProductKeys('сертификат'), ['certificates']);
  assert.deepEqual(picker.filterProductKeys('конверт'), ['forms']);
  assert.deepEqual(picker.filterProductKeys('стикер'), ['stickers']);
  assert.deepEqual(picker.filterProductKeys('фотоальбом'), ['books']);
});

test('featured products are unique and all exist in the unified catalog', () => {
  assert.equal(new Set(picker.FEATURED_KEYS).size, picker.FEATURED_KEYS.length);
  for (const key of picker.FEATURED_KEYS) assert.ok(PRODUCT_KEYS.includes(key));
});
