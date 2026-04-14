# V17 vs V21 — Hard Review & Comparison

## 1. Critical Bugs Found

### V21 — BROKEN (4 missing definitions)

| Missing                 | Used at                                                         | Impact                                         |
| ----------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| `getCol()`              | 12+ places (PlayerCard, renderRoleGroup, action steps, history) | **Instant crash on render** — app cannot start |
| `startGlobalAction()`   | line 720 (DÙNG CHIÊU button)                                    | Crash on click                                 |
| `CreateCustomRoleModal` | line 691 (TẠO ROLE TUỲ CHỈNH)                                   | Crash when creating custom role                |
| `openSelector()`        | lines 646, 660-662 (setup screen)                               | Crash on role config buttons                   |

**Root cause:** V21 was refactored to use a THEME system + `getCol()` helper, but the function was never included in the file. Same with extracted render functions referencing removed state/functions.

### V17 — WORKS (1 hidden bug)

| Missing          | Used at                           | Impact                                                                                 |
| ---------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `openSelector()` | lines 651, 665-667 (setup screen) | Crash only when clicking order/skillType buttons — **not fatal, basic gameplay works** |

---

## 2. Feature Comparison

| Feature                   | V17                                                                      | V21                                                                         |
| ------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Default roles loaded      | Empty (user picks from library)                                          | Pre-loaded 7 roles (`INITIAL_ROLE_IDS`)                                     |
| Role count in library     | 23 roles (rich set)                                                      | 15 roles (trimmed)                                                          |
| THEME system              | Hardcoded Tailwind classes                                               | `THEME` object + `getCol()` (broken)                                        |
| Performance memos         | Basic (`sortedRoles`, `sortedPlayers`)                                   | Better (`roleMap`, `playerActionMap` hashmaps)                              |
| Card styling              | CSS classes (`card-bg-front`, `card-bg-back`)                            | Inline `style={{background: gradient}}`                                     |
| Action chips on cards     | Generic red/indigo colors                                                | Faction-colored chips                                                       |
| Render organization       | Inline JSX in main return                                                | Extracted `renderActionStep1/2/3()` functions                               |
| Skill selection accordion | `expandedSkillRole` state → accordion per role                           | Removed — all roles show skills directly                                    |
| Custom role creation      | Dedicated `CreateCustomRoleModal` component                              | Referenced but not defined                                                  |
| New roles                 | Già Làng, Sói Tiên Tri, Sói Đen, Sói Tuyết, Pháp Sư Câm, Người Cáo, etc. | Kẻ Phản Bội, Mẹ Trẻ, Trưởng Làng, Người Hóa Sói, Chán Đời, Sói Con enhanced |

---

## 3. Good vs Bad Design

### V17 GOOD

- **Working button design** — gradient buttons with clear call-to-action hierarchy
- **BottomSheet component** — reusable, clean API (isOpen, onClose, title, icon, children)
- **Flip card mechanic** — intuitive, fun interaction for mobile
- **Role library** — comprehensive with 23 roles, categorized (basic/advanced)
- **Custom role builder** — full modal with faction picker, ability editor
- **Timer fullscreen overlay** — immersive, large typography
- **Error boundary** — catches crashes gracefully

### V17 BAD

- **God component** — `App` is ~500+ lines, all state/logic in one place
- **Missing `openSelector`** — setup role config crashes
- **No performance optimization** — `actionLog.filter()` on every card re-render
- **Hardcoded colors** — no theme system, duplicated color strings everywhere
- **No initial roles** — user must manually pick every role for every game
- **910 lines in single file** — unmaintainable monolith

### V21 GOOD

- **THEME system concept** — `THEME` object with faction colors (good idea, bad execution)
- **Performance memos** — `roleMap` O(1) lookup, `playerActionMap` pre-computed per target
- **Pre-loaded roles** — `INITIAL_ROLE_IDS` for quick game start
- **Better UI polish** — bolder typography (`font-black`), larger touch targets, deeper shadows
- **Extracted render functions** — `renderActionStep1/2/3()` reduces JSX nesting
- **Faction-colored action chips** — visual distinction for which role used skill
- **Better bottom sheet styling** — `backdrop-blur-sm`, `rounded-[2rem]`, shadow improvements

