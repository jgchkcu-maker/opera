# Opera-print North Star Smart Ordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing four-step Opera-print calculator usable without knowledge of paper types, density, or 4+0/4+4 notation.

**Architecture:** Keep `assets/builder.js` as the technical source of truth. Add a focused smart-ordering layer that maps every product to plain-language presets, applies the preset through existing form controls, and moves technical controls behind a manual disclosure. Load the layer from `assets/builder-ux.js` so the current builder lifecycle and summary remain intact.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Python unittest, Node for JS contract tests, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-03-north-star-smart-ordering-design.md`

## Global Constraints

- Preserve all existing product keys and technical values from `OperaBuilder.PRODUCTS`.
- Do not change manager-facing technical output or validation semantics.
- Recommendations must never claim a guaranteed final price or production result.
- Technical controls stay available under manual settings.
- Mobile and keyboard interaction remain first-class.

---

### Task 1: Preset contract tests

**Files:**
- Create: `tests/test_smart_ordering.py`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `assets/builder.js` CommonJS exports.
- Produces: executable contract requiring `assets/smart-ordering.js` to export `PRESETS`, `recommendationsForProduct`, `defaultPresetForProduct`, and `presetMatchesProduct`.

- [ ] Write a failing Python unittest that invokes Node, loads `builder.js` and the not-yet-existing `smart-ordering.js`, verifies every builder product has presets, and verifies every preset material/density/side exists in that product’s allowed values.
- [ ] Add that unittest to CI.
- [ ] Open/update the pull request and verify the new job fails because the smart-ordering module is missing.

### Task 2: Smart preset engine

**Files:**
- Create: `assets/smart-ordering.js`

**Interfaces:**
- Consumes: `window.OperaBuilder.PRODUCTS` and existing DOM IDs `paper`, `density`, `printSide`.
- Produces: plain-language preset definitions and `init(document, window)` UI behavior.

- [ ] Define 2–3 plain-language presets per product, with one recommended default.
- [ ] Export pure helper functions so Node contract tests can validate all definitions.
- [ ] In browser init, inject the recommendation panel before technical controls on stage 3.
- [ ] Applying a preset must set the real paper/density/side controls and dispatch their existing change/click events so summary and compatibility logic stay authoritative.
- [ ] Refresh recommendations when `picker:selected` fires and apply the new product’s default preset.
- [ ] Detect manual changes and update/clear selected-preset state.

### Task 3: Progressive disclosure styling and loading

**Files:**
- Create: `assets/smart-ordering.css`
- Modify: `assets/builder-ux.js`

**Interfaces:**
- Consumes: `assets/smart-ordering.js`.
- Produces: loaded smart-ordering layer on every builder page after base builder initialization.

- [ ] Load the new CSS without duplicating an existing link.
- [ ] Load `smart-ordering.js` before professional polish initialization.
- [ ] Move material/density/print-side controls into a `details` disclosure labeled `Настроить вручную` while leaving prepress settings separate.
- [ ] Style presets as clear touch-friendly cards with a visible recommended state, selected state, and restrained transitions.
- [ ] Add reduced-motion overrides and 1-column mobile layout.

### Task 4: Verification

- [ ] Verify the pull-request CI is fully green.
- [ ] Inspect the final diff for accidental changes outside the smart-ordering scope.
- [ ] Confirm the branch keeps the current four-stage calculator, summary, URL product preselection, service-page product links, and manager handoff intact.
