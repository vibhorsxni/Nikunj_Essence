# Handoff Report: Milestone 3 (Mock Product Catalogue & Basic UI structure)

## 1. Observation
- Found `PROJECT.md` specifying Milestone 3: "Catalogue Integration: Mock data implementation, product cards, typography, animations".
- Found `src/components/AttarBottle.tsx` uses hardcoded colors (Inner Liquid: `#143825`).
- Found `src/App.tsx` has a simple layout (`flex-grow flex items-center justify-center`) rendering `<Showcase />`.
- Dependencies in `package.json` include React, Three.js, R3F, and Tailwind. No animation libraries like `framer-motion` are installed.
- No existing mock data files in `src/`. `src/data` directory does not exist yet.

## 2. Logic Chain
- Since `npm install` tasks may timeout, we must use existing tools: Tailwind CSS for styling and animations, React for state, and standard Google Fonts via CDN for typography.
- To fulfill the mock data requirement, we must create a TypeScript file (`src/data/products.ts`) containing the array of products: "Rooh Khus", "Rose Attar", "Floral Waters", and "Agarwood Chips", along with their benefits.
- To connect the data to the 3D scene (per "Interface Contracts" in `PROJECT.md`), `App.tsx` needs state to hold the `selectedProduct`. This product's properties (like `liquidColor`) should be passed down to `Showcase.tsx` and then to `AttarBottle.tsx` to dynamically update the 3D model's appearance.
- To display the catalogue and benefits, we need a new `ProductCard` component structure in the UI. A dual-pane layout in `App.tsx` (3D scene on one side, catalogue on the other) will ensure both are visible and the UI feels like a complete product page.
- Typography and animations can be achieved by adding Google Fonts to `index.html`, configuring them in `tailwind.config.js`, and using Tailwind's `transition`, `hover:`, and `@keyframes` utilities to create a luxurious feel.

## 3. Caveats
- Without `framer-motion`, complex layout animations (like shared element transitions) are difficult. The implementer should stick to CSS transitions, opacity fades, and simple transforms.
- The 3D model is currently a single procedural bottle. We are only changing its liquid color to differentiate products. Differentiating the bottle shape requires more complex 3D meshes which are out of scope for a basic mock catalogue integration.

## 4. Conclusion
The implementer should execute the following plan:
1.  **Typography Setup**: Add a luxurious serif font (e.g., "Playfair Display" or "Cormorant Garamond") via Google Fonts in `index.html`. Extend `tailwind.config.js` to include this font family and custom animations (e.g., a slow fade-in).
2.  **Mock Data Creation**: Create `src/data/products.ts` defining the 4 products. Include properties for `id`, `name`, `description`, `price`, `liquidColor` (hex code mapping to the scent), and `benefits` (the required array: `["100% natural", "alcohol-free", "skin-friendly", "long-lasting"]`).
3.  **UI Components**: Create `src/components/ProductCard.tsx` that beautifully displays the product info and prominently features the benefits (e.g., as gold-tinted badges). Add hover states and smooth Tailwind transitions.
4.  **State & Layout Integration**: Update `src/App.tsx` to hold the `selectedProduct` state. Modify the main layout to a responsive split view (e.g., `flex-col md:flex-row`), putting the `Showcase` alongside the catalogue list.
5.  **3D Scene Binding**: Update `Showcase.tsx` and `AttarBottle.tsx` to accept a `liquidColor` prop and apply it to the inner liquid mesh's `meshPhysicalMaterial`. For an extra polished feel, use `THREE.Color.lerp` inside `useFrame` in `AttarBottle.tsx` to smoothly transition colors when the product changes.

## 5. Verification Method
- Run the build command (`npm run build`) to ensure no TypeScript or Vite errors.
- Run `npm run dev` and open the app in the browser.
- Verify the web page loads without errors and displays the dual-pane layout.
- Verify the font is a luxurious serif.
- Verify all 4 products are listed and their required benefits are visible on the screen.
- Click on different products in the catalogue and verify that the inner liquid color of the 3D bottle changes accordingly.
