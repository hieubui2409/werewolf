---
phase: 7b
status: pending
priority: high
effort: medium
---

# Phase 7b: Game Screen — Sheets (Role/Skill/Player)

<!-- Updated: Validation Session 1 - Split from Phase 7, dark/light, i18n, WCAG AA, replace strategy -->

## Overview

Game action sheets: role assignment, skill usage wizard, player status management. All use BottomSheet (replace strategy — 1 sheet at a time).

## Files to Create (3 files)

### 1. `src/components/game/assign-role-sheet.tsx` (~90 lines)

BottomSheet (fullHeight). Night call order with accordion.

- Sorted roles list by order
- Click role → expand → show player grid (4 cols phone, varies tablet)
- Toggle player to assign/unassign role
- Players with other roles shown disabled
- Faction-colored role names and badges

**a11y:** Accordion uses `aria-expanded`, player toggles as checkboxes.
**i18n:** Role names via `t()`, labels translated.
**Dark/light:** Card bg and text adapts.

### 2. `src/components/game/skill-sheet.tsx` (~160 lines)

BottomSheet (fullHeight). 3-step wizard. **Most complex sheet.**

Wizard state: local `useState` (resets on close).

**Step 1 — Choose skill:**

- Roles with abilities, grouped. V17 accordion style.
- Each role shows assigned players as badges
- Click role → expand → show ability buttons

**Step 2 — Choose source (if multiple players have same role):**

- Grid of capable players
- Back button to step 1

**Step 3 — Choose targets:**

- Header: "[Player] dùng [Skill]"
- Grid of all players, selectable up to targetCount
- Confirm / Skip buttons

**a11y:**

- Step indicator: `aria-current="step"` + `role="progressbar"`
- Player grid as `role="listbox"` with `aria-selected`
- Keyboard: arrows navigate, Space/Enter selects
- Focus moves to first item on each step transition

**i18n:** All wizard text via `t()` with interpolation (`t("game.useSkillHeader", { player, skill })`).
**Dark/light:** Adapts via BottomSheet parent + component-level classes.

### 3. `src/components/game/player-action-sheet.tsx` (~50 lines)

BottomSheet. Shows selected player status + kill/revive button.

- Current status display (ĐANG SỐNG / ĐÃ TỬ VONG)
- Toggle button: red (kill) or green (revive)
- Player name and role info displayed

**a11y:** Status as `aria-live="polite"`. Toggle button with clear label.
**i18n:** Status text and button labels translated.

## Success Criteria

- Assign roles flow: expand role → toggle player → see assignment reflected on cards
- Skill wizard: 3-step flow completes, action logged
- Kill/revive toggles player status with visual feedback
- Sheet replace strategy: opening new sheet closes previous
- All text translated via i18n
- Keyboard navigation works through all wizard steps
- Dark/light theme renders correctly
