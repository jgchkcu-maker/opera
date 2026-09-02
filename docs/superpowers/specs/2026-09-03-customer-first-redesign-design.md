# Opera-print customer-first redesign

Date: 2026-09-03
Repository: `jgchkcu-maker/opera`
Status: approved direction, design spec pending user review before implementation

## Goal

Rebuild the existing Opera-print redesign around how a normal customer chooses and orders printing, not around internal printing terminology. Preserve the original Opera-print content, service set, contact details, production facts and source images, while keeping our improved visual system and the custom order calculator.

Success means a first-time customer can answer three questions quickly:

1. What can I order here?
2. How do I choose the right option without knowing printing terms?
3. How do I calculate or send an order from mobile or desktop?

The redesign must reduce visual noise, simplify navigation, improve card comprehension, make the calculator easier to use, and remove animation/interface bugs.

## UX principles

- Lead with customer tasks and recognizable products, not production jargon.
- One primary action per screen or section.
- Progressive disclosure: show advanced print settings only when they are relevant.
- Product photos must come from the matching service on `operaprint.ru`.
- Keep the beige/graphite/red visual identity already used in the prototype, but simplify card decoration and motion.
- Mobile is a first-class layout, not a compressed desktop layout.
- Motion must explain state change or hierarchy; decorative continuous motion is removed.
- Every important path must work with keyboard navigation and `prefers-reduced-motion`.

## Information architecture

### Primary navigation

Desktop navigation:

- Продукция
- Рассчитать заказ
- Производство
- Постпечатка
- Контакты

`Рассчитать заказ` is visually primary. Secondary utility links such as technical requirements and delivery remain available inside the relevant pages, footer and mobile drawer rather than competing in the top navigation.

Mobile navigation uses a full-width drawer with large touch targets, clear section grouping, body scroll lock while open and an obvious close control. It must not reuse the cramped desktop navigation.

## Homepage

The homepage becomes a decision funnel rather than a general company presentation.

### 1. Hero

Purpose: explain the offer and give the user two obvious next actions.

Content hierarchy:

- Short promise: convenient printing in Krasnoyarsk for single items and runs.
- Supporting line explaining that the user can choose a product or calculate an order.
- Primary CTA: `Рассчитать заказ`.
- Secondary CTA: `Выбрать продукцию`.
- One real Opera-print product image or compact composition using matching source photography. Avoid purely decorative floating paper objects as the main hero focus.

### 2. "Что хотите напечатать?"

Show a compact set of common customer intents using large photo cards. Initial set:

- Визитки
- Листовки / флаеры
- Каталоги / брошюры
- Меню
- Наклейки / стикеры
- Календари

Each card has one matching original Opera-print image, product name, one short plain-language description and a direct link. Avoid dense tag clouds.

### 3. Customer-oriented groups

Four broad groups summarize the full catalogue:

1. Реклама и раздача
2. Презентация и офис
3. Для кафе, магазинов и упаковки
4. Книги, каталоги и многостраничная печать

These groups replace exposing all printing categories at once.

### 4. Quick calculator entry

A compact calculator teaser explains that the full calculator can estimate/configure the request. Show the first meaningful choice and a strong CTA into `builder.html`; do not place the entire multi-step form on the homepage.

### 5. How ordering works

Three or four simple steps:

1. Выбираете изделие
2. Указываете параметры
3. Прикладываете / готовите макет
4. Менеджер подтверждает цену и срок

This sets expectations because the prototype does not perform final payment or CRM submission.

### 6. Production trust

Only after the ordering path, show production capabilities, postpress and equipment proof. Use a compact layout with direct links rather than a large technical wall of text.

### 7. Contact CTA

End with one clear contact/order block containing phone, email and link to contacts.

## Catalogue (`services.html`)

### Structure

- Search remains available.
- Category filters become the same four plain-language groups used on the homepage.
- The default view should feel browsable before filtering.
- Filter controls wrap cleanly and must not become a wide sticky pill that blocks content on small screens.

### Service cards

Each card contains:

- Correct source photo from the corresponding Opera-print service.
- Product name.
- One sentence explaining what it is used for.
- Maximum two short supporting attributes when useful.
- One visual affordance that the card opens a detail page.

Cards should have consistent image ratios and content heights without forcing large blank space. Hover is subtle and only active on devices that actually support hover.

No continuous glow, floating animation or pointer-following effect is required for catalogue comprehension.

## Service detail pages

Each service page follows the same customer-first pattern:

1. Breadcrumb
2. Service name + plain description
3. Correct source photo
4. Main CTA `Рассчитать / собрать заказ`
5. "Что можно выбрать" with only meaningful options for that product
6. Relevant postpress / requirements links
7. A small related-products section

Technical wording remains available but is explained in customer language. Product image mapping must be based on the actual matching Opera-print page; exceptions such as photo albums use explicit source mapping rather than guessing from local filenames.

## Order calculator (`builder.html`)

The existing calculator functionality is preserved but visually restructured.

### Flow

The interface is presented as four customer-facing stages:

1. Изделие
2. Размер и тираж
3. Материал и печать
4. Отделка и итог

Existing underlying fields may remain internally separate if required by `builder.js`, but the UI groups them into these four visible stages.

### Progressive disclosure

- Show only settings relevant to the chosen product.
- Advanced options are collapsed or introduced after prerequisite choices.
- Explanations use short helper text rather than long instruction blocks.
- Invalid or incomplete states are explained next to the relevant field.

### Desktop

The form occupies the main area. A compact order summary may remain visible to the side when viewport height/width allows it, but it must never cover controls or create nested scrolling traps.

