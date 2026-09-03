# Opera-print iOS 26 Liquid Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fragmented visual polish with one coherent iOS 26-inspired Liquid Glass system across the entire Opera-print customer flow without changing the existing customer-first ordering model.

**Architecture:** Keep `styles.css` as the structural base and make `brand-v5.css` the single final global visual layer. Keep builder data/validation in `builder.js`; use `builder-pro-v4.css` and `builder-ux.js` only for final builder presentation and sheet interaction. Enhance shared DOM behavior in `app.js` so catalogue and service pages can be improved without duplicating markup changes across dozens of static pages.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Python unittest, Node-based contract probes, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-03-ios26-liquid-glass-design.md`

## Global Constraints

- Preserve the existing four-step builder and smart-ordering preset model.
- Liquid Glass is a functional layer, not a universal blur effect.
- Touch targets for primary mobile controls stay at least 44 px.
- Motion is finite and disabled/reduced under `prefers-reduced-motion: reduce`.
- Blurred surfaces have opaque fallbacks under `prefers-reduced-transparency: reduce`.
- Explicit stacking order: header 80, mobile builder 94, summary 110/111, modal 140+.
- No horizontal overflow at 320 px.
- Existing customer-first, builder, smart-ordering and internal-link tests must remain green.

---

### Task 1: Lock the iOS 26 regression contract

**Files:**
- Create: `tests/test_ios26_design.py`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: current CSS/JS file names and builder markup contracts.
- Produces: static regression checks that fail until the new global system, mobile menu, filter scroller, image fallback, stacking and swipe-sheet behavior exist.

- [ ] **Step 1: Write failing tests**

Add tests that assert:

```python
class IOS26DesignTests(unittest.TestCase):
    def test_global_liquid_glass_tokens_and_fallbacks(self):
        css = read("assets/brand-v5.css")
        for marker in (
            "--glass-bg:", "--radius-xl:", "--motion-spring:",
            "prefers-reduced-transparency:reduce", "prefers-reduced-motion:reduce",
        ):
            self.assertIn(marker, css)

    def test_mobile_drawer_animates_without_display_switching(self):
        css = read("assets/brand-v5.css") + read("assets/enhancements.css")
        self.assertIn("max-height:0", css)
        self.assertIn(".drawer.open", css)
        self.assertIn("visibility:hidden", css)

    def test_catalogue_filter_scroller_and_empty_state_are_enhanced(self):
        app = read("assets/app.js")
        css = read("assets/brand-v5.css")
        self.assertIn("filter-scroller", app)
        self.assertIn("catalogue-empty", app)
        self.assertIn("scroll-snap-type:x", css)

    def test_service_detail_noise_and_image_failure_are_handled(self):
        app = read("assets/app.js")
        css = read("assets/brand-v5.css")
        self.assertIn("service-guidance", app)
        self.assertIn(".service-photo.image-error", css)

    def test_builder_sheet_supports_drag_dismiss_and_modal_stacks_above_it(self):
        ux = read("assets/builder-ux.js")
        css = read("assets/builder-pro-v4.css")
        self.assertIn("bindSummaryDrag", ux)
        self.assertIn("sheet-dragging", ux)
        self.assertIn("z-index:140", css)
        self.assertIn("z-index:111", css)
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```bash
python -m unittest tests.test_ios26_design -v
```

Expected: failures for missing Liquid Glass tokens, filter scroller, service guidance, drag-dismiss and explicit stacking.

- [ ] **Step 3: Add the test module to CI**

Add:

```yaml
- name: Run iOS 26 design contract
  run: python -m unittest tests.test_ios26_design -v
```

- [ ] **Step 4: Commit the RED contract**

Commit message:

```text
test: define iOS 26 design contract
```

---

### Task 2: Consolidate the global visual language

**Files:**
- Modify: `assets/brand-v5.css`

**Interfaces:**
- Consumes: existing selectors from `styles.css` and `enhancements.css`.
- Produces: global design tokens and final component states used by all pages.

- [ ] **Step 1: Implement token groups and global surface rules**

Define named tokens for glass backgrounds, glass borders, shadows, radius scale, motion durations and spring easing. Style body ambient background, header, buttons, menu control, cards, hero overlay, CTA surfaces, inputs, filters, footer and modal shared geometry.

- [ ] **Step 2: Implement interactive states**

Use one pressed state with `scale(.975)`, hover only under `(hover:hover) and (pointer:fine)`, cyan focus-visible ring and magenta selected confirmation.

- [ ] **Step 3: Implement real mobile drawer transitions**

At mobile widths, override the base drawer to stay `display:grid`, use `max-height`, `opacity`, `visibility`, `transform`, `pointer-events`, and animate `.drawer.open` without layout jump.

- [ ] **Step 4: Implement responsive catalogue scroller styles and image fallbacks**

Style `.filter-scroller` as horizontal momentum scrolling with `scroll-snap-type:x proximity`; style `.catalogue-empty`; extend image-error fallback to `.service-photo.image-error`.

- [ ] **Step 5: Add reduced transparency / reduced motion fallbacks**

Opaque surfaces replace blur; transforms and animations are removed.