### V21 BAD

- **4 missing functions/components** — completely broken, can't render
- **Inline gradient styles** — `style={{background: col.gradient}}` breaks Tailwind consistency
- **Removed features** — lost `CreateCustomRoleModal`, lost skill accordion (`expandedSkillRole`)
- **Fewer roles** — trimmed from 23 to 15 without good reason
- **Still monolithic** — 871 lines in one file
- **`getCol()` approach** — returns object with many props, makes JSX hard to read (e.g., `${col.bgDark} ${col.textBright} border ${col.borderHalf}`)

---

## 4. Architecture Advice

### Must Have for React Migration

1. **Fix all missing functions** — restore `getCol`, `openSelector`, `CreateCustomRoleModal`, `startGlobalAction`
2. **Merge role libraries** — combine V17's 23 roles + V21's new roles
3. **Mobile-first** — app is for phone/tablet moderators. Touch targets ≥44px, no hover-dependent UI
4. **Split the monolith** — 900-line single component → modular src/ structure

### Design Decisions

- **Button design from V17** — gradient style with icons, rounded-full for primary actions
- **Theme system from V21** — but implemented via Tailwind utilities, not inline styles
- **Pre-loaded roles from V21** — with V17's full role library available
- **Performance patterns from V21** — `roleMap`, `playerActionMap`
- **Card design** — V21's gradient backgrounds per faction, V17's CSS-class approach

### What to Avoid

- Inline styles for gradients — use Tailwind `bg-gradient-to-*` or CSS custom properties
- God component — split state into custom hooks
- Missing error handling in game actions
- Overly complex `getCol()` return object — use simpler faction-to-class mapping

---

## 5. Proposed Folder Structure

```
src/
├── index.jsx                          # Entry point, ReactDOM.createRoot
├── index.css                          # Global styles, animations, fonts
├── App.jsx                            # Router: setup vs game screen
│
├── data/
│   └── default-roles.js               # Role templates (merged v17+v21)
│
├── utils/
│   └── theme.js                        # Faction color mapping (Tailwind classes)
│
├── hooks/
│   ├── use-game-state.js               # Core game state (players, roles, actions)
│   └── use-timer.js                    # Timer logic (debate/judgment)
│
├── components/
│   ├── common/
│   │   ├── bottom-sheet.jsx            # Generic slide-up modal
│   │   ├── error-boundary.jsx          # React error boundary
│   │   └── selector-modal.jsx          # Number/type picker (order, max, skillType)
│   │
│   ├── setup/
│   │   ├── setup-screen.jsx            # Setup page container
│   │   ├── player-config.jsx           # Player count slider + name inputs
│   │   ├── role-list.jsx               # Active roles for this game
│   │   ├── role-library-sheet.jsx      # Browse & add roles from templates
│   │   └── create-role-sheet.jsx       # Custom role builder modal
│   │
│   └── game/
│       ├── game-screen.jsx             # Game page container
│       ├── player-card.jsx             # Flip card (name/role faces)
│       ├── timer-board.jsx             # Top bar with timer + nav buttons
│       ├── assign-role-sheet.jsx       # Night call & role assignment
│       ├── skill-sheet.jsx             # Use abilities (3-step wizard)
│       ├── player-action-sheet.jsx     # Kill/revive player
│       ├── history-sheet.jsx           # Game log viewer
│       ├── night-confirm-sheet.jsx     # End turn confirmation
│       └── settings-sheet.jsx          # Card view mode, timer config, reset
```

**Total: ~20 files, each ≤200 lines**

### Key Splits

- `use-game-state.js` — extracts ALL game logic from App (players, roles, actions, history, night)
- `use-timer.js` — timer start/pause/stop logic
- `theme.js` — maps faction → Tailwind classes (replaces broken `getCol`)
- Setup vs Game screens each own their bottom sheets
