# Opera-print North Star smart ordering design

Date: 2026-09-03

## Goal

A customer who does not understand printing terminology should be able to configure a sensible request without knowing paper names, density in g/m², or print-side notation such as 4+4.

## Customer flow

1. Choose a familiar product name.
2. Choose size and quantity.
3. Choose a plain-language result preset such as “Стандартный”, “Премиальный”, “Для раздачи”, or “Бумажные наклейки”.
4. The preset applies material, density, and print-side values automatically.
5. Technical controls remain available under “Настроить вручную”, but are not required for a normal customer.
6. The summary continues to contain the exact technical values for the manager.

## UX rules

- Present outcome language before printing terminology.
- Mark one preset as the recommended starting point for each product.
- Explain that recommendations are a starting configuration and the manager verifies production suitability, price, and timing.
- Preserve the existing four-stage builder and validation/state model.
- Do not remove any technical controls or manager-facing output fields.
- A manual change should clear the visual preset selection if it no longer matches a preset.
- Product changes must refresh presets and apply the new product’s recommended default.
- URL product preselection remains supported.
- Keyboard controls, mobile layout, reduced-motion behavior, and existing summary/modal behavior must continue to work.

## Architecture

Add a small UMD module `assets/smart-ordering.js`. It owns product-to-preset definitions, validates presets against `OperaBuilder.PRODUCTS`, applies a preset to the existing DOM controls, and progressively wraps the existing material/printing controls under a manual-settings disclosure. `assets/builder-ux.js` loads this module after the base builder is ready. Styling lives in `assets/smart-ordering.css`.

The existing `assets/builder.js` remains the source of truth for allowed technical values, validation, summary, and manager text. This minimizes regression risk.

## Acceptance criteria

- Every product in `OperaBuilder.PRODUCTS` has at least one valid plain-language preset.
- Every default preset references only values allowed by that product.
- Stage 3 shows plain-language presets before material/density/side controls.
- Existing technical controls are available through a manual disclosure.
- Selecting a preset changes the real existing controls and therefore the existing summary/manager output.
- Selecting another product refreshes and applies the relevant recommended default.
- CI tests validate preset completeness and compatibility with `OperaBuilder.PRODUCTS`.
