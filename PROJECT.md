# Project: Attar 3D Experience

## Architecture
- **Frontend Stack**: React 18, Vite, TypeScript, Tailwind CSS
- **3D Tech**: Three.js, React Three Fiber (R3F), Drei
- **Data**: Mock JSON data simulating a backend catalogue

## Code Layout
- `/src/components`: UI components (Navbar, Footer, ProductCard)
- `/src/components/canvas`: 3D elements (AttarBottle, Scene)
- `/src/data`: Mock data for products
- `/src/styles`: Global styles and Tailwind overrides

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Skeleton & Theming | Set up Vite React TS project, Tailwind config, Dark Green & Gold theme, basic UI layout | none | DONE |
| 2 | 3D Showcase | Implement R3F canvas, procedural/3D bottle model, lighting, interaction | M1 | DONE |
| 3 | Catalogue Integration | Mock data implementation, product cards, typography, animations | M1 | DONE |

## Interface Contracts
### UI ↔ 3D Scene
- The 3D scene receives the currently selected product via props to update model texture/color or show a specific bottle shape.
- Scene provides `onLoad` or interaction callbacks to the UI.
