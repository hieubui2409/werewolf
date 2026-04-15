---
title: "Consolidated Bugfix & Redesign"
description: "Fix all 50 audit issues + full UI/UX redesign: Moonlit Gothic theme, Lucide icons, Glowing Edge cards, animations"
status: pending
priority: P1
effort: 80h
branch: main
tags: [bugfix, refactor, frontend, ui-ux, performance]
blockedBy: []
blocks: []
created: 2026-04-15
---

# Consolidated Bugfix & Redesign

## Overview

Merge code-review audit (50 issues) + UI/UX redesign proposal into single prioritized plan.
Priority order: **bugs > storage > logic code > UI > UX**.

## Source Reports

- [Code Review Audit](../reports/code-review-260415-102842-full-codebase-audit.md) — 3C, 8H, 11M, 5I18N, 9Perf, 7UX, 6Arch = 50 issues
- [UI/UX Redesign Proposal](../reports/ui-ux-260415-111014-werewolf-redesign-proposal.md) — color, typography, icons, cards, animations, gamification

## Interview Decisions (Consolidated)

| # | Topic | Decision | Source |
|---|-------|----------|--------|
| 1 | Card height | min-h-[170px] auto-grow | Conflict resolved |
| 2 | Sheet mounting | Lazy mount + mount animation | Conflict resolved |
| 3 | FAB layout | Always 1 FAB expandable | Conflict resolved |
| 4 | Phase order | Phase 1 = ALL bugs first | Conflict resolved |
| 5 | Color system | B: Moonlit Gothic | UI/UX interview |
| 6 | Typography | B: Bebas Neue + Inter | UI/UX interview |
| 7 | Icons | Lucide React + 3 custom SVG | UI/UX interview |
| 8 | Card design | A: Glowing Edge | UI/UX interview |
| 9 | Font hosting | Self-host in /public | UI/UX interview |
| 10 | Light mode | Both dark + light from start | UI/UX interview |
| 11 | Night transition | Full cinematic overlay (2s) | UI/UX interview |
| 12 | Timer urgency | Full 3-tier system | UI/UX interview |
| 13 | Death animation | Full 0.6s cascade | UI/UX interview |
| 14 | Bottom sheet | Swipe-to-dismiss + drag handle | UI/UX interview |
| 15 | Timer layout | Compact single row | UI/UX interview |
| 16 | PWA dialog | Themed BottomSheet + moon | UI/UX interview |
| 17 | Setup screen | Progress bar + role count warning | UI/UX interview |
| 18 | Multi-target undo | Undo entire group + confirm | Code review interview |
| 19 | Dead source | Confirm dialog, not hard block | Code review interview |
| 20 | Nightly multi-use | Warning modal + confirm | Code review interview |
| 21 | Custom templates | Add delete button | Code review interview |
| 22 | Timer escape | Escape key only, no tap-dismiss | Code review interview |
| 23 | Storage migration | Add version=1 + migrate now | Code review interview |
| 24 | Error boundary | Toggle dev/prod | Code review interview |
| 25 | Corrupt storage | Recovery dialog (reset/export) | Code review interview |
| 26 | Roles data | Split by category | Code review interview |
| 27 | Sound mute | Mute/unmute button on timer bar | UI/UX interview |

## Phases

| Phase | Name | Status | Est. | Items |
|-------|------|--------|------|-------|
| 1 | [Complete Bug Fix & Stabilization](./phase-01-complete-bug-fix.md) | Pending | 28h | 34 (+PRE-A1) |
| 2 | [Architecture, Performance & Bundle](./phase-02-architecture-performance.md) | Pending | 12h | 14 |
| 3 | [UI Design System & Components](./phase-03-ui-design-system.md) | Pending | 22h | 19 |
| 4 | [UX Animations, Gamification & Polish](./phase-04-ux-animations-polish.md) | Pending | 18h | 25 |

## Dependencies

```
Phase 1 (bugs) → Phase 2 (arch+perf) → Phase 3 (UI) → Phase 4 (UX)
```

All sequential. Each phase builds on the previous.

## Issue Coverage Matrix

