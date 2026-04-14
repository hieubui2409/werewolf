---
status: phases-1-8-complete
created: 2026-04-14
priority: high
blockedBy: []
blocks: []
---

# Werewolf Moderator — React Migration Plan

## Summary

Production-grade werewolf moderator: React+TypeScript, Vite, Tailwind v4, Zustand, PWA offline, i18n, dark/light theme, responsive (phone portrait + tablet landscape sidebar), full WCAG AA, Vitest+RTL+Playwright tests. Deploy Cloudflare Pages.

## Key Decisions

- **Stack:** Vite + React 18 + TypeScript + Tailwind CSS v4 + Zustand
- **State:** 1 Zustand store + selectors + persist middleware (partialize)
- **Design:** V17 button/UI style + V21 faction color accents (border + tint)
- **Roles:** 28 merged (V17: 23 + V21 new: 5), custom roles max 5 abilities + full validation
- **Target:** Responsive — phone portrait (2-col) + tablet landscape (sidebar + main grid)
- **Theme:** Dark + Light toggle (Tailwind dark: class strategy)
- **i18n:** react-i18next, Vietnamese + English-ready
- **A11y:** Full WCAG AA (keyboard nav, focus management, ARIA, contrast)
- **Testing:** Vitest + React Testing Library + Playwright E2E
- **PWA:** vite-plugin-pwa + prompt-to-reload update strategy
- **Sounds:** MP3 files (Pixabay/Mixkit — royalty-free)
- **Deploy:** Cloudflare Pages (unlimited BW, fastest edge)
- **Types:** roleId `string | null`, GameRole separate from RoleTemplate (copy fields)

## Phases

| #   | Phase                                                     | Status  | Est. Files | Key Output                                             |
| --- | --------------------------------------------------------- | ------- | ---------- | ------------------------------------------------------ |
| 1   | [Project Setup](phase-01-project-setup.md)                | done    | 8 config   | Vite+TS+Tailwind v4+PWA+i18n+test scaffold             |
| 2   | [Types & Data](phase-02-types-and-data.md)                | done    | 4          | Types, 32 roles, theme, i18n strings                   |
| 3   | [Utility Layer](phase-03-utility-layer.md)                | done    | 4          | Sounds (MP3), timer hook                               |
| 4   | [Common Components](phase-04-common-components.md)        | done    | 3          | BottomSheet (responsive), ErrorBoundary, SelectorModal |
| 5   | [Game State Store](phase-05-game-state-store.md)          | done    | 3          | Zustand store + actions + selectors                    |
| 6   | [Setup Screen](phase-06-setup-screen.md)                  | done    | 5          | Full setup flow                                        |
| 7a  | [Game Screen Core](phase-07a-game-screen-core.md)         | done    | 3          | game-screen, player-card, timer-board                  |
| 7b  | [Game Screen Sheets](phase-07b-game-screen-sheets.md)     | done    | 3          | assign-role, skill, player-action sheets               |
| 7c  | [Game Screen Settings](phase-07c-game-screen-settings.md) | done    | 3          | history, night-confirm, settings sheets                |
| 8   | [Integration & Polish](phase-08-integration-polish.md)    | done    | 2          | App.tsx, main.tsx, PWA, Cloudflare deploy              |
| 9   | [Testing](phase-09-testing.md)                            | pending | 5-8        | Unit + integration + E2E tests                         |

## Architecture

```
main.tsx → App.tsx → ThemeProvider → I18nProvider
                          ↕
              [SetupScreen | GameScreen]
                     ↕              ↕
              Zustand store (useGameStore)
                     ↕
          persist middleware ↔ localStorage
```

**Responsive layout (md+ breakpoint):**

```
Phone (portrait):          Tablet (landscape, >768px):
┌──────────────┐           ┌──────────┬───────────────┐
│ TimerBoard   │           │ Timer    │ Player Grid   │
│ Player Grid  │           │ Turn N   │ (4-col)       │
│ (2-col)      │           │──────────│               │
│              │           │ [Role]   │               │
│ [Role][Skill]│           │ [Skill]  │               │
└──────────────┘           └──────────┴───────────────┘
```

## Risk

- **Zustand store** could exceed 200 lines → split into slices if needed
- **Responsive sidebar layout** adds significant CSS complexity → use Tailwind md: prefix
- **i18n + a11y** combined add ~30% effort to every component
- **Playwright E2E** requires browser setup in CI
- Sound MP3 files need sourcing during Phase 3

## Cook Command

```
/ck:cook --auto /home/hieubt/Documents/werewolf/plans/260414-100035-werewolf-react-migration
```

## Validation Log

### Session 1 — 2026-04-14

**Trigger:** `/ck:plan validate` — hardcore mode
**Questions asked:** 17 (5 batches)

