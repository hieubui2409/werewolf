---
phase: 6
status: pending
priority: high
effort: medium
---

# Phase 6: Setup Screen

<!-- Updated: Validation Session 1 - responsive, dark/light, i18n, WCAG AA, custom role max 5 + full validation -->

## Overview

Full setup flow: player config, role list editor, role library browser, custom role builder. Responsive, themed, accessible, translated.

## Files to Create

### 1. `src/components/setup/setup-screen.tsx` (~90 lines)

Container component. Responsive layout.

**Phone (portrait):**

```
┌──────────────────────────┐
│     🌙 THIẾT LẬP        │  ← V17 icon + title
│  ┌── Player Config ───┐  │
│  │ Slider + Names     │  │
│  └────────────────────┘  │
│  Vai Trò    [Thư Viện]  │
│  ┌── Role List ───────┐  │
│  │ Sorted roles       │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  ▶ BẮT ĐẦU GAME   │  │  ← V17 gradient button
│  └────────────────────┘  │
└──────────────────────────┘
```

**Tablet landscape (md+):**

```
┌────────────────┬──────────────────┐
│ Player Config  │ Role List        │
│ Slider + Names │ Sorted roles     │
│                │ with abilities   │
│                │                  │
│                │ [Thư Viện]       │
├────────────────┴──────────────────┤
│       ▶ BẮT ĐẦU GAME            │
└───────────────────────────────────┘
```

**Props:** Consumes `useGameStore()` directly via selectors.
**Modals:** activeModal state (library, createRole), activeSelector state.
**i18n:** All labels via `t()`.
**a11y:** `<main>` landmark, heading hierarchy, form labels.

### 2. `src/components/setup/player-config.tsx` (~70 lines)

- Player count slider (4-30) with badge showing count
- 2-column grid of name inputs (3-col on tablet)
- V17 style: `bg-gray-100 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700`

**a11y:** `<input>` with `aria-label`, slider with `aria-valuetext`.
**i18n:** Labels translated.

### 3. `src/components/setup/role-list.tsx` (~130 lines)

Sorted roles with:

- Night call order number (clickable → opens SelectorModal)
- Editable role name input
- Delete button (X circle, V21 style)
- Abilities section per role:
  - Name input
  - Type button (Đêm/Lần → opens SelectorModal)
  - Max count (if limited → opens SelectorModal)
  - Target count (→ opens SelectorModal)
  - Delete ability button
  - Add ability button (disabled if role has 5 abilities — MAX_ABILITIES_PER_ROLE)

**Faction accent:** left border color based on role.faction via `getFactionStyle()`.
**a11y:** Role items as `<article>` with `aria-label`. Delete buttons labeled.
**i18n:** Ability type labels, placeholder text translated.

### 4. `src/components/setup/role-library-sheet.tsx` (~90 lines)

BottomSheet with:

- "TẠO ROLE TUỲ CHỈNH" button (indigo, V17 style)
- Grouped by category (Basic, Advanced) then faction (Dân, Sói, Phe 3)
- Each template: name + ability count + "added" state
- Faction-colored role names via `getFactionStyle()`
- Custom roles section (if any exist)

**a11y:** Group headings, role items as buttons with state.
**i18n:** Category names, faction names translated.

### 5. `src/components/setup/create-role-sheet.tsx` (~130 lines)

BottomSheet (fullHeight) with:

- Role name input (required)
- Faction picker (3 buttons: Dân/Sói/Phe 3)
- Abilities list (max 5 — `MAX_ABILITIES_PER_ROLE`):
  - Add/remove abilities
  - Each: name (required), type (nightly/limited), max, targetCount
- Save button (disabled until valid)

**Validation (full):**

- Name required, non-empty
- At least 1 ability
- Max 5 abilities
- Ability names required, non-empty
- targetCount ≤ playerCount
- Show inline error messages

**Port from:** V17's `CreateCustomRoleModal` (lines 161-225), enhanced.
**a11y:** Form validation errors linked via `aria-describedby`. Required fields marked.
**i18n:** All labels, error messages, button text translated.

## Button Design (V17 Style)

```
Primary action:   bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg
Library button:   bg-emerald-600 text-white rounded-lg text-xs
Role delete:      absolute -top-3 -right-2 bg-red-600 rounded-full (V21 style)
Ability buttons:  bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-[9px]
```

## Success Criteria

- Player count changes update name grid dynamically
- Roles: add from library, reorder, edit, delete
- Custom roles: validate name, abilities (max 5), save to template list
- Selector modals work for all types
- All buttons match V17 gradient style
- Responsive: phone single-col, tablet 2-panel
- Dark/light theme correct
- All text translated (switch language in settings persists)
- Keyboard navigable, screen reader friendly