### Mobile

- One step visible at a time.
- Sticky bottom action with `Продолжить` or `К расчёту`.
- Order summary is accessible as a collapsible sheet/accordion rather than a permanently sticky side panel.
- Large touch controls and spacing.
- Keyboard opening must not hide the active field behind sticky UI.

The calculator continues to form a technical request rather than claiming a guaranteed final price. Copy must make that distinction clear.

## Postpress page

Keep all 15 original operations and their matching images. Improve scanability:

- Photo-led cards.
- Consistent aspect ratio.
- Operation name prominent.
- Short explanation below.
- Avoid decorative labels covering useful image content.
- Layout: 3 columns on wide desktop, 2 on tablet, 1 on narrow mobile.

Animations should not shift card height or cause image layout jumps while loading.

## Production and supporting pages

`capabilities.html`, `prepress.html`, `requirements.html`, `delivery.html`, and `contacts.html` keep original factual content but use simpler page hierarchy:

- Clear page title and summary.
- Fewer competing card styles.
- Technical details grouped into readable sections/accordions when useful.
- Contact page prioritizes phone, email, address and work hours before individual manager cards.

## Motion system

Motion is reduced to functional, finite transitions.

Allowed:

- Section reveal once on scroll: small translate + fade, 350–550 ms.
- Card hover: small lift and image zoom on hover-capable devices.
- Mobile drawer enter/exit.
- Accordion expand/collapse.
- Calculator step transition.
- Button press/focus feedback.

Removed or disabled:

- Infinite hero floating animations.
- Pointer-following radial glows.
- Large transforms that move surrounding layout.
- Scroll effects that replay repeatedly.
- Effects on touch devices that rely on hover.

For `prefers-reduced-motion: reduce`, scroll reveal and transforms are disabled and content is visible immediately.

## Responsive rules

Primary breakpoints are behavior-driven rather than cosmetic:

- Wide desktop: full nav, multi-column cards, optional calculator summary sidebar.
- Tablet: two-column catalogue/postpress where space permits, simplified nav spacing.
- Mobile: single-column content, drawer navigation, no sticky filter bar, bottom calculator action, reduced decorative spacing.

Required checks:

- 320–360 px narrow mobile
- 390–430 px common Android/iPhone widths
- 768 px tablet portrait
- 1024 px tablet/compact desktop
- 1280–1440 px desktop

No horizontal page scroll is allowed at any supported width.

## Accessibility and interface correctness

- All interactive elements have visible focus states.
- Drawer uses correct `aria-expanded`; body scroll is locked while open and restored on close.
- Images have meaningful alt text.
- Hidden filtered cards are removed from navigation flow.
- Sticky elements must not overlap focused controls.
- Buttons and links have at least practical mobile touch targets.
- Text contrast stays readable against photo overlays and surfaces.
- Failed images show a stable fallback without collapsing card layout.

## Bug audit targets

Implementation verification must explicitly check:

- Mobile menu open/close, repeat open, navigation after close and resize transitions.
- Catalogue search + filter combinations and layout after hiding cards.
- Image load/error behavior.
- Duplicate animation initialization.
- Reveal content never remaining invisible if IntersectionObserver fails or JS is disabled where possible.
- Sticky header/filter/summary overlap.
- Long Russian titles and descriptions.
- Builder state preservation when moving forward/back.
- Builder controls after changing product type.
- Browser back/forward where applicable.
- Focus order and Escape close behavior for mobile drawer/sheets.
- No hover-only essential information.
- `prefers-reduced-motion` behavior.

## Implementation boundaries

Primary files expected to change:

- `index.html`
- `services.html`
- `builder.html`
- service detail HTML pages
- `postpress.html`
- supporting static pages where hierarchy needs cleanup
- `assets/styles.css`
- `assets/enhancements.css`
- `assets/app.js`
- `assets/builder.js`
- `assets/catalog.js` if category/source mapping needs adjustment
- `build_site.py` so regenerated static pages do not overwrite the redesign

The existing GitHub Pages workflow remains the deployment mechanism.

## Testing strategy

Implementation follows TDD for behavior changes.

Automated checks will cover at minimum:

- Service-to-source-image mapping, including explicit photo album mapping.
- Postpress title-to-image mapping for all 15 operations.
- Catalogue filtering/search behavior where testable without a browser.
- Builder stage/state helpers extracted into testable functions where needed.
- Static HTML checks for required page structure and absence of broken internal links.
- Reduced-motion and responsive CSS presence.

Manual/visual verification after implementation will cover:

- Main customer path on desktop and mobile.
- Catalogue and filters.
- Service page CTA path to calculator.
- Full calculator flow.
- Mobile drawer and sticky controls.
- Animation regressions and layout shifts.

Before completion, fresh verification must include test results, build/static checks and GitHub Pages deployment status.

## Non-goals

- No real payment flow.
- No CRM/email backend submission unless separately requested.
- No shopping cart or ecommerce account system.
- No replacement of Opera-print factual content with invented marketing claims.
- No unrelated rebrand.

## Final acceptance criteria

The redesign is ready when:

- A customer can reach a relevant product or the calculator from the homepage in one obvious decision.
- Catalogue grouping is understandable without printing expertise.
- Every visible product/postpress image corresponds to the intended Opera-print service.
- The calculator is substantially easier to complete on mobile.
- No known animation, sticky-layout or navigation bug remains in the tested paths.
- The site works at the required mobile/tablet/desktop widths without horizontal overflow.
- Original Opera-print facts/content are preserved where applicable, while the layout and interaction design are our improved version.
