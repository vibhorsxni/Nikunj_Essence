# Analysis Report: Tier 1 Features

## Observation
1. **Console Errors on Load**: `T1_F1_01_PageLoad` checks for `console.error`. The `App.tsx` has a `<Text>` component from `@react-three/drei` trying to load a font from `"/fonts/PlayfairDisplay-Regular.ttf"`. Since there is no `public/fonts` directory, this will trigger a 404 network request. Depending on how `troika-three-text` handles failures, it logs a console warning or error, which will fail `T1_F1_01_PageLoad`.
2. **Missing Product Titles**: `T1_F3_01_ProductTitles` explicitly expects the following texts to be visible on the page: `'Rooh Khus'`, `'Rose Attar'`, `'Floral Waters'`, and `'Agarwood Chips'`. Currently, `App.tsx` defines the products as `'Rooh Khus'`, `'Rose Attar'`, and `'Sandalwood Logs'`. The latter two required products are missing.
3. **Missing Hyphenated Benefit Keywords**: `T1_F3_02_ProductBenefits` uses regular expressions to check for specific strings: `/100% natural/i`, `/alcohol-free/i`, `/skin-friendly/i`, `/long-lasting/i`. These strings must be visible on the page without user interaction. In `App.tsx`, the `features` list spells them as `"Skin Friendly"` and `"Long Lasting"` (missing hyphens), which will not match the regexes. While `"alcohol-free"` appears in the hero description, missing hyphens in the other terms will cause test failures.
4. **Catalogue Images**: `T1_F3_05_CatalogueImages` asserts that the count of `img` elements is `>= 0`. Currently, `App.tsx` uses lucide-react SVGs and 3D Canvases but has no `<img>` tags. While `count === 0` technically passes the test `toBeGreaterThanOrEqual(0)`, it might diverge from the "spirit" of the test, though it doesn't strictly fail the test suite.

## Logic Chain
1. The absence of the font file `public/fonts/PlayfairDisplay-Regular.ttf` will cause a 404. Removing the `font` property entirely will make it fall back to the default `troika-three-text` font and avoid the error.
2. The product array `products` in `App.tsx` must be updated to match the exact product titles expected by the `T1_F3_01_ProductTitles` test. `'Sandalwood Logs'` should be replaced by `'Floral Waters'` and `'Agarwood Chips'` added.
3. Because Playwright checks for product benefits immediately upon loading without interaction, the benefit text should be present in a statically visible part of the DOM. The `features` array in `App.tsx` provides an ideal place. Updating the title and description values to include the exact hyphenated phrases (`"Skin-friendly"`, `"Long-lasting"`, `"Alcohol-free"`) ensures that `T1_F3_02_ProductBenefits` passes.

## Caveats
- Playwright's `console.error` test finishes quickly at `domcontentloaded`. The 404 font error might log asynchronously *after* `domcontentloaded`, which theoretically could allow the test to pass intermittently. Nonetheless, removing the 404 font request is required for a clean console.
- `T1_F3_05_CatalogueImages` tests for `>= 0` images, meaning 0 images technically pass. Adding images is not strictly required by the test, so it's not prioritized as a failing bug.

## Conclusion
To make all tests in `tier1-features.spec.ts` pass, the following changes must be implemented in `src/App.tsx`:
1. Remove the `font="/fonts/PlayfairDisplay-Regular.ttf"` prop from the `<Text>` component.
2. Update the `products` array to include the exact names: `'Rooh Khus'`, `'Rose Attar'`, `'Floral Waters'`, and `'Agarwood Chips'`. Ensure they have corresponding `color`, `id`, `description`, and `price` properties to avoid rendering errors in the `<AttarBottle>` color prop.
3. Update the `features` array strings to explicitly contain the hyphenated phrases: `"Skin-friendly"`, `"Alcohol-free"`, and `"Long-lasting"`.

## Verification Method
1. Modify `src/App.tsx` applying the updates described in the Conclusion.
2. Run the Tier 1 E2E test suite using the project's Playwright command (e.g., `npx playwright test tests/e2e/tier1-features.spec.ts`).
3. If all tests pass with zero errors, the proposed fixes are validated.
