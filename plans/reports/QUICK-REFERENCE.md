# Quick Reference: Werewolf Zustand Store Tests

## Test Execution

```bash
# Run all store tests
npx vitest run src/store

# Run with verbose output
npx vitest run src/store --reporter=verbose

# Watch mode (auto-rerun on changes)
npx vitest watch src/store

# Run single test file
npx vitest run src/store/__tests__/game-store-actions.test.ts
```

## Results

```
✅ Test Files: 2 passed (2)
✅ Tests: 109 passed (109)
⏱️ Duration: 2.71s
```

## Test Files

| File                         | Tests | Focus                            |
| ---------------------------- | ----- | -------------------------------- |
| `game-store-actions.test.ts` | 43    | Pure functions (calculate state) |
| `game-store.test.ts`         | 66    | Zustand store API (actions)      |

## What's Tested

### Player Management ✅

- Create players (with IDs, names, defaults)
- Update player names
- Toggle player status (alive ↔ dead)
- Track status changes

### Role System ✅

- Add roles from templates
- Create custom roles
- Assign/unassign roles
- Change role order
- Delete roles
- Track role changes

### Game Actions ✅

- Execute actions (with ability usage)
- Undo actions (with conditional decrement)
- Progress nights (reset nightly abilities)
- Reset game (clear logs, reset players)

### State Persistence ✅

- Zustand persist middleware
- Partialize config (excludes UI state)
- State recovery

## Key Test Patterns

### Test Pure Functions

```typescript
const result = createInitialPlayers(5);
expect(result).toHaveLength(5);
```

### Test Store Actions

```typescript
const state = useGameStore.getState();
state.togglePlayerStatus(1);
expect(useGameStore.getState().players[0].alive).toBe(false);
```

### Test Log Tracking

```typescript
state.togglePlayerStatus(1);
expect(useGameStore.getState().statusChangeLog).toHaveLength(1);
```

## Configuration

**Vitest Config:** `vitest.config.ts`

- Environment: jsdom
- Globals: true
- Setup: src/test/setup.ts

**Setup File:** `src/test/setup.ts`

- Imports @testing-library/jest-dom
- Mock localStorage for persistence

## Common Issues & Solutions

### Tests Timeout

→ Increase timeout: `{ timeout: 10000 }`

### localStorage Undefined

→ Verified in setup.ts, should work in jsdom

### State Not Updating

→ Use `useGameStore.getState()` after actions

### Tests Fail in CI/CD

→ Ensure jsdom environment is set in vitest.config.ts

## Files Reference

**Source:**

- `src/store/game-store.ts` (323 lines)
- `src/store/game-store-actions.ts` (207 lines)

**Tests:**

- `src/store/__tests__/game-store-actions.test.ts` (533 lines)
- `src/store/__tests__/game-store.test.ts` (733 lines)

**Reports:**

- `plans/reports/TEST-SUMMARY.md` (comprehensive overview)
- `plans/reports/tester-260414-113211-game-store-vitest.md` (detailed analysis)

## Coverage Highlights

✅ 109 tests covering:

- 7 pure functions (game-store-actions)
- 20 store actions (game-store)
- Edge cases (boundary, error paths)
- State mutations (immutability verified)
- Persistence (partialize config)

## Next Steps

1. **Integrate into CI/CD** - Add test step to pipeline
2. **Monitor Performance** - Tests execute in <3s (acceptable)
3. **Expand Coverage** - Add snapshot/property-based tests as needed
4. **Review Failures** - No failures currently, investigate any regressions

---

**Last Run:** 2026-04-14 11:35:06 UTC  
**Status:** ✅ ALL PASSING  
**Framework:** Vitest 4.1.4
