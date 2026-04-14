---
phase: 9
status: pending
priority: medium
effort: large
---

# Phase 9: Testing

<!-- Created: Validation Session 1 - Dedicated testing phase with Vitest + RTL + Playwright -->

## Overview

Comprehensive testing: Zustand store unit tests, component integration tests with RTL, end-to-end game flow tests with Playwright.

## Test Stack

- **Vitest** — unit + integration test runner (native Vite)
- **React Testing Library (RTL)** — component rendering + interaction
- **@testing-library/user-event** — realistic user interactions
- **Playwright** — browser E2E tests

## Files to Create

### 1. Unit Tests: Zustand Store (`src/store/__tests__/game-store.test.ts` ~150 lines)

Test all store actions in isolation:

```typescript
describe("GameStore", () => {
  beforeEach(() => {
    // Reset store to initial state
  });

  describe("Player actions", () => {
    test("handlePlayerCountChange grows player array");
    test("handlePlayerCountChange shrinks player array, preserves names");
    test("updatePlayerName updates correct player");
    test("togglePlayerStatus kills alive player");
    test("togglePlayerStatus revives dead player");
  });

  describe("Role actions", () => {
    test("addRoleFromTemplate creates GameRole with unique ID");
    test("createCustomRole validates max 5 abilities");
    test("createCustomRole rejects empty name");
    test("createCustomRole rejects empty ability names");
    test("updateRoleName updates correct role");
    test("changeRoleOrder reorders correctly");
    test("deleteRole removes role and unassigns players");
    test("addAbility adds to correct role");
    test("addAbility blocked when role has 5 abilities");
    test("updateAbility updates correct ability field");
    test("deleteAbility removes from correct role");
  });

  describe("Role assignment", () => {
    test("togglePlayerRole assigns role to unassigned player");
    test("togglePlayerRole unassigns role from assigned player");
    test("togglePlayerRole logs role change");
  });

  describe("Game actions", () => {
    test("executeAction creates action log entry");
    test("executeAction increments ability usage");
    test("executeAction respects ability max limit");
    test("undoAction removes log entry");
    test("undoAction decrements ability usage");
  });

  describe("Turn management", () => {
    test("nextNight saves current logs to history");
    test("nextNight resets nightly ability usage");
    test("nextNight increments nightCount");
    test("nextNight clears current turn logs");
    test("resetGame resets all state to initial");
  });

  describe("Persistence", () => {
    test("state persists to localStorage via Zustand persist");
    test("state loads from localStorage on init");
    test("flippedCards NOT persisted (excluded via partialize)");
  });
});
```

### 2. Selector Tests (`src/store/__tests__/selectors.test.ts` ~50 lines)

```typescript
describe("Selectors", () => {
  test("useRoleMap returns Map with O(1) lookup");
  test("usePlayerActionMap groups actions by targetId");
  test("useSortedRoles sorts by order");
  test("useSortedPlayers sorts by role order, then by id");
});
```

### 3. Component Integration Tests (~100 lines total)

`src/components/common/__tests__/bottom-sheet.test.tsx`:

```typescript
test("renders when isOpen is true");
test("does not render when isOpen is false");
test("calls onClose when overlay clicked");
test("calls onClose when Escape pressed");
test("traps focus within sheet");
test("has correct ARIA attributes");
```

`src/components/setup/__tests__/player-config.test.tsx`:

```typescript
test("renders correct number of name inputs");
test("slider changes player count");
test("name input updates player name");
```

`src/components/game/__tests__/player-card.test.tsx`:

```typescript
test("renders player name on front face");
test("flips on click");
test("shows role on back face when flipped");
test("shows dead overlay when player not alive");
test("displays faction-colored border");
```

### 4. Playwright E2E Tests (`e2e/` ~100 lines total)

`e2e/game-flow.spec.ts`:

```typescript
test.describe("Full game flow", () => {
  test("setup → start game → assign roles → use skill → next night", async ({
    page,
  }) => {
    await page.goto("/");

    // Setup screen
    await expect(page.getByText("THIẾT LẬP")).toBeVisible();

    // Change player count
    const slider = page.getByRole("slider");
    await slider.fill("8");

    // Start game
    await page.getByText("BẮT ĐẦU GAME").click();

    // Game screen visible
    await expect(page.getByText("Turn 1")).toBeVisible();

    // Assign role
    await page.getByText("Gán Role").click();
    // ... assign flow

    // Use skill
    await page.getByText("Dùng Chiêu").click();
    // ... skill wizard flow

    // Next night
    // ... confirm dialog
  });

  test("dark/light theme toggle persists", async ({ page }) => {
    await page.goto("/");
    // Toggle theme in settings
    // Verify CSS class changes
    // Reload and verify persists
  });

  test("PWA installable", async ({ page }) => {
    await page.goto("/");
    // Check manifest
    // Check service worker registered
  });

  test("responsive layout switches on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    // Verify sidebar layout visible
  });
});
```

`e2e/accessibility.spec.ts`:

```typescript
test.describe("Accessibility", () => {
  test("keyboard navigation through setup flow", async ({ page }) => {
    await page.goto("/");
    // Tab through all interactive elements
    // Verify focus order
    // Verify ARIA labels announced
  });

  test("keyboard navigation through game flow", async ({ page }) => {
    // ... game screen keyboard nav
  });
});
```

## npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Success Criteria

- `npm run test:run` → all unit + integration tests pass
- `npm run test:e2e` → all Playwright E2E tests pass
- Code coverage ≥70% for store logic
- No accessibility violations in E2E keyboard tests
- Tests run in CI (Cloudflare Pages build or GitHub Actions)
