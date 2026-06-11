# E2E Test Infra: Attar 3D Experience

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Luxurious UI/UX Palette & Responsiveness | ORIGINAL_REQUEST R1, AC Technical | 5 | 5 | ✓ |
| 2 | 3D Product Showcase (Canvas Render) | ORIGINAL_REQUEST R2, AC Technical | 5 | 5 | ✓ |
| 3 | Mock Product Catalogue (Content Check) | ORIGINAL_REQUEST R3, AC Agent | 5 | 5 | ✓ |

## Test Architecture
- Test runner: Playwright (Node.js)
- Execution: `npx playwright test`
- Configuration: Standard playwright config targeting local Vite server at `http://localhost:5173`
- Test case format: TypeScript Playwright spec files (`tests/e2e/*.spec.ts`)
- Directory layout:
  - `tests/e2e/tier1-features.spec.ts`
  - `tests/e2e/tier2-boundary.spec.ts`
  - `tests/e2e/tier3-cross.spec.ts`
  - `tests/e2e/tier4-workload.spec.ts`

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | User opens page, admires 3D canvas, and scrolls to view all products | F1, F2, F3 | Medium |
| 2 | Mobile user visits page to check "Rooh Khus" details and color theme | F1, F3 | Low |
| 3 | User interacts with 3D canvas and checks product benefits | F2, F3 | Medium |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (where boundaries exist, e.g. viewport sizes, extreme scrolling, missing resources if applicable)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
