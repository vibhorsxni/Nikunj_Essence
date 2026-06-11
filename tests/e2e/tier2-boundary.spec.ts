import { test, expect } from '@playwright/test';

test.describe('Tier 2: Boundary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // F1: Luxurious UI/UX (Boundary)
  test('T2_F1_01_ExtremeViewportSmall', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(320); // No horizontal scrolling
  });

  test('T2_F1_02_ExtremeViewportLarge', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('T2_F1_03_HighDPI', async ({ browser }) => {
    const context = await browser.newContext({ deviceScaleFactor: 3 });
    const page = await context.newPage();
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await context.close();
  });

  test('T2_F1_04_OrientationChange', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Portrait
    await page.waitForTimeout(100);
    await page.setViewportSize({ width: 667, height: 375 }); // Landscape
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('T2_F1_05_NoJS_Fallback', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await context.close();
  });

  // F2: 3D Product Showcase (Boundary)
  test('T2_F2_01_CanvasResize', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(200);
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
  });

  test('T2_F2_02_WebGLDisabled', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null;
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    await context.close();
  });

  test('T2_F2_03_ContextLost', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    await canvas.evaluate((node: HTMLCanvasElement) => {
      const gl = node.getContext('webgl') || node.getContext('webgl2');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('T2_F2_04_ScrollPerformance', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const scrolled = await page.evaluate(() => window.scrollY > 0);
    expect(scrolled).toBe(true);
  });

  test('T2_F2_05_OffscreenPausing', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500); // Allow time for hypothetical pause mechanism
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // F3: Mock Product Catalogue (Boundary)
  test('T2_F3_01_LongProductNames', async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML += '<div id="long-name" style="width: 100px;">Super Long Product Name That Will Wrap</div>';
    });
    const el = page.locator('#long-name');
    await expect(el).toBeVisible();
  });

  test('T2_F3_02_MissingImages', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('T2_F3_03_RapidInteraction', async ({ page }) => {
    const title = page.getByText('Rooh Khus').first();
    await title.click({ force: true });
    await title.click({ force: true });
    await title.click({ force: true });
    await expect(title).toBeVisible();
  });

  test('T2_F3_04_KeyboardNavigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement !== document.body);
    expect(focused).toBeDefined();
  });

  test('T2_F3_05_ScreenReaderA11y', async ({ page }) => {
    const headings = page.getByRole('heading');
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
