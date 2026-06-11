# Analysis: E2E Tier 1 Tests

## Observation
1. In `tests/e2e/tier1-features.spec.ts`:
   - `T1_F3_01_ProductTitles` expects the presence of the exact texts: 'Rooh Khus', 'Rose Attar', 'Floral Waters', and 'Agarwood Chips'.
   - `T1_F3_02_ProductBenefits` expects case-insensitive regex matches for `/100% natural/i`, `/alcohol-free/i`, `/skin-friendly/i`, and `/long-lasting/i`.
   - Other tests check for general elements such as the `h1`, `body` background colors, responsive dimensions, and `canvas` visibility, which are already present.

2. In `src/App.tsx`:
   - The `products` array only contains 'Rooh Khus', 'Rose Attar', and 'Sandalwood Logs'. It is missing 'Floral Waters' and 'Agarwood Chips'.
   - The `features` array and text within descriptions lack hyphens for certain required regex patterns. It currently says:
     - `title: "Skin Friendly"` instead of `title: "Skin-friendly"`
     - `desc: "Alcohol free & safe..."` instead of `desc: "Alcohol-free & safe..."`
     - `title: "Long Lasting"` instead of `title: "Long-lasting"`

## Logic Chain
- To pass `T1_F3_01_ProductTitles`, we must ensure all four product titles are present in the UI. We will update the `products` array to include 'Floral Waters' and 'Agarwood Chips' (either adding them or replacing 'Sandalwood Logs').
- To pass `T1_F3_02_ProductBenefits`, we must ensure the exact text content matches the required regexes (which explicitly include hyphens). We will update the `features` array titles and descriptions to include these hyphens.

## Caveats
- I did not execute the code, so there's a small chance of console errors during 3D model initialization causing `T1_F1_01_PageLoad` to fail, though statically the `App.tsx` code looks correct and standard for React Three Fiber.
- `T1_F3_04_ProductDetails` tests hovering over the 'Rooh Khus' product. `App.tsx` conditionally renders description text on click (`onClick={() => setActiveProduct(idx)}`), not hover. However, the test only hovers the title and checks if the title itself is visible (`await expect(product).toBeVisible()`). Since titles are always visible, this should pass as-is.

## Conclusion
The Tier 1 E2E tests will fail due to missing product entries and missing hyphens in the benefits text. We need to update the `products` and `features` arrays in `src/App.tsx` to align exactly with what the Playwright tests assert.

## Verification Method
1. Modify `src/App.tsx` to include the correct product names ('Floral Waters', 'Agarwood Chips') and hyphenated feature text ('Skin-friendly', 'Alcohol-free', 'Long-lasting').
2. Run `npx playwright test tests/e2e/tier1-features.spec.ts` and verify all tests pass.