#### Questions & Answers

1. **[Architecture]** Tailwind version: v3 (PostCSS) hay v4 (@tailwindcss/vite)?
   - Options: Tailwind v4 | Tailwind v3
   - **Answer:** Tailwind v4
   - **Rationale:** v4 dùng `@import "tailwindcss"` + `@tailwindcss/vite` plugin, no PostCSS. Plan gốc ghi v3 nhưng code snippet đã dùng v4 syntax.

2. **[Architecture]** Font Awesome: CDN hay npm package? CDN conflicts với PWA offline.
   - Options: FA npm package | CDN + cache | Skip FA
   - **Answer:** FA npm package (`@fortawesome/fontawesome-free`)
   - **Rationale:** PWA cần offline support. CDN fails offline.

3. **[Architecture]** State management: useGameState hook hay Zustand hay Redux?
   - Options: useGameState hook | Zustand | Redux Toolkit
   - **Answer:** Zustand (sau follow-up "which best when scale?")
   - **Rationale:** Zustand — minimal boilerplate, built-in selectors tránh re-render, persist middleware.

4. **[Types]** roleId type: `string | 0` hay `string | null`?
   - Options: string \| null | string \| 0 | string \| undefined
   - **Answer:** `string | null`
   - **Rationale:** `0` as sentinel value bất thường trong TypeScript. `null` idiomatic hơn.

5. **[Architecture]** Zustand store design: monolith hay slices?
   - Options: 1 store + selectors | Multiple slices | 1 store + immer
   - **Answer:** 1 store + selectors
   - **Rationale:** App ~30 players, single store đủ. Selectors tránh unnecessary re-renders.

6. **[Data]** localStorage save strategy?
   - Options: Key events only | Debounced 2s | Manual | Zustand persist
   - **Answer:** Zustand persist middleware + partialize (exclude UI state)
   - **Custom input:** "Chỉ quản trò dùng, 1 người sử dụng app. Cái nào tối ưu nhất"
   - **Rationale:** Single user → persist middleware auto-saves. Partialize excludes flippedCards, modals.

7. **[Data]** Schema migration khi role templates thay đổi?
   - Options: Load as-is | Version + migration | Clear on mismatch
   - **Answer:** Load as-is, ignore mismatches
   - **Rationale:** GameRole lưu đầy đủ data. Templates mới chỉ hiện khi tạo game mới.

8. **[Architecture]** Sound approach: Web Audio API hay MP3 files?
   - Options: Web Audio tones | MP3 files | Hybrid | Skip
   - **Answer:** MP3 files (tìm royalty-free sources)
   - **Custom input:** "Tìm src mp3 phù hợp trên web cho tôi"
   - **Rationale:** Sources found: Pixabay, Mixkit, Freesound (CC0/royalty-free).

9. **[Scope]** Orientation: portrait only hay responsive fluid?
   - Options: Portrait only | Portrait + tablet landscape | Responsive fluid
   - **Answer:** Responsive fluid
   - **Rationale:** User wants full responsive. Impacts layout significantly.

10. **[Scope]** Phase 7 split?
    - Options: Split 2 (7a+7b) | Keep 1 | Split 3 (core/sheets/settings)
    - **Answer:** Split 3: core / sheets / settings
    - **Rationale:** 9 files too large for 1 phase. 3 sub-phases easier to review/debug.

11. **[Architecture]** BottomSheet stacking?
    - Options: Replace | Stack max 2 | Inline confirm
    - **Answer:** Replace (1 sheet at a time)
    - **Rationale:** Simple, no z-index management. Reset confirm replaces settings sheet.

12. **[Scope]** Testing strategy?
    - Options: No tests | Unit only | Unit + integration
    - **Answer:** Unit + integration tests
    - **Rationale:** User wants full test coverage.

13. **[Architecture]** Responsive breakpoint strategy?
    - Options: Tailwind prefixes | Container queries | Hybrid
    - **Answer:** Hybrid (Tailwind + container queries for player grid)
    - **Rationale:** Tailwind prefixes for layout, container query for player-card grid auto-adapt.

14. **[Architecture]** Test framework?
    - Options: Vitest + RTL | Vitest + RTL + Playwright | Vitest only
    - **Answer:** Vitest + RTL + Playwright (full stack)
    - **Rationale:** E2E coverage for game flows.

15. **[Types]** GameRole relationship to RoleTemplate?
    - Options: Separate (copy fields) | Extends + deep clone | Composition (ref + overrides)
    - **Answer:** Separate, copy fields
    - **Rationale:** Edit in-game không ảnh hưởng template. Clean separation.

16. **[Scope]** Testing phase structure?
    - Options: Add Phase 9 | Embed in each phase | Phase 9 + 10
    - **Answer:** Add Phase 9 (after all features)
    - **Rationale:** Tests don't block feature development. Dedicated phase easier to manage.

