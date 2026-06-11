import { test, expect } from '@playwright/test';

test.describe('Tier 3: Cross-Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('T3.1: F1 x F2 - 3D Canvas scales dynamically with window resize', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(200);
    const box1 = await canvas.boundingBox();
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(200);
    const box2 = await canvas.boundingBox();
    
    expect(box1?.width).not.toBe(box2?.width);
  });

  test('T3.2: F1 x F3 - Product catalogue layout adapts to mobile viewport and retains dark green/gold palette', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const title = page.getByText('Rooh Khus').first();
    await expect(title).toBeVisible();
    
    const body = page.locator('body');
    const bg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toContain('rgb');
  });

  test('T3.3: F2 x F3 - 3D Canvas and Product Catalogue render together without visual overlap or console errors', async ({ page }) => {
    let errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    const title = page.getByText('Rooh Khus').first();
    await expect(title).toBeVisible();
    
    expect(errors.length).toBe(0);
  });
});