| ID | Description | Phase |
|----|-------------|-------|
| C1 | Role deletion orphans players | 1 |
| C2 | SkillSheet wizard resets mid-use | 1 |
| C3 | Timer interval leak | 1 |
| H1 | Multi-target undo broken | 1 |
| H2 | Night sound never stops | 1 |
| H3 | requestIdleCallback Safari crash | 1 |
| H4 | 5 failing tests | 1 |
| H5 | Dead source can execute actions | 1 |
| H6 | Bottom-sheet focus trap breaks | 1 |
| H7 | Bottom-sheet onClose focus-jump | 1 |
| H8 | 6 sheets always mounted (30 subs) | 1 |
| M1 | Custom roles order: 10 | 1 |
| M2 | _counter executionId collision | 1 |
| M3 | Player ID collision shrink-expand | 1 |
| M4 | actionMap defeats PlayerCard memo | 1 |
| M5 | (Intentional — no action) | — |
| M6 | handlePlayerCountChange no cleanup | 1 |
| M7 | SkillSheet ability name untranslated | 1 |
| M8 | GameState type missing timestamp | 1 |
| M9 | addAbility hardcodes "Kỹ năng" | 1 |
| M10 | Nightly abilities no per-night guard | 1 |
| M11 | executeAction empty targets | 1 |
| M12 | Timer overlay no escape | 1 |
| I1 | history-sheet hardcoded English | 1 |
| I2 | create-role-sheet hardcoded Vietnamese | 1 |
| I3 | role-library-sheet hardcoded English | 1 |
| I4 | main.tsx PWA prompt hardcoded | 1 |
| I5 | game-store addAbility hardcoded | 1 |
| P1 | Font render-blocking import | 2 |
| P2 | Font Awesome 1MB imported | 2 |
| P3 | PlayerConfig re-renders 30 inputs | 2 |
| P4 | HistorySheet not memoized | 2 |
| P5 | flipCard cascading re-render | 2 |
| P6 | Persist roleTemplates + unbounded history | 2 |
| P7 | Timer interval while paused | 2 |
| P8 | PlayerActionSheet hooks when hidden | 1 (H8) |
| P9 | nextNight O(P*R) + inline arrows | 2 |
| U1 | No player/role count warning | 4 |
| U2 | Dead players not distinguished in SkillSheet | 3 |
| U3 | No swipe-to-dismiss | 4 |
| U4 | No confirm before role deletion | 1 |
| U5 | (Resolved: min-h in Phase 3) | 3 |
| U6 | No keyboard shortcuts | 4 |
| U7 | targetCount 0 unresettable | 1 |
| U8 | PWA native confirm() | 4 |
| A1 | No localStorage version/migration | 2 |
| A2 | Custom templates accumulate | 2 |
| A3 | Duplicate uid() | 2 |
| A5 | default-roles.ts 921 lines | 2 |
| A6 | No corrupt storage recovery | 2 |
| A7 | Error boundary exposes stack | 2 |

## Deferred / Intentional

| ID | Reason |
|----|--------|
| M5 | Intentional design — limited actions persist for undo/tracking |
| A4 | Intentional — flippedCards excluded from persist (transient UI state) |

## Red Team Review

### Session — 2026-04-15
**Reviewers:** Security Adversary, Failure Mode Analyst, Assumption Destroyer
**Findings:** 15 (13 accepted/partial-accepted, 2 rejected)
**Severity breakdown:** 3 Critical, 6 High, 6 Medium (after dedup)

| # | Finding | Severity | Disposition | Applied To |
|---|---------|----------|-------------|------------|
| 1 | A1 storage versioning must precede data-mutating fixes | Critical | Accept | Phase 1 PRE-A1 (new) + Phase 2 A1 (expanded) |
| 2 | executionId fix incomplete (line 165 + type change + fallback) | Critical | Accept | Phase 1 M2 |
| 3 | Storage schema validation (Zod) | Critical | Reject | Over-engineering for local app |
| 4 | No rollback/branching strategy for Phase 3 | Critical | Partial Accept | Phase 3 MIGRATE — batch approach + QA checklist |
| 5 | H2 stale analysis — stopSound already exists | High | Accept | Phase 1 H2 |
| 6 | navigator.vibrate() crashes Safari | High | Accept | Phase 4 ANIM4 |
| 7 | Keyboard shortcut guards contradictory | High | Accept | Phase 4 U6 |
| 8 | H1 undo doesn't address status reversal | High | Accept | Phase 1 H1 scope clarification |
| 9 | M3 + M6 should consolidate to single cleanup fn | High | Accept | Phase 1 M3/M6 merged |
| 10 | M10 nightUsageMap redundant with abilityUsage | High | Accept | Phase 1 M10 uses existing mechanism |
| 11 | Swipe-to-dismiss vs scroll conflict | Medium | Accept | Phase 4 U3 |
| 12 | Sound continues on tab switch | Medium | Accept | Phase 1 H2 (visibilitychange) |
| 13 | Bottom sheet animation vs swipe race | Medium | Accept | Phase 4 U3 |
| 14 | actionLog growth unbounded | Medium | Accept | Phase 2 P6 |
| 15 | crypto.randomUUID() non-secure context fallback | Medium | Accept | Phase 1 M2 fallback chain |
| — | Time estimates too aggressive | Medium | Reject | Estimates are rough guidance, not commitments |

## Cook Command

```
/ck:cook --auto /home/hieubt/Documents/werewolf/plans/260415-113413-consolidated-bugfix-redesign
```
