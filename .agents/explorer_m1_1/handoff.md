# E2E Testing Strategy Report

## 1. Observation
- **Current Environment State:** The directory `d:/Anti-Gravity/CHIRAG/attar_3d_experience/` contains only documentation (`PROJECT.md`, `TEST_INFRA.md`, `ORIGINAL_REQUEST.md`) and `.agents/`. There is no `package.json`, `playwright.config.ts`, or source code yet.
- **Testing Requirements:** `TEST_INFRA.md` mandates Playwright (Node.js) targeting `http://localhost:5173`. Tests must be placed in `tests/e2e/` and structured into 4 specific tiers: `tier1-features.spec.ts`, `tier2-boundary.spec.ts`, `tier3-cross.spec.ts`, and `tier4-workload.spec.ts`.
- **Feature Targets:** `ORIGINAL_REQUEST.md` details three core features: Luxurious UI (dark green/gold), 3D Product Showcase (`<canvas>` element), and Mock Product Catalogue ("Rooh Khus", etc.).
- **Tech Stack:** `PROJECT.md` dictates a Vite/React 18 frontend, which confirms `http://localhost:5173` as the correct default dev server address.

## 2. Logic Chain
- **Initialization:** Since the Vite project isn't initialized yet, the Playwright setup should either be executed *after* the React app skeleton is created, or manually configure `playwright.config.ts` and merge dependencies into `package.json` to prevent conflicts.
- **Configuration:** To meet the `http://localhost:5173` requirement and support CI/CD, `playwright.config.ts` needs a `webServer` configuration that automatically starts the Vite app via `npm run dev` and waits for port 5173.
- **Spec Strategy:**
  - **Tier 1 (Features):** Must contain ≥5 tests per feature. Needs to assert the presence of CSS colors (dark green, gold), check if the `<canvas>` element exists in the DOM, and verify that text like "Rooh Khus" is rendered.
  - **Tier 2 (Boundary):** Must test different `viewport` configurations (mobile layout vs desktop layout), extremely fast scrolling behavior, and responsiveness of the 3D canvas container.
  - **Tier 3 (Cross-feature):** Must cover pairwise interactions, such as UI clicking events updating the 3D canvas state without causing console errors.
  - **Tier 4 (Workload/Scenarios):** Must implement the 3 exact scenarios outlined in `TEST_INFRA.md` (e.g., mobile user checks "Rooh Khus" details and color theme).

## 3. Caveats
- The codebase does not exist yet. Playwright tests written now (in TDD fashion) will fail until the implementation agent builds the React components.
- Assumes the dev server command will be `npm run dev` as is standard for Vite.
- Assumes the DOM will use standard HTML elements that Playwright can select (e.g., using specific `data-testid` attributes is recommended but not explicitly required by the prompt).

## 4. Conclusion
**Actionable Strategy for the Implementing Agent:**
1. **Initialize Playwright:** Install dependencies (`npm install -D @playwright/test @types/node`).
2. **Configure:** Create `playwright.config.ts` in the root with:
   ```typescript
   import { defineConfig } from '@playwright/test';
   export default defineConfig({
     testDir: './tests/e2e',
     use: { baseURL: 'http://localhost:5173' },
     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:5173',
       reuseExistingServer: !process.env.CI,
     },
   });
   ```
3. **Generate Specs:** Create `tests/e2e/` and the 4 tier files. Start by writing test stubs with `test.describe` and `test('...', async ({ page }) => { ... })` that query for expected text ("Rooh Khus") and the `<canvas>` element.

## 5. Verification Method
- **Command:** Run `npx playwright test` (will fail initially, but should attempt to run tests).
- **Files to Inspect:** Verify the existence and content of `d:/Anti-Gravity/CHIRAG/attar_3d_experience/playwright.config.ts` and the 4 files in `d:/Anti-Gravity/CHIRAG/attar_3d_experience/tests/e2e/`.
- **Validation:** Ensure the config points to port 5173 and the Tier 4 spec covers the 3 scenarios from `TEST_INFRA.md`.
