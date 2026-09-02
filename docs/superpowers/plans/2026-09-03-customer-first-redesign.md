# Opera-print Customer-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing Opera-print prototype around customer tasks, simplify catalogue and calculator UX, remove animation/interface bugs, preserve Opera-print content/source images, and keep the custom order calculator.

**Architecture:** Keep the project static and framework-free. Treat `build_site.py` as the source of truth for shared layouts/product pages, while `assets/app.js`, `assets/builder.js`, `assets/styles.css`, and `assets/enhancements.css` own interaction and presentation. Add tests before behavior changes and keep DOM IDs stable where existing JS depends on them.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Python generator/tests, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-03-customer-first-redesign-design.md`

## Global Constraints

- Preserve factual Opera-print content, service set, contacts, production facts, and matching source images.
- Keep the beige/graphite/red identity but reduce visual noise.
- Mobile is a first-class layout; test narrow mobile, common phone, tablet, compact desktop, and wide desktop behavior.
- No horizontal page overflow at supported widths.
- Motion is finite and functional; no infinite hero float or pointer-following glow.
- `prefers-reduced-motion: reduce` must expose content immediately with transforms/reveals disabled.
- The calculator forms a request/technical specification and must not claim a guaranteed final price.
- Existing GitHub Pages deployment remains unchanged.

---

### Task 1: Regression tests

**Files:** Create `tests/test_site.py`; read `index.html`, `services.html`, `postpress.html`, `builder.html`, `assets/app.js`, `assets/catalog.js`.

- [ ] Write failing tests requiring the homepage decision funnel, four plain-language catalogue groups, exactly four customer-facing builder stages, explicit photo-album image mapping, all 15 postpress image indices, no pointer-following animation initializer, reduced-motion CSS, and valid internal links.
- [ ] Run `python -m unittest tests.test_site -v` and confirm failures represent missing redesign behavior.

### Task 2: Shared navigation, responsive behavior, and motion

**Files:** Modify `assets/app.js`, `assets/styles.css`, `assets/enhancements.css`, `build_site.py`.

- [ ] Extend tests to require Escape-close, body scroll lock, resize cleanup, finite reveal motion, hover media queries, and absence of infinite hero animations.
- [ ] Update mobile drawer behavior with accurate `aria-expanded`, body scroll lock, Escape close, close-on-navigation, and desktop-resize cleanup.
- [ ] Remove pointer-following glow and infinite hero float. Keep one-time reveal, stable image fallback, hover only on hover-capable devices, and full reduced-motion overrides.
- [ ] Mirror the shared shell changes in `build_site.py`.
- [ ] Run the regression suite.

### Task 3: Customer-first homepage

**Files:** Modify `index.html`, `build_site.py`, `assets/styles.css`.

- [ ] Add failing assertions for hero CTAs, six common product photo cards, four broad customer groups, calculator teaser, order-process section, compact production trust, and final contact CTA.
- [ ] Rebuild the homepage around `Рассчитать заказ` / `Выбрать продукцию`, real Opera-print product photography, common intents, four groups, quick calculator entry, ordering steps, trust, and contact.
- [ ] Add responsive 3/2/1-column behavior with no 320px overflow.
- [ ] Run homepage and full tests.

### Task 4: Catalogue simplification

**Files:** Modify `assets/catalog.js`, `services.html`, `build_site.py`, `assets/styles.css`.

- [ ] Add failing assertions for exactly four filters: `Реклама и раздача`, `Презентация и офис`, `Для кафе, магазинов и упаковки`, `Книги и многостраничная печать`.
- [ ] Map all 23 services into those groups while preserving service slugs, image URLs, and builder product keys.
- [ ] Simplify cards to image, name, one plain-language sentence, at most two short attributes, and an obvious open affordance.
- [ ] Make filters wrap, hidden cards leave no gaps, and mobile filters non-sticky.
- [ ] Run full tests.

### Task 5: Service, postpress, and supporting pages

**Files:** Modify `build_site.py`, generated `pechat-*.html`, `proizvodstvo-kalendarei.html`, `postpress.html`, `capabilities.html`, `prepress.html`, `requirements.html`, `delivery.html`, `contacts.html`, stylesheets.

- [ ] Add static hierarchy tests for product CTA, correct source-image mapping including photo albums, 15 postpress cards, contact priority details, and valid internal links.
- [ ] Standardize product pages: breadcrumb → service name/description → correct image → primary calculator CTA → meaningful options → relevant requirements/postpress links → related products.
- [ ] Keep all 15 postpress operations and exact source images, remove decorative badges covering images, maintain stable aspect ratio and 3/2/1 layout.
- [ ] Simplify supporting page hierarchy without changing factual content.
- [ ] Run full tests.

### Task 6: Four-stage calculator

**Files:** Modify `builder.html`, `assets/builder.js`, `assets/styles.css`, and generator shell if needed.

- [ ] Add failing assertions for four headings: `1. Изделие`, `2. Размер и тираж`, `3. Материал и печать`, `4. Отделка и итог`; mobile bottom action; collapsible mobile summary; existing manager-output IDs retained.
- [ ] Group existing controls into the four stages without deleting data fields required by current JS.
- [ ] Add Previous/Continue navigation, validation before advancing when required, and preserve contact/input state when navigating or changing product.
- [ ] Add mobile summary sheet and sticky action that does not cover focused fields. Escape closes summary/modal/drawer in priority order.
- [ ] Keep final technical specification/modal and explicit manager-confirmation copy.
- [ ] Run full tests.

### Task 7: Generator consistency and static QA

**Files:** Modify `build_site.py`; regenerate static pages and `assets/catalog.js` if generator owns them; test `tests/test_site.py`.

- [ ] Add checks prohibiting stale six-step builder headings, old category filter labels, old pointer-glow code, and stale shared navigation markup.
- [ ] Run `python build_site.py` where possible, then `python -m unittest tests.test_site -v`.
- [ ] Verify local HTML links/CSS/JS references, duplicate critical IDs, HTTPS Opera-print image URLs, contacts, service set, production facts, source slugs, and postpress operation names.

### Task 8: Final verification and deployment

- [ ] Run a fresh full regression suite and require 0 failures.
- [ ] Compare `customer-first-redesign` against `main`; verify only intended files changed and the design spec is satisfied.
- [ ] Fast-forward `main` to the verified branch.
- [ ] Inspect the GitHub Pages workflow for the final commit and require `completed/success` before declaring completion.
