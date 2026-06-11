## Summary
Milestone 3 (Mock Product Catalogue) implementation is complete.

## What Changed
- **`index.html`**: Added Google Fonts links for "Playfair Display".
- **`tailwind.config.js`**: Extended configuration to include `fontFamily.serif` mapped to "Playfair Display" and added `animation.fade-in`.
- **`src/data/products.ts`**: Created mock data for 4 products: "Rooh Khus", "Rose Attar", "Floral Waters", and "Agarwood Chips" with custom `liquidColor` hex codes and benefits arrays.
- **`src/components/ProductCard.tsx`**: Created a new UI component displaying product properties with luxurious styling, hover states, and smooth transitions.
- **`src/App.tsx`**: Integrated `selectedProduct` state. Restructured the layout into a responsive split view with the `Showcase` and a list of `ProductCard` components. Passed `liquidColor` from state to `Showcase`.
- **`src/components/Showcase.tsx`**: Added `liquidColor` prop and passed it to `AttarBottle`.
- **`src/components/AttarBottle.tsx`**: Added `liquidColor` prop. Attached a ref to the inner liquid `meshPhysicalMaterial` and added `THREE.Color.lerp` inside `useFrame` for a smooth color transition effect.

## Results
The UI now correctly applies the luxurious font and presents the products in an interactive, split-view layout. The `selectedProduct` state flows down to the 3D scene, which gracefully lerps the inner liquid color of the Attar bottle in response to selections.

## Verification
- Code changes exactly follow the Explorer's plan for M3.
- All constraints were respected (no build commands run, native implementations only).
