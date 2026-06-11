# Worker Plan

## Overview
Implement the Vite + React + TypeScript + Tailwind setup for Milestone 1 (Skeleton & Theming).

## Step-by-step
1. Initialize the project: The root directory already contains documentation files. Create a `temp-app` using `npx create-vite@latest temp-app --template react-ts`. Then move its contents (including hidden files like `.gitignore`) into the root directory. Remove `temp-app` afterwards. (Hint: run this in a bash script or carefully move files). Run `npm install`.
2. Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer`, then `npx tailwindcss init -p`.
3. Configure Tailwind (`tailwind.config.js`):
   Set content to: `["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`
   Extend theme colors:
     - `attarDark: '#0A1A12'`
     - `attarGreen: '#143825'`
     - `attarGold: '#D4AF37'`
     - `attarLightGold: '#F3E5AB'`
4. Set up `/src/styles/globals.css` (or overwrite `/src/index.css`): include `@tailwind base; @tailwind components; @tailwind utilities;` and apply a global background of `bg-attarDark` and text color `text-gray-100`.
5. Create Components:
   - `src/components/Navbar.tsx`: A dark green top bar with a gold logo/text ("Attar 3D").
   - `src/components/Footer.tsx`: A simple footer.
6. Update `App.tsx`:
   - Include Navbar.
   - Include a main content area (min-height screen) that says "Attar 3D Experience" in gold text.
   - Include Footer.
7. Verify build: run `npm run build` to ensure there are no compilation or TypeScript errors.

**MANDATORY INTEGRITY WARNING**
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
