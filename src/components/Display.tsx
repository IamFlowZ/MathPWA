import type { CalculatorState } from '../types';

interface DisplayProps {
  state: CalculatorState;
}

/**
 * Display component showing the current expression and result
 */
export function Display({ state }: DisplayProps) {
  const { expression, result, isError } = state;

  return (
    <div class="display">
      <div class="display-expression" aria-live="polite">
        {expression || '0'}
      </div>
      <div
        class={`display-result ${isError ? 'display-error' : ''}`}
        aria-live="polite"
        role="status"
      >
        {result}
      </div>
    </div>
  );
}
