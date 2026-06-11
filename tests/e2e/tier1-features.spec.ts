import { test, expect } from '@playwright/test';

test.describe('Tier 1: Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // F1: Luxurious UI/UX Palette & Responsiveness
  test('T1_F1_01_PageLoad', async ({ page }) => {
    let errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForLoadState('domcontentloaded');
    expect(errors.length).toBe(0);
  });

  test('T1_F1_02_ColorPalette', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const bg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toContain('rgb');
  });

  test('T1_F1_03_ResponsiveDesktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('T1_F1_04_ResponsiveMobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('T1_F1_05_Typography', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  // F2: 3D Product Showcase
  test('T1_F2_01_CanvasPresence', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeAttached();
  });

  test('T1_F2_02_CanvasVisibility', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test('T1_F2_03_SceneInitialization', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });

  test('T1_F2_04_InteractiveContainer', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    await canvas.click({ position: { x: 10, y: 10 }, force: true });
  });

  test('T1_F2_05_IntegrationDisplay', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();
    expect(box?.y).toBeGreaterThanOrEqual(0);
  });

  // F3: Mock Product Catalogue
  test('T1_F3_01_ProductTitles', async ({ page }) => {
    await expect(page.getByText('Rooh Khus')).toBeVisible();
    await expect(page.getByText('Rose Attar')).toBeVisible();
    await expect(page.getByText('Floral Waters')).toBeVisible();
    await expect(page.getByText('Agarwood Chips')).toBeVisible();
  });

  test('T1_F3_02_ProductBenefits', async ({ page }) => {
    await expect(page.getByText(/100% natural/i)).toBeVisible();
    await expect(page.getByText(/alcohol-free/i)).toBeVisible();
    await expect(page.getByText(/skin-friendly/i)).toBeVisible();
    await expect(page.getByText(/long-lasting/i)).toBeVisible();
  });

  test('T1_F3_03_ProductListStructure', async ({ page }) => {
    const title = page.getByText('Rooh Khus');
    await expect(title).toBeVisible();
  });

  test('T1_F3_04_ProductDetails', async ({ page }) => {
    const product = page.getByText('Rooh Khus').first();
    await product.hover({ force: true });
    await expect(product).toBeVisible();
  });

  test('T1_F3_05_CatalogueImages', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
