---
phase: 7c
status: done
priority: medium
effort: small
---

# Phase 7c: Game Screen — Settings & History

<!-- Updated: Validation Session 1 - Split from Phase 7, dark/light toggle, i18n, WCAG AA -->

## Overview

Settings, history view, and night transition sheets.

## Files to Create (3 files)

### 1. `src/components/game/history-sheet.tsx` (~80 lines)

BottomSheet (fullHeight). Game log per turn.

- Turn headers with indigo badge
- Action logs: source → ability → target
- Role change logs: old → new
- Status logs: died / revived
- Faction colors on ability names

**a11y:** Turn sections as `<section>` with `aria-label`. Log items as list.
**i18n:** All labels translated. Turn number interpolated.
**Dark/light:** Badge and text colors adapt.

### 2. `src/components/game/night-confirm-sheet.tsx` (~35 lines)

Simple confirm dialog: "Kết thúc Turn N?" with Cancel/Confirm.
Play night ambience sound on confirm.

**a11y:** `role="alertdialog"`, auto-focus confirm button, Escape cancels.
**i18n:** Confirm text with turn number interpolation.

### 3. `src/components/game/settings-sheet.tsx` (~100 lines)

BottomSheet with:

- **Card view mode** selector (3 radio-style buttons)
- **Timer settings**: debate slider (10-300s) + judgment slider (10-120s)
- **Theme toggle**: Dark / Light (2 buttons)
- **Language selector**: Tiếng Việt / English (2 buttons)
- **Reset Game** button (red, opens reset confirm)
- Reset confirm: inline within settings (replace strategy — no stacking)

**a11y:**

- Radio groups for card view, theme, language: `role="radiogroup"` + `aria-checked`
- Sliders: `<input type="range">` with `aria-label` and `aria-valuetext`
- Reset button: `aria-describedby` warning text
- Reset confirm: `role="alertdialog"` inline

**i18n:** All settings labels translated. Theme/language names in their own language.
**Dark/light:** Full theme switch — settings sheet itself adapts immediately on toggle.

## Success Criteria

- History shows all logged actions per turn with faction colors
- Night confirm plays sound and advances turn
- Settings: card view, timer, theme, language all persist
- Reset: inline confirm, clears game state
- All settings work with keyboard
- Theme toggle immediately applies
- Language switch immediately translates UI
