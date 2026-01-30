# MathPWA - Claude Instructions

Project-specific instructions for working with this scientific calculator PWA.

## Project Overview

MathPWA is a progressive web application providing scientific calculator functionality including:
- Basic and scientific calculations
- Statistical analysis
- Function graphing
- Calculation history with persistence

## Tech Stack

- **Framework**: Preact (not React)
- **Build Tool**: Vite
- **Math Library**: Math.js
- **Testing**: Vitest + Testing Library
- **PWA**: vite-plugin-pwa

## Preact-Specific Guidelines

### Imports
```typescript
// Correct - import hooks from preact/hooks
import { useState, useCallback } from 'preact/hooks';

// Incorrect - don't import from 'react'
import { useState } from 'react'; // NO
```

### JSX Attributes
```tsx
// Preact idiom - use 'class' (both work, but 'class' is preferred)
<div class="container">

// Also valid but less idiomatic
<div className="container">
```

## Code Style

### TypeScript
- Strict mode enabled
- Explicit return types on exported functions
- Use `readonly` for immutable data structures
- Prefer `type` over `interface` for simple types

### Components
- Functional components only
- Custom hooks for shared logic
- Props interfaces named `{ComponentName}Props`

### CSS
- CSS custom properties (variables) for theming
- Mobile-first responsive design
- CSS Grid for layouts
- Minimum 44px tap targets for touch

## File Structure

```
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── types/          # TypeScript type definitions
├── utils/          # Pure utility functions
├── app.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Testing Requirements

- Unit tests for all utility functions
- Hook tests for custom hooks
- Test edge cases (empty input, division by zero, etc.)
- Run `npm test` before committing

## Math Engine Notes

### Logarithm Functions
The math engine translates user-friendly syntax:
- `log(x)` → `log10(x)` (base 10)
- `ln(x)` → `log(x)` (natural log, math.js native)
- `log10(x)`, `log2(x)` → passed through unchanged

### Angle Units
- DEG mode: trig functions receive degrees, inverse trig returns degrees
- RAD mode: standard radian input/output
- Conversion handled via scope overrides in `evaluate()`

### Implicit Multiplication
- `2π` → `2*pi`
- `3sin(x)` → `3*sin(x)`
- `5(2+3)` → `5*(2+3)`
- Protected: `log10`, `log2` don't get split

## PWA Configuration

- Service worker auto-updates in background
- Precaches all static assets
- Works fully offline after first load
- Icons at 192x192 and 512x512

## Common Tasks

### Adding a New Scientific Function
1. Add button definition in `Keypad.tsx`
2. If needed, add preprocessing in `math-engine.ts`
3. Add unit tests for the function
4. Update this documentation

### Modifying the Graph
1. Canvas rendering in `src/utils/graphing.ts`
2. State management in `src/hooks/useGraph.ts`
3. UI in `src/components/GraphView.tsx`

### Adding Statistics Features
1. Calculations in `src/utils/statistics.ts`
2. UI in `src/components/StatisticsView.tsx`
3. Add comprehensive unit tests

## Build Commands

```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm test          # Run tests
npm test -- --coverage  # Test with coverage
```
