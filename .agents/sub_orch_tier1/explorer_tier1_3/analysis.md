# Tier 1 Analysis & Fix Strategy

## 1. Observation
- **Missing Font causing 404 Error**: In `src/App.tsx:61`, the `<Text>` component uses `font="/fonts/PlayfairDisplay-Regular.ttf"`. The `public/fonts/` directory does not exist in the project, which will cause a 404 network/console error on page load.
- **Incorrect/Hardcoded Product Data**: In `src/App.tsx:71-93`, the `products` array is hardcoded with 3 items (`Rooh Khus`, `Rose Attar`, `Sandalwood Logs`). However, `tests/e2e/tier1-features.spec.ts:75-79` (`T1_F3_01_ProductTitles`) explicitly checks for 4 items: `Rooh Khus`, `Rose Attar`, `Floral Waters`, and `Agarwood Chips`. The correct dataset actually exists in `src/data/products.ts:12`.
- **String Mismatch for Product Benefits**: In `src/App.tsx:96-99`, the `features` array defines benefits like `"Skin Friendly"` and `"Long Lasting"` (without hyphens). The test `T1_F3_02_ProductBenefits` uses regular expressions requiring hyphens: `/skin-friendly/i` and `/long-lasting/i`. The correctly formatted strings exist in `src/data/products.ts:10` (`benefitsList`).

## 2. Logic Chain
- `T1_F1_01_PageLoad` asserts that `errors.length === 0` for console errors. The missing `.ttf` file triggers a 404 error logged to the console, causing this test to fail.
- `T1_F3_01_ProductTitles` asserts visibility for `Floral Waters` and `Agarwood Chips`. Since the hardcoded state lacks these, the test times out waiting for these elements.
- `T1_F3_02_ProductBenefits` asserts text matching `/skin-friendly/i` and `/long-lasting/i`. The missing hyphens in the UI text mean Playwright's `getByText` locator cannot find matching elements.
- By connecting `src/App.tsx` to `src/data/products.ts`, we align the application's data flow with the provided data layer, fixing both the products list and the benefit strings.

## 3. Caveats
- It is assumed that replacing the 3D `<Text>` component's `font` prop with the default font is an acceptable fix for the 404 error (as opposed to downloading/providing the `.ttf` file).
- The property mapping between the hardcoded `products` and `src/data/products.ts` requires minor updates in `App.tsx` (e.g., using `product.liquidColor` instead of `product.color`, and manually prepending `₹` to `product.price` as it's a number in the data file).

## 4. Conclusion
To pass the Tier 1 E2E tests, the following changes are required in `src/App.tsx`:
1. Remove the `font="/fonts/PlayfairDisplay-Regular.ttf"` prop from the `<Text>` component at line 61.
2. Remove the hardcoded `products` and `features` arrays.
3. Import `products` and `benefitsList` from `src/data/products.ts`.
4. Update the `features` array to utilize strings from `benefitsList` (to ensure hyphens are present).
5. Update the product rendering loops to use `product.liquidColor` and `₹${product.price}` to accommodate the schema of the imported `products` array.

## 5. Verification Method
- **Static Verification**: Inspect `src/App.tsx` after implementation to confirm it imports from `src/data/products.ts` and no longer contains the `/fonts/...` reference.
- **Dynamic Verification**: Run `npx playwright test tests/e2e/tier1-features.spec.ts`. All 12 Tier 1 tests should pass.
