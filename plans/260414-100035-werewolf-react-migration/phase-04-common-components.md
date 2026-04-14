---
phase: 4
status: pending
priority: high
effort: medium
---

# Phase 4: Common Components

<!-- Updated: Validation Session 1 - Responsive BottomSheet, ARIA/WCAG AA, dark/light theme support -->

## Overview

Reusable UI components shared between Setup and Game screens. Responsive (phone: bottom sheet, tablet landscape: same sheet but wider), WCAG AA accessible, dark/light themed.

## Files to Create

### 1. `src/components/common/bottom-sheet.tsx` (~60 lines)

From V17's BottomSheet — enhanced with a11y and responsive width.

```tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: string; // Font Awesome class
  titleColor?: string; // Tailwind text color
  fullHeight?: boolean;
  children: React.ReactNode;
}
```

**Behavior:**

- Replace strategy: only 1 sheet open at a time (no stacking)
- Close: tap overlay or close button (no swipe-to-dismiss for MVP)

**Styling (V17 base + V21 polish + dark/light):**

- Overlay: `bg-black/85 dark:bg-black/85` with `backdrop-blur-sm`
- Sheet: `bg-white dark:bg-slate-800 rounded-t-3xl`
- Close button: circular `bg-gray-200 dark:bg-slate-700`
- Content: `flex-1 overflow-y-auto hide-scrollbar`
- Animation: `.modal-enter` slideUp

**Responsive:**

- Phone: full-width bottom sheet
- Tablet (md+): max-width 640px, centered horizontally

**WCAG AA:**

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Focus trap: first focusable element on open, return focus on close
- `Escape` key closes sheet
- Overlay click closes (with `aria-label="Close"`)

### 2. `src/components/common/error-boundary.tsx` (~30 lines)

Class component from V17. Typed for TypeScript.

```tsx
// Renders crash screen with reload button
// Shows error message in red bg
// ARIA: role="alert" on error display
// Dark/light: error background adapts
```

### 3. `src/components/common/selector-modal.tsx` (~70 lines)

Number/type picker from V17. Uses BottomSheet.

```tsx
interface SelectorConfig {
  type: "order" | "targetCount" | "max" | "skillType";
  roleId: string;
  abilityId: string | null;
  currentValue: number | string;
}

interface SelectorModalProps {
  selector: SelectorConfig;
  rolesCount: number;
  playerCount: number;
  onClose: () => void;
  onSelect: (value: number | string) => void;
}
```

**Behavior:**

- `order` → grid 1..N (number of roles)
- `targetCount` → grid 1..playerCount
- `max` → grid 1-10 + custom input
- `skillType` → 2 options: "Mỗi Đêm" / "Giới Hạn" (i18n keys)
- Active value highlighted with indigo glow

**WCAG AA:**

- Grid items as `role="radio"` within `role="radiogroup"`
- `aria-checked` on active item
- Keyboard: arrow keys navigate grid, Enter/Space selects
- Labels use i18n translation keys

**Dark/light:**

- Grid buttons: `bg-gray-100 dark:bg-slate-700`
- Active: `bg-indigo-600 text-white` (same in both themes)

## Design Notes

- All touch targets ≥48px for mobile
- BottomSheet: tap-overlay-to-close (no swipe — keep simple)
- V17 active button style: `bg-teal-600 text-white shadow-[0_0_10px_...]`
- All text uses i18n `t()` function

## Success Criteria

- BottomSheet opens/closes with animation
- Focus trap works (Tab cycles within sheet)
- Escape key closes sheet
- SelectorModal renders correct options per type
- Dark/light theme renders correctly
- Screen reader announces dialog opening
- Components compile with no TS errors
