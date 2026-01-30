# MathPWA Agent Patterns

This document describes the agent patterns and automation strategies used in this project.

## Development Workflow Agents

### Code Exploration Agent
Use the `Explore` subagent for:
- Understanding codebase structure
- Finding files by pattern
- Searching for specific implementations
- Answering questions about how features work

```
Task tool with subagent_type=Explore
```

### Planning Agent
Use the `Plan` subagent for:
- Designing new feature implementations
- Evaluating architectural trade-offs
- Creating step-by-step implementation plans

```
Task tool with subagent_type=Plan
```

## Testing Patterns

### Running Tests
```bash
npm test              # Run all tests
npm test -- --run     # Run once without watch mode
npm test -- --coverage # Run with coverage report
```

### Test File Locations
- Unit tests: Co-located with source files (`*.test.ts`)
- Component tests: In `src/components/*.test.tsx`
- Hook tests: In `src/hooks/*.test.ts`

## Build & Deployment

### Development
```bash
npm run dev           # Start dev server with HMR
```

### Production Build
```bash
npm run build         # Build for production
npm run preview       # Preview production build locally
```

### PWA Considerations
- Service worker is generated automatically by vite-plugin-pwa
- Assets are precached for offline use
- Update strategy: autoUpdate (silent background updates)

## Code Quality

### Type Checking
```bash
npx tsc --noEmit      # Type check without emitting
```

### Linting
The project uses TypeScript strict mode. Key settings:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

## Task Management

When working on this project, use the task system:
1. Create tasks for multi-step work
2. Mark tasks `in_progress` before starting
3. Mark tasks `completed` when done
4. Use task dependencies for ordered work

## Common Agent Tasks

### Adding a New Feature
1. Use Plan agent to design implementation
2. Create tasks for each phase
3. Implement with appropriate tests
4. Run full test suite before marking complete

### Fixing a Bug
1. Use Explore agent to understand the affected code
2. Write a failing test that reproduces the bug
3. Fix the bug
4. Verify all tests pass

### Refactoring
1. Ensure comprehensive test coverage exists
2. Use Plan agent to design the refactor
3. Make incremental changes
4. Run tests after each change
