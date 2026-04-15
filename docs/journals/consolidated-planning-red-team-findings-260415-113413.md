# Consolidated Planning Session: Red Team Uncovered Migration Ordering Catastrophe

**Date**: 2026-04-15 11:34
**Severity**: High
**Component**: Plan architecture, localStorage migration, Phase sequencing
**Status**: Resolved with restructure

## What Happened

Merged two conflicting source reports (code audit + UI redesign) into a single 4-phase prioritized plan. Initial 6-phase proposal rejected outright by user with sharp feedback: "Phase 1 must fix ALL bugs. Everything must be included." Restructured to 4 phases with complete Issue Coverage Matrix. Then ran hostile red team review (Security Adversary, Failure Mode Analyst, Assumption Destroyer) that surfaced 15 deduped findings, 13 of which were accepted and integrated.

## The Brutal Truth

The red team caught something we almost shipped broken: **Phase 1 had data-mutating bug fixes, but localStorage versioning migration was in Phase 2**. Classic ordering catastrophe. Users run Phase 1 code against old schema, data corruption happens silently, Phase 2 migration tries to clean up incompatible state. The kind of bug that gets discovered in production by your most important customer.

There's also frustration embedded in this: initial user rejection felt harsh in the moment, but was _exactly right_. The plan was overcomplicating the problem by deferring critical fixes to later phases. That's on poor initial analysis.

## Technical Details

Three critical red team catches that made it into the plan:

1. **A1 Migration Ordering Fix**: Moved versioning to Phase 1 PRE-A1 step as no-op version marker. Phase 2 extends logic with actual migration. Prevents data schema mismatch.

2. **H2 Audio Regression**: Initial fix assumed stopSound was missing entirely. Red team noted `sounds.ts` already had the function. Rewrote to verify existing + add missing `stopAllSounds` + wire `visibilitychange` handler for tab hide/show.

3. **M10 Redundant State**: `nightUsageMap` would duplicate existing `abilityUsage` reset logic. Instead of new state, extended guards in `executeAction` for nightly-type abilities. Keeps reducer surface smaller.

Phase 3 color system migration changed from single big-bang grep-replace to 4-batch sequence (structural → text → faction → semantic) with per-batch QA checklist. Reduces blast radius, allows rollback per batch.

## Lessons Learned

- **Red team value**: Hostile reviews surfaced deeper structural issues (ordering dependencies, schema versioning) that standard code review misses. Worth the time investment.
- **User feedback as reset**: Sharp rejection wasn't dismissal — it was clarity. "All bugs in Phase 1" forced us to actually solve the problem instead of deferring complexity.
- **Migration ordering is brittle**: Whenever data-mutating code precedes its own migration, you're building a trap. Must sequence explicitly: version marker → data transform → feature code.
- **Assumption documentation matters**: Plan now includes "Why Phase X before Phase Y" rationale. Makes future reordering obviously dangerous.

## Next Steps

1. Implementation begins with Phase 1 (34 bugs + A1 migration PRE-step)
2. Per-phase QA checklist for Phase 3 color batches must be created before implementation
3. Rollback strategy for Phase 3: maintain pre-batch color snapshot for quick revert if QA failures

**File**: `/home/hieubt/Documents/werewolf/plans/260415-113413-consolidated-bugfix-redesign/plan.md`
