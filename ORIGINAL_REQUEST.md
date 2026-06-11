# Original User Request

## Initial Request — 2026-06-11T03:40:25Z

A highly polished 3D frontend web demo for a premium e-commerce store selling authentic, natural Attars (perfume oils) and related fragrance products. The site will feature a luxurious aesthetic (dark green and gold) and use 3D visual elements to highlight the purity, heritage, and premium nature of the products.

Working directory: d:/Anti-Gravity/CHIRAG/attar_3d_experience
Integrity mode: development

## Requirements

### R1. Luxurious UI/UX Frontend
Build a responsive, modern frontend web application. The design must reflect a premium, traditional yet modern aesthetic, utilizing a dark green and gold color palette inspired by the provided client catalogue. The UI should feel rich and include smooth micro-animations.

### R2. 3D Product Showcase
Implement an interactive 3D product showcase. The team should use the best possible approach: either fetching high-quality 3D models of perfume bottles, or falling back to well-designed procedural CSS-based 3D effects/placeholder 3D shapes if downloading models compromises performance or quality. 

### R3. Mock Product Catalogue
Integrate mocked product data corresponding to the client's offerings. The content must feature items like "Rooh Khus", "Rose Attar", "Floral Waters", and "Agarwood Chips", and highlight key product benefits: 100% natural, alcohol-free, skin-friendly, and long-lasting.

## Acceptance Criteria

### Technical & Programmatic Checks
- [ ] The project initializes and builds successfully (e.g., `npm run dev` or `npm run build` exits without errors).
- [ ] The application loads with zero browser console errors.
- [ ] The DOM successfully renders a `<canvas>` element (or equivalent 3D container) for the 3D scene.
- [ ] The CSS/styling explicitly includes the premium dark green and gold color palette.

### Agent-as-Judge UI Verification
- [ ] **Content Rubric:** An independent review confirms the UI displays the required product titles ("Rooh Khus", "Rose Attar", etc.) and the specified product benefits.
- [ ] **Aesthetic Rubric:** An independent review confirms the UI meets the standard of a "premium, luxurious" experience (smooth animations, appropriate typography, structured spacing).

## Follow-up — 2026-06-11T05:17:00Z

Continue building and polishing a premium 3D web experience for an e-commerce store selling authentic, natural Attars (perfume oils). The project already has a working React + Vite + TypeScript + Tailwind CSS + React Three Fiber foundation. The primary user base is **mobile/smartphone users**, so every design decision must be mobile-first.

Working directory: d:/Anti-Gravity/CHIRAG/attar_3d_experience
Integrity mode: development

### Existing Codebase Context

The project already exists at the working directory with these files:
- `package.json` — React 18, Three.js, R3F, Framer Motion, Lucide, Tailwind
- `src/App.tsx` — Main app with Hero, Heritage, Bento Grid, 3D Showcase, Product Catalogue, Comparison Table, Footer, Cart Drawer
- `src/data/products.ts` — 8 products (attars, floral waters, raw materials) with Odoo-style variants & pricing
- `src/hooks/useCart.ts` — Shopping cart state management
- `src/hooks/useIsMobile.ts` — Mobile viewport detection hook
- `src/components/AttarBottle.tsx` — Procedural 3D bottle with glass, gold cap, label
- `src/components/FloatingParticles.tsx` — Ambient gold particles for 3D scenes
- `src/components/CartDrawer.tsx` — Slide-out cart with quantity controls
- `src/index.css` — Tailwind + custom animations (gold shimmer, glass card, bento hover)
- `tailwind.config.js` — Brand colors (dark green #0A1C12, gold #D4AF37)

Brand identity: **Nikunj Essence** — dark green & gold palette, Playfair Display serif + Inter sans-serif fonts.

### Requirements

#### R1. Mobile-First Optimization
The primary user base is mobile. The entire UI must be designed mobile-first: touch-friendly tap targets (min 44px), proper thumb-zone layout, horizontal-swipeable product cards, reduced 3D complexity on small screens for performance, and a sticky bottom CTA bar on mobile. The 3D canvas must render at lower particle count and simpler geometry on phones to maintain 60fps.

#### R2. Complete the App.tsx Mobile Rebuild
Rebuild the main `App.tsx` to use the `useIsMobile` hook to conditionally render lighter 3D scenes on mobile. Add a sticky mobile bottom navigation/CTA bar. Ensure all sections (Hero, Heritage, Bento, Showcase, Catalogue, Comparison, Footer) are properly stacked and readable on a 375px-wide viewport. Product catalogue cards should be horizontally swipeable on mobile.

#### R3. Visual Polish & Premium Feel
The site must feel like a luxury brand on both mobile and desktop. Smooth scroll-linked animations, premium typography hierarchy, proper spacing rhythm, and the dark-green/gold aesthetic must be consistent throughout. No section should look "basic" or "template-like".

#### R4. Working Shopping Cart
The cart drawer must work correctly: adding products with specific size variants, updating quantities, removing items, and showing the correct total in Indian Rupees. The cart badge on the nav must update in real-time.

### Acceptance Criteria

#### Build & Runtime
- [ ] `npm install` completes without errors
- [ ] `npm run build` (tsc && vite build) completes without TypeScript or Vite errors
- [ ] The application loads in a browser with zero console errors

#### Mobile-First Verification
- [ ] All interactive elements have a minimum touch target of 44x44px
- [ ] On a 375px viewport, no horizontal overflow or content clipping occurs
- [ ] The 3D canvas renders without janky performance on mobile
- [ ] A sticky bottom CTA or navigation bar is visible on mobile viewports

#### Content & Functionality
- [ ] Products Rooh Khus, Rose Attar, Ruh Nag Champa, Ruh Pink Lotus, Ruh Rajnigandha, Rose Water, Agarwood Chips, Sandalwood Powder are all displayed
- [ ] Each product shows size variants with prices in Indian Rupees
- [ ] Adding a product to cart, changing quantity, and removing from cart all work correctly
- [ ] The comparison table Attar vs Perfume displays all 5 comparison rows

#### Aesthetic Rubric
- [ ] Dark green (#0A1C12) and gold (#D4AF37) palette is consistently applied
- [ ] Typography uses Playfair Display for headings and Inter for body text
- [ ] The UI feels premium and luxurious rather than basic template
