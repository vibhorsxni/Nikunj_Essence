# Handoff Report: E2E Testing Strategy for Tier 1 & Tier 2

## 1. Observation
- **`TEST_INFRA.md`** specifies 3 features to be tested:
  - F1: Luxurious UI/UX Palette & Responsiveness (R1)
  - F2: 3D Product Showcase (Canvas Render) (R2)
  - F3: Mock Product Catalogue (Content Check) (R3)
- **Coverage Thresholds** require ≥5 tests per feature for Tier 1 and ≥5 tests per feature for Tier 2 (boundary cases).
- **Test Architecture** specifies Node.js, Playwright, targeting a local Vite server at `http://localhost:5173`.
- **`ORIGINAL_REQUEST.md`** details specific aesthetic choices (dark green and gold palette), product names ("Rooh Khus", "Rose Attar", "Floral Waters", "Agarwood Chips"), and product benefits (100% natural, alcohol-free, skin-friendly, long-lasting).

## 2. Logic Chain
- To meet the ≥5 tests per feature criteria, a total of 15 tests are needed for Tier 1 and 15 tests for Tier 2.
- **Tier 1 (Feature Coverage)** must assert the primary functionalities: checking for the presence of the required colors, typography, the `<canvas>` element for the 3D showcase, and the specific text strings for products and benefits.
- **Tier 2 (Boundary Cases)** must stretch the limits: viewport resizing (mobile vs ultrawide), missing WebGL context, long text strings in product names, and accessibility/keyboard navigation.
- The **Setup Strategy** should align with standard Playwright conventions, utilizing `test.beforeEach` to navigate to the application and a `playwright.config.ts` configured with `webServer` for Vite.

## 3. Caveats
- The actual element selectors (e.g., `#product-list`, `.canvas-container`) will depend on the final implementation since this is opaque-box testing. The proposed tests assume generic Playwright locators (e.g., `page.getByText()`, `page.locator('canvas')`).
- If procedural CSS is used as a fallback for the 3D showcase, the `<canvas>` locator might need to be adjusted to a different container element.

## 4. Conclusion
We will implement 30 exact test cases in two files as specified by the test architecture (`tests/e2e/tier1-features.spec.ts` and `tests/e2e/tier2-boundary.spec.ts`).

### Setup Strategy
1. **Runner Configuration (`playwright.config.ts`)**:
   - `webServer` block pointing to `npm run dev` with `port: 5173`.
   - `baseURL: 'http://localhost:5173'`.
2. **Test Files**:
   - Include `page.on('pageerror')` and `page.on('console')` listeners to ensure zero browser console errors (per AC).
   - Use `test.beforeEach(async ({ page }) => { await page.goto('/'); })`.

### Proposed Test Cases

#### `tests/e2e/tier1-features.spec.ts`
**F1: Luxurious UI/UX Palette & Responsiveness**
1. `T1_F1_01_PageLoad`: Verifies the application loads successfully without console errors.
2. `T1_F1_02_ColorPalette`: Verifies the presence of the dark green and gold color palette in computed styles of main layout elements.
3. `T1_F1_03_ResponsiveDesktop`: Verifies the layout renders correctly and elements are visible on a desktop viewport (1920x1080).
4. `T1_F1_04_ResponsiveMobile`: Verifies the layout adapts gracefully on a mobile viewport (375x667), confirming mobile menus/grids.
5. `T1_F1_05_Typography`: Verifies that typography elements use the correct fonts and do not overlap.

**F2: 3D Product Showcase**
6. `T1_F2_01_CanvasPresence`: Verifies that the 3D `<canvas>` element (or equivalent container) is rendered in the DOM.
7. `T1_F2_02_CanvasVisibility`: Verifies that the 3D showcase is visible and occupies meaningful viewport dimensions.
8. `T1_F2_03_SceneInitialization`: Verifies the 3D scene finishes loading without throwing context errors.
9. `T1_F2_04_InteractiveContainer`: Verifies the 3D container can receive interaction events (e.g., mouse pointer/touch).
10. `T1_F2_05_IntegrationDisplay`: Verifies the 3D showcase is correctly positioned relative to other UI components (e.g., below hero banner).

**F3: Mock Product Catalogue**
11. `T1_F3_01_ProductTitles`: Verifies required product titles ("Rooh Khus", "Rose Attar", "Floral Waters", "Agarwood Chips") are in the DOM.
12. `T1_F3_02_ProductBenefits`: Verifies required benefits ("100% natural", "alcohol-free", "skin-friendly", "long-lasting") are displayed.
13. `T1_F3_03_ProductListStructure`: Verifies the product catalogue is rendered as a list or grid with multiple items.
14. `T1_F3_04_ProductDetails`: Verifies that products display mock pricing or detailed descriptions when hovered/focused.
15. `T1_F3_05_CatalogueImages`: Verifies placeholder/mock images for the products exist and have valid `alt` attributes.

#### `tests/e2e/tier2-boundary.spec.ts`
**F1: Luxurious UI/UX (Boundary)**
1. `T2_F1_01_ExtremeViewportSmall`: Verifies UI does not have horizontal scrolling/overflow on tiny devices (320px width).
2. `T2_F1_02_ExtremeViewportLarge`: Verifies UI content is centered or scales correctly on ultrawide monitors (2560px width).
3. `T2_F1_03_HighDPI`: Verifies sharp rendering by simulating a High DPI (deviceScaleFactor > 2) screen.
4. `T2_F1_04_OrientationChange`: Verifies layout adapts without breaking when switching mobile from portrait to landscape.
5. `T2_F1_05_NoJS_Fallback`: Verifies the site provides basic content or a graceful error message if JavaScript is disabled.

**F2: 3D Product Showcase (Boundary)**
6. `T2_F2_01_CanvasResize`: Verifies the `<canvas>` resizes correctly (maintains aspect ratio) when the browser window is resized rapidly.
7. `T2_F2_02_WebGLDisabled`: Verifies application behavior/fallback when WebGL is disabled or not supported in the browser.
8. `T2_F2_03_ContextLost`: Verifies the application handles the `webglcontextlost` event gracefully without locking up the UI.
9. `T2_F2_04_ScrollPerformance`: Verifies the page remains scrollable while the 3D canvas is rendering.
10. `T2_F2_05_OffscreenPausing`: Verifies resource usage degrades (or 3D container is hidden/paused) if scrolled completely out of view.

**F3: Mock Product Catalogue (Boundary)**
11. `T2_F3_01_LongProductNames`: Verifies the UI layout does not break if a product name is exceptionally long (text wrapping).
12. `T2_F3_02_MissingImages`: Verifies the catalogue handles missing/broken image links gracefully (e.g., displaying a fallback shape).
13. `T2_F3_03_RapidInteraction`: Verifies the UI doesn't break when rapidly clicking/tabbing through product items.
14. `T2_F3_04_KeyboardNavigation`: Verifies the entire product catalogue can be accessed and traversed using only the keyboard (`Tab`, `Enter`).
15. `T2_F3_05_ScreenReaderA11y`: Verifies that key catalogue items have appropriate ARIA labels and structure.

## 5. Verification Method
- **Method:** Write the defined tests into `tests/e2e/tier1-features.spec.ts` and `tests/e2e/tier2-boundary.spec.ts`.
- **Command:** Execute `npx playwright test --project=chromium` (or similar) once the frontend is built.
- **Success Criteria:** Playwright output shows 30 passing tests aligned exactly with the names proposed above.
