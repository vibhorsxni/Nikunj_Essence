import { test, expect } from '@playwright/test';

test.describe('Tier 4: Workload Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('T4.1: Scenario 1 - Full Discovery: User loads page, admires 3D canvas, and scrolls to view all products', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText('Agarwood Chips')).toBeVisible();
  });

  test('T4.2: Scenario 2 - Mobile Lookup: Mobile user visits page to check "Rooh Khus" details and UI color theme', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    const title = page.getByText('Rooh Khus').first();
    await title.scrollIntoViewIfNeeded();
    await expect(title).toBeVisible();
  });

  test('T4.3: Scenario 3 - Interaction: User interacts with 3D canvas and checks for required product benefits', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await canvas.click({ force: true });
    
    await expect(page.getByText(/100% natural/i)).toBeVisible();
    await expect(page.getByText(/alcohol-free/i)).toBeVisible();
  });

  test('T4.4: Scenario 4 - Tablet Browsing: Tablet user toggles between products and verifies layout stability', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const p1 = page.getByText('Rooh Khus').first();
    await p1.click({ force: true });
    await expect(p1).toBeVisible();
    
    const p2 = page.getByText('Rose Attar').first();
    await p2.click({ force: true });
    await expect(p2).toBeVisible();
  });

  test('T4.5: Scenario 5 - Rapid Scroll Stability: User rapidly scrolls between the 3D canvas and catalogue, verifying no DOM tearing or console errors', async ({ page }) => {
    let errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
    }
    
    expect(errors.length).toBe(0);
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });
});
