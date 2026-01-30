# MathPWA Implementation Plan

## Overview
Build a scientific calculator PWA from scratch using Preact, Vite, Math.js, and Canvas API. The project directory is currently empty.

## Project Initialization

```bash
npm create vite@latest . -- --template preact-ts
npm install mathjs
npm install -D vite-plugin-pwa vitest @testing-library/preact happy-dom @vitest/coverage-v8
```

## Dependencies

**Production:**
- `preact` - UI framework
- `mathjs` - Expression parsing and evaluation

**Development:**
- `@preact/preset-vite` - Vite integration (included with template)
- `vite-plugin-pwa` - Service worker and offline support
- `vitest`, `@testing-library/preact`, `happy-dom` - Testing

## Implementation Phases

### Phase 1: Core Calculator
**Files to create:**
- `src/types/index.ts` - Type definitions (CalculatorState, AngleUnit, etc.)
- `src/utils/math-engine.ts` - Math.js wrapper with error handling
- `src/hooks/useCalculator.ts` - Calculator state and operations
- `src/components/Display.tsx` - Expression and result display
- `src/components/Keypad.tsx` - Button grid (digits, operators, utilities)
- `src/components/Calculator.tsx` - Container composing Display + Keypad
- `src/index.css` - CSS Grid layout, variables, button styles

**Key features:**
- Expression input with result display
- Basic operations: +, -, *, /, parentheses
- Clear, all-clear, backspace
- ANS recall (previous result)
- Keyboard input support

### Phase 2: Scientific Functions
**Files to modify:**
- `src/utils/math-engine.ts` - Add degree/radian conversion
- `src/types/index.ts` - Add ScientificFunction type
- `src/components/Keypad.tsx` - Add scientific function buttons
- `src/components/ModeToggle.tsx` (new) - DEG/RAD toggle

**Key features:**
- Trig: sin, cos, tan and inverses
- Logs: log, ln, log2
- Powers: x², x³, xʸ, 10ˣ, eˣ
- Roots: √, ³√, ʸ√x
- Constants: π, e
- Factorial, absolute value

### Phase 3: Statistics & Probability
**Files to create:**
- `src/utils/statistics.ts` - Statistical calculations, normal distribution

**Files to modify:**
- `src/components/Keypad.tsx` - Statistics mode buttons
- `src/hooks/useCalculator.ts` - Data list mode

**Key features:**
- Data entry mode for number lists
- Mean, median, mode, std dev, variance
- nPr, nCr calculations
- Normal distribution CDF and inverse

### Phase 4: Graphing
**Files to create:**
- `src/utils/graphing.ts` - Canvas drawing, coordinate transforms
- `src/hooks/useGraph.ts` - Graph state, zoom/pan, trace mode
- `src/components/GraphView.tsx` - Canvas-based graph rendering

**Key features:**
- Function input (e.g., "sin(x)", "x^2 - 3")
- Auto-scaling axes
- Zoom in/out, pan by drag
- Trace mode for (x, y) coordinates
- Up to 3 functions with different colors
- Table view option

### Phase 5: Calculation History
**Files to create:**
- `src/hooks/useHistory.ts` - History CRUD, localStorage persistence
- `src/components/History.tsx` - Scrollable history panel

**Key features:**
- Display past calculations (expression → result)
- Click to recall expression or insert result
- Timestamps for context
- FIFO at 100 entries
- LocalStorage persistence

### Phase 6: PWA & Polish
**Files to modify:**
- `vite.config.ts` - Add VitePWA plugin configuration
- `src/index.css` - Theme system (dark/light)

**Files to create:**
- `public/manifest.json` - PWA manifest
- `public/icons/` - App icons (192px, 512px)

**Key features:**
- Service worker for offline functionality
- Install prompt handling
- Responsive layout (mobile single-column, desktop side-by-side)
- Touch-friendly 44px+ tap targets
- Dark/light theme toggle

## Architecture

```
Calculator (container)
├── useCalculator hook ──► math-engine.ts
├── useHistory hook ──► localStorage
└── useGraph hook ──► graphing.ts

Components:
├── Display (expression + result)
├── Keypad (button grid, modes)
├── ModeToggle (DEG/RAD, theme)
├── History (scrollable panel)
└── GraphView (canvas)
```

**State management:** Lifted state with custom hooks (no external library needed)

## Preact-Specific Notes
- Import hooks from `preact/hooks`, not `preact`
- Use `class` instead of `className` (both work, but `class` is idiomatic)
- jsxImportSource must be set to "preact" in tsconfig.json

## Testing Strategy
- **Unit tests:** `math-engine.ts`, `statistics.ts` - edge cases, precision
- **Hook tests:** `useCalculator`, `useHistory` - state transitions
- **Component tests:** User interactions with Keypad, Display
- **Integration tests:** End-to-end calculation flow

Run tests: `npm test`

## Verification Plan

After each phase:
1. Run `npm run dev` and manually test new features
2. Run `npm test` to verify unit and integration tests pass
3. Check browser console for errors

Final verification:
1. Run Lighthouse audit (target: 95+ PWA score)
2. Test offline functionality by disabling network
3. Test on mobile device/emulator
4. Verify localStorage persistence across sessions
