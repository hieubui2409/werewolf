import { test, expect } from "@playwright/test";

test("setup screen renders correctly", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  // Wait for page to fully load
  await page.waitForLoadState("networkidle");

  // Verify title is visible (using English - browser detects English locale)
  const title = page.locator("h1:has-text('SETUP')");
  await expect(title).toBeVisible();

  // Verify player count label exists
  const playerCountLabel = page.locator("label:has-text('Player Count')");
  await expect(playerCountLabel).toBeVisible();

  // Verify roles section exists
  const rolesLabel = page.locator("h2:has-text('Roles')");
  await expect(rolesLabel).toBeVisible();
});

test("can interact with player count slider", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  // Find slider input for player count
  const slider = page.locator("input[type='range']");
  await expect(slider).toBeVisible();

  // Get initial value
  const initialValue = await slider.inputValue();
  expect(initialValue).toBeTruthy();

  // Interact with slider
  await slider.fill("6");
  const newValue = await slider.inputValue();
  expect(newValue).toBe("6");
});

test("can start game with roles", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  // Wait for page to fully load
  await page.waitForLoadState("networkidle");

  // Add a role from library
  const libraryBtn = page.locator("button:has-text('Library')");
  await libraryBtn.click();

  // Wait for library sheet to appear
  const librarySheet = page.locator("text=Werewolf");
  await expect(librarySheet).toBeVisible({ timeout: 5000 });

  // Click on first role (Werewolf)
  await page.locator("button:has-text('Werewolf')").first().click();

  // Close library
  await page.keyboard.press("Escape");

  // Start game button should be enabled
  const startBtn = page.locator("button:has-text('START GAME')");
  await expect(startBtn).toBeEnabled();

  // Click start game
  await startBtn.click();

  // Verify game screen appears - look for "Turn 1" or similar
  const gameTurn = page.locator("text=Turn");
  await expect(gameTurn).toBeVisible({ timeout: 5000 });
});

test("game screen has action buttons", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Add a role and start game
  const libraryBtn = page.locator("button:has-text('Library')");
  await libraryBtn.click();

  await page.locator("button:has-text('Werewolf')").first().click();
  await page.keyboard.press("Escape");

  const startBtn = page.locator("button:has-text('START GAME')");
  await startBtn.click();

  // Wait for game screen
  await expect(page.locator("text=Turn")).toBeVisible({ timeout: 5000 });

  // Verify action buttons
  const assignRoleBtn = page.locator("button:has-text('Assign Role')");
  await expect(assignRoleBtn).toBeVisible();

  const useSkillBtn = page.locator("button:has-text('Use Skill')");
  await expect(useSkillBtn).toBeVisible();
});

test("assign role sheet opens", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Setup: add role and start game
  const libraryBtn = page.locator("button:has-text('Library')");
  await libraryBtn.click();
  await page.locator("button:has-text('Werewolf')").first().click();
  await page.keyboard.press("Escape");

  const startBtn = page.locator("button:has-text('START GAME')");
  await startBtn.click();

  // Wait for game screen
  await expect(page.locator("text=Turn")).toBeVisible({ timeout: 5000 });

  // Click assign role button
  const assignRoleBtn = page.locator("button:has-text('Assign Role')");
  await assignRoleBtn.click();

  // Verify sheet appears - check for heading
  const sheetTitle = page.locator("h3:has-text('Assign Role')");
  await expect(sheetTitle).toBeVisible({ timeout: 5000 });
});

test("use skill sheet opens", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Setup: add role and start game
  const libraryBtn = page.locator("button:has-text('Library')");
  await libraryBtn.click();
  await page.locator("button:has-text('Werewolf')").first().click();
  await page.keyboard.press("Escape");

  const startBtn = page.locator("button:has-text('START GAME')");
  await startBtn.click();

  // Wait for game screen
  await expect(page.locator("text=Turn")).toBeVisible({ timeout: 5000 });

  // Click use skill button
  const useSkillBtn = page.locator("button:has-text('Use Skill')");
  await useSkillBtn.click();

  // Verify sheet appears - check for heading
  const sheetTitle = page.locator("h3:has-text('Use Skill')");
  await expect(sheetTitle).toBeVisible({ timeout: 5000 });
});

test("responsive layout on desktop", async ({ page }) => {
  // Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("http://localhost:4173/");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Verify title is visible
  const title = page.locator("h1:has-text('SETUP')");
  await expect(title).toBeVisible();

  // Verify 2-column layout indicators
  const playerCountLabel = page.locator("label:has-text('Player Count')");
  const rolesLabel = page.locator("h2:has-text('Roles')");

  // Both should be visible in 2-column layout
  await expect(playerCountLabel).toBeVisible();
  await expect(rolesLabel).toBeVisible();
});

test("responsive layout on tablet", async ({ page }) => {
  // Set tablet viewport
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("http://localhost:4173/");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Verify content is still accessible
  const title = page.locator("h1:has-text('SETUP')");
  await expect(title).toBeVisible();

  const rolesLabel = page.locator("h2:has-text('Roles')");
  await expect(rolesLabel).toBeVisible();
});

test("responsive layout on mobile", async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("http://localhost:4173/");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Verify title is visible
  const title = page.locator("h1:has-text('SETUP')");
  await expect(title).toBeVisible();

  // Verify content scrolls properly
  const rolesLabel = page.locator("h2:has-text('Roles')");
  await expect(rolesLabel).toBeVisible();
});
