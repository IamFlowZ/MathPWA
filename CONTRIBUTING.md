# Contributing to MathPWA

Thank you for your interest in contributing to MathPWA! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Architecture Notes](#architecture-notes)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/mathpwa.git
   cd mathpwa
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173/` to see your changes.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run with coverage
npm run test:coverage
```

### Building for Production

```bash
npm run build
npm run preview
```

## Code Style

### TypeScript

- **Strict Mode**: TypeScript strict mode is enabled
- **Explicit Types**: Provide explicit return types on exported functions
- **Immutability**: Use `readonly` for immutable data structures
- **Type Aliases**: Prefer `type` over `interface` for simple types

Example:
```typescript
// Good
export function calculateSum(numbers: readonly number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

// Avoid
export function calculateSum(numbers: number[]) {
  return numbers.reduce((sum, num) => sum + num, 0);
}
```

### Preact-Specific Guidelines

#### Imports

Always import hooks from `preact/hooks`, not `react`:

```typescript
// Correct
import { useState, useCallback } from 'preact/hooks';

// Incorrect
import { useState } from 'react';
```

#### JSX Attributes

Prefer `class` over `className` (both work, but `class` is more idiomatic):

```tsx
// Preferred
<div class="container">

// Also valid
<div className="container">
```

### Component Structure

- **Functional Components Only**: No class components
- **Custom Hooks**: Extract shared logic into custom hooks
- **Props Interfaces**: Name props interfaces `{ComponentName}Props`

Example:
```typescript
interface CalculatorProps {
  readonly initialValue: number;
  readonly onCalculate: (result: number) => void;
}

export function Calculator({ initialValue, onCalculate }: CalculatorProps): JSX.Element {
  // Component implementation
}
```

### Functional Programming Patterns

- **Immutability**: Avoid mutating state or props
- **Pure Functions**: Prefer pure utility functions without side effects
- **Composition**: Compose small, focused functions

Example:
```typescript
// Good - immutable
const newHistory = [...history, calculation];

// Avoid - mutates array
history.push(calculation);
```

### Naming Conventions

- **Long, Descriptive Names**: Prefer clarity over brevity
- **No Magic Numbers**: Use constants or enums
- **Explicit Error Types**: Create custom error classes when appropriate

Example:
```typescript
// Good
const MAXIMUM_HISTORY_ENTRIES = 100;
const isValidCalculationResult = (result: number): boolean => !isNaN(result) && isFinite(result);

// Avoid
const max = 100;
const check = (r: number): boolean => !isNaN(r) && isFinite(r);
```

### CSS

- **CSS Custom Properties**: Use CSS variables for theming
- **Mobile-First**: Design for mobile, enhance for desktop
- **CSS Grid**: Prefer Grid for layouts
- **Touch Targets**: Minimum 44px tap targets for touch devices

## Testing Requirements

### Unit Tests

All utility functions must have unit tests:

```typescript
// src/utils/__tests__/math-engine.test.ts
import { describe, it, expect } from 'vitest';
import { evaluate } from '../math-engine';

describe('evaluate', () => {
  it('should evaluate basic arithmetic', () => {
    expect(evaluate('2 + 2')).toBe(4);
  });

  it('should handle division by zero', () => {
    expect(() => evaluate('1 / 0')).toThrow();
  });
});
```

### Hook Tests

Custom hooks should be tested:

```typescript
import { renderHook, act } from '@testing-library/preact';
import { useCalculator } from '../useCalculator';

it('should update display when number is entered', () => {
  const { result } = renderHook(() => useCalculator());

  act(() => {
    result.current.handleNumberInput('5');
  });

  expect(result.current.display).toBe('5');
});
```

### Test Coverage

- Aim for high coverage of utility functions and hooks
- Test edge cases: empty input, division by zero, invalid expressions
- Run `npm run test:coverage` to check coverage

## Pull Request Process

1. **Update Tests**: Add tests for new functionality
2. **Run Tests**: Ensure all tests pass (`npm test -- --run`)
3. **Update Documentation**: Update README.md if adding features
4. **Conventional Commits**: Use conventional commit format
5. **Create Pull Request**: Provide clear description of changes

### Conventional Commit Format

Use the following prefixes:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for complex numbers
fix: resolve division by zero error in statistics
refactor: extract graph rendering to separate function
test: add unit tests for trigonometric functions
docs: update installation instructions
```

## Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Minimal steps to reproduce the bug
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Browser, OS, device (if relevant)
6. **Screenshots**: If applicable

## Feature Requests

When requesting features, please include:

1. **Use Case**: Describe the problem this feature would solve
2. **Proposed Solution**: How you envision the feature working
3. **Alternatives**: Any alternative solutions you've considered
4. **Additional Context**: Screenshots, mockups, or examples

## Architecture Notes

### Calculator State Management

The calculator state is managed by the `useCalculator` hook:

- **Display**: Current display value
- **Expression**: Expression being built
- **Mode**: Angle mode (DEG/RAD) and calculator mode (BASIC/SCIENTIFIC/STATS/GRAPH)
- **History**: Calculation history with localStorage persistence

### Math Engine

The math engine (`src/utils/math-engine.ts`) handles:

- Expression preprocessing (implicit multiplication, function aliasing)
- Evaluation using math.js
- Scope management for angle mode conversions

### PWA Configuration

The PWA is configured in `vite.config.ts`:

- **Auto-update**: Service worker auto-updates in background
- **Asset Precaching**: All static assets are precached
- **Offline Support**: Full offline functionality after first load
- **Base Path**: Configured for GitHub Pages subdirectory deployment

### Adding a New Scientific Function

1. Add button definition in `src/components/Keypad.tsx`
2. If needed, add preprocessing in `src/utils/math-engine.ts`
3. Add unit tests in `src/utils/__tests__/math-engine.test.ts`
4. Update documentation in README.md

### Modifying the Graph

1. Canvas rendering logic: `src/utils/graphing.ts`
2. State management: `src/hooks/useGraph.ts`
3. UI component: `src/components/GraphView.tsx`

### Adding Statistics Features

1. Calculation logic: `src/utils/statistics.ts`
2. UI component: `src/components/StatisticsView.tsx`
3. Unit tests: `src/utils/__tests__/statistics.test.ts`

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Review existing issues and pull requests
- Check the project's [README.md](README.md)

Thank you for contributing to MathPWA!