- [ ] **Step 6: Run the global subset of the design contract**

Run:

```bash
python -m unittest tests.test_ios26_design.IOS26DesignTests.test_global_liquid_glass_tokens_and_fallbacks tests.test_ios26_design.IOS26DesignTests.test_mobile_drawer_animates_without_display_switching tests.test_ios26_design.IOS26DesignTests.test_catalogue_filter_scroller_and_empty_state_are_enhanced tests.test_ios26_design.IOS26DesignTests.test_service_detail_noise_and_image_failure_are_handled -v
```

Expected: remaining failures only for JavaScript behavior not yet implemented.

---

### Task 3: Upgrade shared site interactions without duplicating static markup

**Files:**
- Modify: `assets/app.js`

**Interfaces:**
- Consumes: `.filterbar`, `[data-filter]`, `[data-results-count]`, `.service-layout`, `.feature-list`, mobile menu markup.
- Produces: `initFilterScroller()`, catalogue empty state, `upgradeServiceDetails()` and improved menu state handling.

- [ ] **Step 1: Add `initFilterScroller(doc)`**

On pages containing a `.filterbar`, wrap all `[data-filter]` buttons in one dynamically-created `.filter-scroller` element, preserving the search input and result count outside the scroller. Do nothing if already initialized.

- [ ] **Step 2: Add catalogue empty state**

Create one `.catalogue-empty` after `.services-grid`. `initFilters()` updates its hidden state whenever zero cards match search/category.

- [ ] **Step 3: Add `upgradeServiceDetails(doc)`**

When `.service-layout .feature-list` exists and every feature helper span repeats the same generic sentence, hide/remove those repeated spans and insert one `.service-guidance` note after the feature list. Normalize visible builder CTA copy to `Рассчитать заказ`.

- [ ] **Step 4: Keep menu state resilient**

Preserve scroll lock, Escape focus restoration and desktop resize cleanup. Set a stable `data-open`/ARIA state without relying on text animation for correctness.

- [ ] **Step 5: Run shared behavior tests**

Run:

```bash
python -m unittest tests.test_ios26_design -v
python -m unittest tests.test_site.SiteStructureTests.test_mobile_menu_has_escape_scroll_lock_and_resize_cleanup -v
```

Expected: all non-builder iOS 26 tests pass.

---

### Task 4: Finish the builder as a true mobile Liquid Glass flow

**Files:**
- Modify: `assets/builder-pro-v4.css`
- Modify: `assets/builder-ux.js`

**Interfaces:**
- Consumes: current `.summary`, `.summary-backdrop`, `.builder-mobile-action`, modal and four-stage navigation markup.
- Produces: explicit sheet stacking, sheet handle, controlled drag transform and `bindSummaryDrag()`.

- [ ] **Step 1: Fix stacking and visual ownership**

Set builder action to 94, backdrop to 110, summary to 111 and modal to 140+. Give summary and modal elevated glass surfaces, matching radius and safe-area spacing.

- [ ] **Step 2: Add sheet handle and drag state styles**

Use `.summary::before` for a visible handle on mobile. `.summary.sheet-dragging` disables transition while the user drags; release restores spring transition.

- [ ] **Step 3: Implement `bindSummaryDrag()`**

Use touch events on mobile only. Start drag only when the sheet is open, its `scrollTop <= 0`, and movement is downward. Apply temporary `translateY(px)` during drag. If downward distance crosses about 88 px (or a clearly fast downward gesture), clear the inline transform and call existing `closeSummary`; otherwise animate back to zero.

- [ ] **Step 4: Harden sheet cleanup**

`openSummary` and `closeSummary` always clear temporary drag transform/classes so resize, Escape, backdrop close and re-open cannot leave stale inline state.

- [ ] **Step 5: Run builder design contract**

Run:

```bash
python -m unittest tests.test_ios26_design.IOS26DesignTests.test_builder_sheet_supports_drag_dismiss_and_modal_stacks_above_it -v
python -m unittest tests.test_builder_professional -v
```

Expected: PASS.

---

### Task 5: Full regression, critique and corrective pass

**Files:**
- Modify only files implicated by failing verification or critique.

**Interfaces:**
- Consumes: all completed tasks.
- Produces: verified branch ready for review/merge.

- [ ] **Step 1: Run static build and complete regression suite**

Run:

```bash
python build_site.py
python -m unittest tests.test_site tests.test_builder_professional tests.test_smart_ordering tests.test_ios26_design -v
```

Expected: 0 failures.

- [ ] **Step 2: Critique against the acceptance checklist**

Inspect for: duplicated CSS ownership, unreadable glass contrast, mobile chip overflow, drawer transition conflicts, stale sheet transform after close, modal/fixed overlap, missing reduced-transparency fallback, and accidental loss of smart-ordering functionality.

- [ ] **Step 3: Correct every material issue found**

For each correction, add or tighten a regression assertion first when the issue is mechanically testable, verify RED, then fix and re-run.

- [ ] **Step 4: Re-run the complete verification command**

Run the same build + four-module test command fresh.

- [ ] **Step 5: Check GitHub Actions on the branch/PR**

Require all relevant jobs to succeed before any completion claim.
