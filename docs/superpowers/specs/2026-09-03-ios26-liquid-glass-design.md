# Opera-print iOS 26 / Liquid Glass redesign

Date: 2026-09-03
Repository: `jgchkcu-maker/opera`
Branch: `ios26-liquid-glass-system`

## Goal

Turn the whole customer-facing Opera-print prototype into one coherent iOS 26-inspired interface while preserving the project North Star: a normal print-shop customer must be able to understand the service, choose a product, configure a sensible request and send it without needing printing expertise.

The redesign must improve perceived quality without sacrificing clarity, accessibility, responsiveness or the existing four-step ordering logic.

## Current-state findings

The customer path is already structurally sound: homepage -> catalogue -> service detail -> calculator -> summary -> mail handoff. The current problems are systemic rather than isolated.

1. Styling is split across several generations: `styles.css`, `enhancements.css`, `brand-v5.css`, plus `builder-v2.css`, `product-picker-v3.css`, `builder-pro-v4.css` and `smart-ordering.css`. Some layers are injected by JavaScript, which makes ownership unclear and creates override risk.
2. Mobile drawer animation is undermined by the base `display:none/display:grid` behavior, so opacity/transform transitions cannot produce a natural open/close motion.
3. Radius, shadow, surface, selected-state and pressed-state rules differ by component family.
4. The builder modal uses a lower stacking level than some mobile fixed controls, allowing fixed controls to visually compete with the modal.
5. Mobile catalogue filters wrap into a tall block rather than behaving like a compact horizontally scrollable selection surface.
6. Builder summary behaves like a sheet visually but lacks a natural drag-down dismissal gesture.
7. Service-detail feature cards repeat the same explanatory sentence, creating noise instead of decision support.
8. Image error treatment is inconsistent; detail images can disappear without a stable visual fallback.
9. Existing cyan/magenta brand accents are useful, but their roles are not fully systematic across navigation, selection, focus and completion states.

## Design direction

Use Liquid Glass as a functional interface layer, not as a universal decoration.

### Content layer

- Warm neutral page background with subtle cyan/magenta ambient gradients.
- Product photography and readable content remain visually dominant.
- Cards use translucent or near-solid surfaces with fine borders and soft depth; heavy blur is reserved for overlays and navigation.
- Typography stays system-first (`-apple-system`, BlinkMacSystemFont, Segoe UI, sans-serif) with compact negative tracking for large headings.

### Functional glass layer

Use stronger glass treatment for:

- sticky header / mobile menu surface;
- floating mobile builder controls;
- builder summary sheet;
- modal dialog;
- hero image overlay;
- compact filter/selection chrome where transparency helps hierarchy.

Do not apply strong blur to every content card.

## Design tokens

Global visual roles are standardized through the existing `brand-v5.css` final global layer instead of introducing another arbitrary stylesheet generation.

Required token groups:

- surfaces: page, solid card, glass, elevated glass, dark glass;
- borders: subtle, strong, focus;
- radii: 12, 16, 20, 24, 30, 36 px plus pill;
- shadows: card, elevated, floating, modal;
- motion: fast 160-180 ms, standard 240-280 ms, spring 380-460 ms;
- brand roles: cyan = navigation/context/focus, magenta = selected/confirmation/accent;
- stacking: header < floating builder controls < sheet/backdrop < modal.

## Interaction system

All interactive controls must have consistent states:

- default;
- hover only on hover-capable devices;
- active press with small scale compression;
- focus-visible with cyan ring;
- selected/checked using restrained cyan/magenta emphasis;
- disabled with reduced opacity but preserved legibility.

Press motion uses scale around 0.975 and never shifts surrounding layout.

`prefers-reduced-motion: reduce` disables transform/animation-based motion. `prefers-reduced-transparency: reduce` replaces blurred surfaces with opaque equivalents.

## Header and mobile menu

Desktop:

- sticky translucent header with high blur/saturation and a thin highlight edge;
- navigation stays compact and readable;
- primary order CTA is dark glass / high-contrast, not bright decorative glass.

Mobile:

- menu button is a 44+ px circular glass control;
- drawer must remain in the render tree and animate max-height/opacity/transform instead of toggling display;
- body scroll locks while open;
- Escape closes and returns focus;
- resizing back to desktop cleans up mobile state.

## Homepage

The existing decision funnel remains.

- Hero uses a cleaner large type scale and restrained ambient background.
- Hero image panel becomes a true glass overlay with stronger contrast and compact CTA.
- Product intent cards use 26-30 px outer radii, consistent image clipping and subtle depth.
- Category, trust and order-step surfaces share the same radius/shadow system.
- Dark CTA sections use elevated dark surfaces with restrained brand glow at edges, not broad saturated gradients.