17. **[Architecture]** PWA update strategy?
    - Options: Prompt to reload | Auto-update | Skip
    - **Answer:** Prompt to reload
    - **Rationale:** User sees toast, clicks reload. Không mất game đang chơi.

18. **[Architecture]** Skill sheet wizard state management?
    - Options: Local useState | Zustand UI slice | useReducer FSM
    - **Answer:** Local useState
    - **Rationale:** Wizard resets every open. Self-contained, no need for store.

19. **[Scope]** Custom role abilities limit + validation?
    - Options: Max 5 basic | Unlimited no validation | Max 5 full validation
    - **Answer:** Max 5, full validation (name unique, ability names unique, targetCount ≤ playerCount)
    - **Rationale:** Prevent users from creating meaningless roles.

20. **[UI]** Tablet landscape layout?
    - Options: Wider grid same layout | Sidebar + main | Sheet → side panel
    - **Answer:** Sidebar + main area
    - **Rationale:** Timer+Turn+Buttons in left sidebar, player grid in main area.

21. **[UI]** Dark/Light theme?
    - Options: Dark only | Dark + Light toggle | System preference
    - **Answer:** Dark + Light toggle
    - **Rationale:** Tailwind dark: class strategy. Toggle in settings.

22. **[Infra]** Deploy platform?
    - Options: Cloudflare Pages | Vercel | GitHub Pages | Netlify
    - **Answer:** Cloudflare Pages
    - **Rationale:** Unlimited BW, fastest edge, no sub-path issues, free.

23. **[Scope]** i18n?
    - Options: Vietnamese only | Vi + constants | Full react-i18next
    - **Answer:** Full react-i18next from start
    - **Rationale:** Vietnamese + English-ready. Extract strings from day 1.

24. **[Scope]** Accessibility level?
    - Options: Basic ARIA | Skip | Full WCAG AA
    - **Answer:** Full WCAG AA
    - **Rationale:** Keyboard nav, focus management, aria-live, contrast ratios.

25. **[Scope]** Scope confirmation — keep all or cut?
    - Options: Keep all | 2 waves | Cut i18n + a11y
    - **Answer:** Keep all, full featured
    - **Rationale:** Production-grade app. Accept ~2.5x scope increase.

#### Confirmed Decisions

- Tailwind v4: `@import "tailwindcss"` + `@tailwindcss/vite`
- Zustand: 1 store + selectors + persist middleware (partialize)
- roleId: `string | null`
- GameRole: separate type (copy fields from template, not extends)
- FA: npm `@fortawesome/fontawesome-free`
- Responsive: Tailwind prefixes + container queries hybrid
- Theme: Dark + Light (Tailwind dark: class)
- i18n: react-i18next
- A11y: Full WCAG AA
- Tests: Vitest + RTL + Playwright, Phase 9
- Deploy: Cloudflare Pages
- Sounds: MP3 from Pixabay/Mixkit
- Phase 7: split 3 (7a core / 7b sheets / 7c settings)
- BottomSheet: replace, not stack
- PWA: prompt-to-reload

#### Action Items

- [x] Update plan.md key decisions and phases table
- [ ] Rewrite phase-01: Tailwind v4, FA npm, Vitest+RTL+Playwright, react-i18next, dark/light config
- [ ] Rewrite phase-02: roleId string|null, GameRole separate, i18n strings file
- [ ] Update phase-03: Zustand persist, MP3 sounds
- [ ] Update phase-04: responsive BottomSheet, ARIA, dark/light
- [ ] Rewrite phase-05 → phase-05-game-state-store: Zustand store
- [ ] Update phase-06: responsive, theme, i18n, a11y
- [ ] Split phase-07 → 7a (core) + 7b (sheets) + 7c (settings)
- [ ] Update phase-08: Cloudflare Pages, PWA prompt-to-reload, responsive layout
- [ ] Create phase-09: Testing (Vitest + RTL + Playwright)

#### Impact on Phases

- Phase 1: Major rewrite — add i18n, test setup, theme config, FA npm
- Phase 2: Rewrite types (roleId, GameRole), add i18n strings file
- Phase 3: Zustand persist replaces manual storage, MP3 sounds
- Phase 4: BottomSheet becomes responsive (side panel on landscape), add ARIA
- Phase 5: Complete rewrite — Zustand store replaces useGameState hook
- Phase 6: Add responsive, theme, i18n, a11y to all components
- Phase 7: Split into 7a/7b/7c, add responsive sidebar layout, theme, i18n, a11y
- Phase 8: Cloudflare Pages deploy, PWA prompt-to-reload, responsive polish
- Phase 9: NEW — dedicated testing phase
