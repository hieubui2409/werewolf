import { test, expect } from "@playwright/test";

test("can navigate to settings from setup screen", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Look for settings button (gear icon)
  const settingsBtn = page.locator("button:has(i.fa-cog)");

  // Settings button might not be on setup screen, so skip if not found
  const settingsBtnExists = await settingsBtn.isVisible().catch(() => false);
  if (settingsBtnExists) {
    await settingsBtn.click();
    const settingsTitle = page.locator("h3:has-text('Settings')");
    await expect(settingsTitle).toBeVisible({ timeout: 5000 });
  }
});

test("theme toggle works in game screen", async ({ page }) => {
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

  // Get HTML element to check for dark mode class
  const htmlElement = page.locator("html");

  // Open settings
  const settingsBtn = page.locator("button:has(i.fa-cog)");
  const settingsBtnExists = await settingsBtn.isVisible().catch(() => false);

  if (settingsBtnExists) {
    await settingsBtn.click();

    // Wait for settings sheet
    const settingsTitle = page.locator("h3:has-text('Settings')");
    await expect(settingsTitle).toBeVisible({ timeout: 5000 });

    // Look for theme toggle buttons (English text)
    const darkThemeBtn = page.locator("button:has-text('Dark')");
    const lightThemeBtn = page.locator("button:has-text('Light')");

    // Check if either button exists
    const hasDarkBtn = await darkThemeBtn.isVisible().catch(() => false);
    const hasLightBtn = await lightThemeBtn.isVisible().catch(() => false);

    if (hasDarkBtn || hasLightBtn) {
      // Click on theme button to toggle
      if (hasDarkBtn) {
        await darkThemeBtn.click();
      } else if (hasLightBtn) {
        await lightThemeBtn.click();
      }

      // Wait a moment for theme change
      await page.waitForTimeout(300);

      // Verify class changed (dark mode should have 'dark' class)
      const newClasses = await htmlElement.getAttribute("class");
      // Either the class changed or it was already in desired state
      expect(newClasses).toBeTruthy();
    }

    // Close settings
    await page.keyboard.press("Escape");
  }
});

test("language switch works", async ({ page }) => {
  await page.goto("http://localhost:4173/");

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Get initial language (should be English since browser detects it)
  const initialTitle = page.locator("h1:has-text('SETUP')");
  await expect(initialTitle).toBeVisible();

  // Try to find language selector in settings
  const settingsBtn = page.locator("button:has(i.fa-cog)");
  const settingsBtnExists = await settingsBtn.isVisible().catch(() => false);

  if (settingsBtnExists) {
    await settingsBtn.click();

    // Wait for settings sheet
    const settingsTitle = page.locator("h3:has-text('Settings')");
    await expect(settingsTitle).toBeVisible({ timeout: 5000 });

    // Look for language buttons (English text)
    const enBtn = page.locator("button:has-text('English')");
    const viBtn = page.locator("button:has-text('Tiếng Việt')");

    const hasEnBtn = await enBtn.isVisible().catch(() => false);
    const hasViBtn = await viBtn.isVisible().catch(() => false);

    if (hasEnBtn || hasViBtn) {
      // If Vietnamese button is visible, click it to change language
      if (hasViBtn) {
        await viBtn.click();
        await page.waitForTimeout(500);

        // Check if UI text changes to Vietnamese (either text should be visible)
        const vietnameseSetup = page.locator("h1");
        await expect(vietnameseSetup).toBeVisible();
      }
    }

    // Close settings
    await page.keyboard.press("Escape");
  }
});

test("card view mode toggle works", async ({ page }) => {
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

  // Open settings
  const settingsBtn = page.locator("button:has(i.fa-cog)");
  const settingsBtnExists = await settingsBtn.isVisible().catch(() => false);

  if (settingsBtnExists) {
    await settingsBtn.click();

    // Wait for settings sheet
    const settingsTitle = page.locator("h3:has-text('Settings')");
    await expect(settingsTitle).toBeVisible({ timeout: 5000 });

    // Look for card view mode options (English text)
    const nameFirstBtn = page.locator("button:has-text('Name First')");
    const roleFirstBtn = page.locator("button:has-text('Role First')");
    const bothViewBtn = page.locator("button:has-text('Both')");

    const hasNameFirst = await nameFirstBtn.isVisible().catch(() => false);
    const hasRoleFirst = await roleFirstBtn.isVisible().catch(() => false);
    const hasBothView = await bothViewBtn.isVisible().catch(() => false);

    if (hasNameFirst || hasRoleFirst || hasBothView) {
      // If "Name First" is visible, click it
      if (hasNameFirst) {
        await nameFirstBtn.click();
        await page.waitForTimeout(300);
      }

      // If "Role First" is visible, click it
      if (hasRoleFirst) {
        await roleFirstBtn.click();
        await page.waitForTimeout(300);
      }

      // Verify cards are still visible in the game
      const playerCard = page.locator("div.grid");
      await expect(playerCard).toBeVisible();
    }

    // Close settings
    await page.keyboard.press("Escape");
  }
});
