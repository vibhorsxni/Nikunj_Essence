# Tier 3 and Tier 4 E2E Test Strategy Analysis

## 1. Observation
- `TEST_INFRA.md` defines three features: F1 (Luxurious UI/UX & Responsiveness), F2 (3D Product Showcase Canvas), and F3 (Mock Product Catalogue).
- Tier 3 requires "pairwise coverage of major feature interactions" in `tests/e2e/tier3-cross.spec.ts`.
- Tier 4 requires "≥5 realistic application scenarios" in `tests/e2e/tier4-workload.spec.ts`.
- `TEST_INFRA.md` currently lists only 3 scenarios for Tier 4.
- `ORIGINAL_REQUEST.md` specifies UI details for F1 (dark green/gold palette, responsive), F2 (3D canvas), and F3 (products like "Rooh Khus", and benefits like 100% natural, alcohol-free).
- The test runner is Playwright targeting `http://localhost:5173`.

## 2. Logic Chain
- **Tier 3 (Pairwise):** We need to cover pairs (F1xF2, F1xF3, F2xF3).
  - *F1xF2 (Responsiveness x 3D Canvas):* Ensure the 3D canvas resizes correctly when the viewport changes, preserving the luxurious aesthetic without breaking the layout.
  - *F1xF3 (Responsiveness x Catalogue):* Ensure the mock catalogue reflows correctly (e.g., to a single column on mobile) and that the dark green/gold palette remains applied.
  - *F2xF3 (3D Canvas x Catalogue):* Ensure the 3D canvas and the product catalogue are both rendered completely in the same flow, and verify any potential synchronization (e.g., scrolling to the catalogue doesn't break the canvas render).
- **Tier 4 (Workload/Scenarios):** We must expand the 3 existing scenarios to at least 5 to meet the coverage threshold.
  - Scenario 1, 2, and 3 are pre-defined. 
  - *Scenario 4 (New):* Tablet user browses multiple products to ensure responsive intermediate layouts work and benefits are visible.
  - *Scenario 5 (New):* Rapid scroll from 3D hero section to catalogue to test performance and stability of animations and the 3D context.

## 3. Caveats
- Since the implementation design is opaque, we do not know if selecting a product updates the 3D canvas. The F2xF3 pairwise test assumes they at least coexist on the page. If they interact, the test should verify the canvas update.
- Performance testing in Playwright (Scenario 5) is heuristic; we can only verify that no errors are thrown and elements remain visible after rapid scrolling, rather than measuring exact framerates.

## 4. Conclusion
**Setup Strategy:**
- Use Playwright's `test.beforeEach` block to navigate to `http://localhost:5173` and wait for `.domcontentloaded` and the `<canvas>` element to be visible.
- Use Playwright's device emulation (e.g., `devices['Pixel 5']`, `devices['iPad Pro']`) for responsive scenarios.
- Do not mock backend API calls since F3 explicitly requires a *mock* product catalogue on the frontend.

**Proposed Test Cases for `tests/e2e/tier3-cross.spec.ts`:**
1. `T3.1: F1 x F2 - 3D Canvas scales dynamically with window resize`
2. `T3.2: F1 x F3 - Product catalogue layout adapts to mobile viewport and retains dark green/gold palette`
3. `T3.3: F2 x F3 - 3D Canvas and Product Catalogue render together without visual overlap or console errors`

**Proposed Test Cases for `tests/e2e/tier4-workload.spec.ts`:**
1. `T4.1: Scenario 1 - Full Discovery: User loads page, admires 3D canvas, and scrolls to view all products`
2. `T4.2: Scenario 2 - Mobile Lookup: Mobile user visits page to check "Rooh Khus" details and UI color theme`
3. `T4.3: Scenario 3 - Interaction: User interacts with 3D canvas and checks for required product benefits`
4. `T4.4: Scenario 4 - Tablet Browsing: Tablet user toggles between products and verifies layout stability`
5. `T4.5: Scenario 5 - Rapid Scroll Stability: User rapidly scrolls between the 3D canvas and catalogue, verifying no DOM tearing or console errors`

## 5. Verification Method
- Ensure the Playwright config is set up.
- Create the proposed files: `tests/e2e/tier3-cross.spec.ts` and `tests/e2e/tier4-workload.spec.ts`.
- Run `npx playwright test tests/e2e/tier3-cross.spec.ts tests/e2e/tier4-workload.spec.ts`.
- The conclusion is valid if the proposed test cases cover all defined pairwise permutations and provide the required 5 scenarios.
