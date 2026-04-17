# Post-Review Planning Session Completed

**Date**: 2026-04-17 10:45
**Severity**: High
**Component**: Project Planning, Architecture
**Status**: Resolved

## What Happened

Created comprehensive 3-phase implementation plan following 10-agent code review (3 waves) that identified 1 critical data-loss bug and 19 high/medium severity issues. Red-team validation found and resolved 4 critical architectural blockers before planning concluded. Plan finalized at 48 hours total effort (+20% from initial estimate).

## Technical Decisions Made

1. **State Persistence**: Persist ALL roleTemplates with version-based merge strategy for safe migration recovery
2. **Usage Rebuild**: Reconstruct abilityUsage from scratch in nextNight() rather than spreading stale state
3. **Dead-Source Execution**: Implement canExecute selector + force flag (bypasses ONLY dead_source check, not usage limits)
4. **Undo/Redo**: Diff-based snapshots instead of full state overwrites to prevent undoStack corruption and stale turnAdded
5. **Mute Synchronization**: Zustand subscribe() listener for syncing mute state across windows (eliminates module-level shadow state)

## Critical Blockers Resolved

- **C1**: Infinite reload loop (migrate() returns null, onRehydrate auto-resets) → Solution: Return clean initial state + sessionStorage guard
- **C3**: Undo/redo snapshot overwrites undoStack → Solution: Diff-based snapshots, preserve undoStack, re-increment exact usage counts
- **E5**: nextNight() doesn't clear undo/redo stacks → Solution: Clear both stacks explicitly
- **E6**: Dead-source confirm unreachable (selectAbility filters alive) → Solution: Remove alive filter, let canExecute gate execution

## Plan Structure

```
Phase 1: Bug Fixes & Issues (16h, 19 items)
├── BUG-01: roleTemplates data loss migration
├── BUG-02: Cascade delete integrity
├── BUG-03: Stale abilityUsage
├── i18n: 21 missing keys
├── Schema validation
└── ... 14 additional items

Phase 2: New Features & UX (18h, 6 features)
├── Dead-source confirm dialog
├── Undo/redo history stack
├── D/J keyboard shortcuts
├── Timer flash/vibrate feedback
├── Sheet exit animation
└── Timer mute

Phase 3: Full E2E Rewrite (14h, 46 test cases)
└── Replace broken Playwright suite
```

Plan directory: `/home/hieubt/Documents/werewolf/plans/260417-102220-post-review-bugfix-features-e2e/`

## Why This Matters

The roleTemplates data-loss bug was catastrophic — player roles disappearing mid-game. The undo/redo architecture had multiple snapshot corruption vectors that could corrupt game state during rollback. Dead-source execution was unreachable, making the feature unusable. Fixing these requires precise architectural changes to prevent regressions. The 20% time buffer accounts for integration risk and E2E test complexity.

## Next Steps

1. **Immediate**: Begin Phase 1 (Bug Fixes) — BUG-01 migration is blocker for phases 2-3
2. **Validation**: Execute red-team test cases during implementation to verify blocker fixes
3. **Integration**: Coordinate undo/redo snapshot changes with dead-source force flag
4. **Testing**: Phase 3 E2E rewrite covers all bugfixes and features
