# Handoff Report: Milestone 2 - 3D Showcase

## Observation
- Checked `package.json` and noted that `three`, `@react-three/fiber`, and `@react-three/drei` are **not** currently installed.
- Examined `tailwind.config.js` and found the custom brand colors: `attarDark` (`#0A1A12`), `attarGreen` (`#143825`), `attarGold` (`#D4AF37`), and `attarLightGold` (`#F3E5AB`).
- Viewed `src/App.tsx`, which currently has a basic full-height layout (`min-h-screen`, `bg-attarDark`) and an empty `<main>` section containing a placeholder `<h2>` tag for the 3D experience.

## Logic Chain
1. **Dependencies**: Since R3F libraries are missing, the implementer must first install `three`, `@react-three/fiber`, `@react-three/drei`, and their type definitions.
2. **Bottle Modeling**: We need a procedural/placeholder 3D bottle. This can be built elegantly using standard primitives (e.g., `<cylinderGeometry>` for the body and neck, `<sphereGeometry>` for the cap). A `meshPhysicalMaterial` (with transmission and roughness tweaks) will create a glass-like dark bottle, and a `meshStandardMaterial` using the `attarGold` (`#D4AF37`) color will give the cap and accents a premium metallic look.
3. **Lighting & Environment**: To make the glass and gold materials look realistic and premium, the scene needs an `<Environment preset="city">` or similar preset for reflections. Lighting should combine soft ambient light with a directional or spot light casting shadows.
4. **Interaction**: `<PresentationControls>` from Drei is ideal for product showcases because it provides a spring-physics-based rotation that feels high-end, returning to center (or a snap position) gracefully. A `<ContactShadows>` component beneath the bottle will anchor it to the space without needing a physical floor plane.
5. **Integration**: The newly created `Showcase` component should be imported into `App.tsx`, replacing the placeholder `<h2>` text inside the `<main>` tag. The parent container must have a defined height (e.g. `w-full h-full min-h-[500px]`) for the `<Canvas>` to render correctly.

## Caveats
- The procedural 3D model is a placeholder and will not have the sophisticated details of an actual crafted bottle (e.g., custom engravings or perfect real-world refraction).
- We are using a preset environment map (`city` or `studio`); you might want to adjust the background color of the canvas to seamlessly blend with the `bg-attarDark` background.

## Conclusion
The implementation strategy is clear and ready:
1. Run `npm install three @react-three/fiber @react-three/drei` and `npm install --save-dev @types/three`.
2. Create `src/components/AttarBottle.tsx` (a `<group>` containing primitive geometries styled as a perfume bottle using glass and gold materials).
3. Create `src/components/Showcase.tsx` containing the `<Canvas>`, lighting, `<Environment>`, `<ContactShadows>`, and wrapping the bottle in `<PresentationControls>`.
4. Render `<Showcase />` within `src/App.tsx`.

## Verification Method
1. Install dependencies and start the development server (`npm run dev`).
2. Open the app in the browser.
3. Verify that the 3D bottle is visible in the center of the screen, responds to mouse/touch drag smoothly (thanks to `PresentationControls`), features gold and glass-like materials, and has a soft shadow rendered beneath it.