## Catalogue

Desktop:

- search and category controls remain immediately visible;
- selected filter has clear contextual state;
- service cards share the same glass-card system and image ratio.

Mobile:

- search remains full width;
- category buttons are dynamically grouped into a horizontally scrollable `.filter-scroller` with momentum scrolling and scroll snap;
- no multiline chip wall;
- count remains a quiet secondary line;
- empty results get a clear visual empty state through application code.

## Service detail pages

- Keep the existing product photo + information layout.
- Give product photo a stable error fallback instead of collapsing.
- Collapse repetitive feature helper copy: the feature labels remain, and one concise shared guidance note explains that uncertain parameters can be left for manager confirmation.
- CTA copy remains consistently `Рассчитать заказ` across navigation and service pages.

## Builder

The four visible steps remain unchanged:

1. Изделие
2. Размер и тираж
3. Материал и печать
4. Отделка и итог

Smart ordering presets remain the default plain-language path; technical controls stay under progressive disclosure.

### Desktop builder

- Form stages become elevated light surfaces with consistent 24-30 px geometry.
- Progress is a compact segmented path with clear active/completed states.
- Summary is a light elevated glass card with no nested visual clutter.

### Mobile builder

- One stage at a time.
- Floating action cluster remains fixed above safe-area inset.
- Buttons get the same press language as the global system.
- Summary is a bottom sheet with a visible handle, spring open/close and drag-down dismissal.
- Drag dismissal only starts when the sheet is at scrollTop 0 and movement is downward, so scrolling sheet content remains usable.
- Modal must stack above both sheet and floating controls.

## Motion

Allowed motion is functional and finite:

- page section reveal once;
- card lift/image scale on hover-capable devices;
- button press feedback;
- menu open/close;
- builder stage forward/back transition;
- progress state pop;
- sheet spring open/close and drag interaction;
- modal fade/scale.

No infinite floating, pointer-following glow or continuously animated gradients.

## Accessibility and robustness

- Effective touch targets are at least 44 px for primary mobile controls.
- Focus-visible states remain obvious on every interactive family.
- Hidden filtered cards stay outside navigation flow.
- Menu, sheet and modal use predictable Escape behavior and focus restoration where already supported.
- Reduced motion and reduced transparency are first-class fallbacks.
- Failed images preserve layout and provide a readable fallback label.
- No horizontal page overflow from chips, cards or builder controls at 320 px.

## Stacking contract

Use an explicit hierarchy:

- base content: 0-10;
- sticky header: 80;
- mobile builder action: 94;
- summary backdrop/sheet: 110/111;
- modal/backdrop: 140+.

No component may rely on an incidental z-index collision.

## Implementation boundaries

Primary changes:

- `assets/brand-v5.css`: final global iOS 26 visual system;
- `assets/enhancements.css`: responsive/layout corrections where it owns structure;
- `assets/app.js`: animated drawer support, mobile filter scroller, service-detail copy cleanup and catalogue empty state;
- `assets/builder-pro-v4.css`: final builder Liquid Glass styling, stacking and sheet handle;
- `assets/builder-ux.js`: drag-to-dismiss summary behavior and resilient sheet state cleanup;
- `tests/test_ios26_design.py`: explicit regression contract;
- `.github/workflows/ci.yml`: run the new regression contract.

The underlying `assets/builder.js` data/validation model and `assets/smart-ordering.js` product preset model remain sources of truth and should not be rewritten for visual work.

## Acceptance criteria

The redesign is ready when all of the following are true:

1. Homepage, catalogue, service pages, supporting pages and builder visibly share one radius/surface/motion system.
2. Mobile menu opens and closes with an actual finite transition instead of display switching.
3. Mobile catalogue categories are swipe-scrollable and do not create a multiline chip wall.
4. Service detail images have stable error fallback treatment.
5. Repetitive service feature helper text is reduced to one shared guidance message.
6. Builder summary opens as a Liquid Glass sheet and can be dismissed by a controlled downward drag.
7. Modal always stacks above builder floating controls and summary.
8. All primary interactive families have consistent pressed and focus-visible feedback.
9. Reduced-motion and reduced-transparency fallbacks exist.
10. Existing customer-first, builder and smart-ordering contracts continue to pass.
11. Internal links remain valid and the static build validator passes.
12. No known horizontal overflow or fixed-layer overlap remains at 320-360, 390-430, 768, 1024 and 1280+ px behavioral layouts.
