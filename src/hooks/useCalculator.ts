import { useState, useCallback, useEffect } from 'preact/hooks';
import type { CalculatorState, CalculatorMode, HistoryEntry } from '../types';
import { evaluate, getUnclosedParentheses } from '../utils/math-engine';

/**
 * Initial calculator state
 */
const INITIAL_STATE: CalculatorState = {
  expression: '',
  result: '',
  previousResult: '0',
  angleUnit: 'rad',
  mode: 'scientific',
  isError: false,
};

/**
 * Operators that should have spaces around them for display
 */
const SPACED_OPERATORS = ['+', '-', '×', '÷', '*', '/'];

/**
 * Check if a character is a digit or decimal point
 */
function isDigitOrDecimal(char: string): boolean {
  return /[\d.]/.test(char);
}

/**
 * Check if expression ends with an operator
 */
function endsWithOperator(expression: string): boolean {
  const trimmed = expression.trim();
  const lastChar = trimmed[trimmed.length - 1];
  return SPACED_OPERATORS.includes(lastChar);
}

/**
 * Check if the last number in expression already has a decimal
 */
function lastNumberHasDecimal(expression: string): boolean {
  const parts = expression.split(/[+\-×÷*/()]/);
  const lastPart = parts[parts.length - 1];
  return lastPart.includes('.');
}

export interface UseCalculatorReturn {
  state: CalculatorState;
  appendToExpression: (value: string) => void;
  clear: () => void;
  allClear: () => void;
  backspace: () => void;
  calculateResult: () => HistoryEntry | null;
  toggleAngleUnit: () => void;
  setMode: (mode: CalculatorMode) => void;
  insertAns: () => void;
  insertFunction: (funcName: string) => void;
  insertConstant: (constant: string) => void;
  setExpression: (expression: string) => void;
}

/**
 * Hook for managing calculator state and operations
 */
export function useCalculator(
  onHistoryAdd?: (entry: HistoryEntry) => void
): UseCalculatorReturn {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  /**
   * Append a value to the current expression
   */
  const appendToExpression = useCallback((value: string) => {
    setState((prev) => {
      // If there was an error, start fresh with the new input
      if (prev.isError) {
        if (isDigitOrDecimal(value) || value === '(' || value === 'π' || value === 'e') {
          return {
            ...prev,
            expression: value,
            result: '',
            isError: false,
          };
        }
        // If entering an operator after error, use previous result
        if (SPACED_OPERATORS.includes(value)) {
          return {
            ...prev,
            expression: prev.previousResult + ' ' + value + ' ',
            result: '',
            isError: false,
          };
        }
      }

      let newExpression = prev.expression;

      // Handle decimal point
      if (value === '.') {
        if (lastNumberHasDecimal(newExpression)) {
          return prev; // Don't add another decimal
        }
        // If expression is empty or ends with operator, add "0."
        if (!newExpression || endsWithOperator(newExpression)) {
          newExpression += '0';
        }
      }

      // Handle operators - add spacing
      if (SPACED_OPERATORS.includes(value)) {
        // Don't add operator if expression is empty (except minus)
        if (!newExpression.trim() && value !== '-') {
          return prev;
        }
        // Don't add operator if already ends with one (replace instead)
        if (endsWithOperator(newExpression)) {
          newExpression = newExpression.trim().slice(0, -1);
        }
        newExpression = newExpression.trim() + ' ' + value + ' ';
      } else {
        newExpression += value;
      }

      return {
        ...prev,
        expression: newExpression,
        result: '',
        isError: false,
      };
    });
  }, []);

  /**
   * Clear the current expression (keep result as ANS)
   */
  const clear = useCallback(() => {
    setState((prev) => ({
      ...prev,
      expression: '',
      result: '',
      isError: false,
    }));
  }, []);

  /**
   * All clear - reset everything
   */
  const allClear = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  /**
   * Delete the last character
   */
  const backspace = useCallback(() => {
    setState((prev) => {
      if (prev.isError) {
        return {
          ...prev,
          expression: '',
          result: '',
          isError: false,
        };
      }

      let newExpression = prev.expression;

      // If ends with space + operator + space, remove all three
      if (newExpression.endsWith(' ')) {
        newExpression = newExpression.trimEnd();
        if (SPACED_OPERATORS.includes(newExpression[newExpression.length - 1])) {
          newExpression = newExpression.slice(0, -1).trimEnd();
        }
      } else {
        newExpression = newExpression.slice(0, -1);
      }

      return {
        ...prev,
        expression: newExpression,
        result: '',
      };
    });
  }, []);

  /**
   * Calculate the result of the current expression
   */
  const calculateResult = useCallback((): HistoryEntry | null => {
    let historyEntry: HistoryEntry | null = null;

    setState((prev) => {
      if (!prev.expression.trim()) {
        return prev;
      }

      // Auto-close parentheses
      let expression = prev.expression;
      const unclosed = getUnclosedParentheses(expression);
      if (unclosed > 0) {
        expression += ')'.repeat(unclosed);
      }

      const calcResult = evaluate(expression, prev.angleUnit);

      if (calcResult.success) {
        historyEntry = {
          id: crypto.randomUUID(),
          expression: prev.expression,
          result: calcResult.displayValue,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          expression: expression,
          result: calcResult.displayValue,
          previousResult: calcResult.displayValue,
          isError: false,
        };
      }

      return {
        ...prev,
        result: calcResult.error,
        isError: true,
      };
    });

    if (historyEntry && onHistoryAdd) {
      onHistoryAdd(historyEntry);
    }

    return historyEntry;
  }, [onHistoryAdd]);

  /**
   * Toggle between degrees and radians
   */
  const toggleAngleUnit = useCallback(() => {
    setState((prev) => ({
      ...prev,
      angleUnit: prev.angleUnit === 'deg' ? 'rad' : 'deg',
    }));
  }, []);

  /**
   * Set the calculator mode
   */
  const setMode = useCallback((mode: CalculatorMode) => {
    setState((prev) => ({
      ...prev,
      mode,
    }));
  }, []);

  /**
   * Insert the previous answer
   */
  const insertAns = useCallback(() => {
    appendToExpression(state.previousResult);
  }, [appendToExpression, state.previousResult]);

  /**
   * Insert a function (e.g., "sin(")
   */
  const insertFunction = useCallback((funcName: string) => {
    appendToExpression(funcName + '(');
  }, [appendToExpression]);

  /**
   * Insert a constant
   */
  const insertConstant = useCallback((constant: string) => {
    appendToExpression(constant);
  }, [appendToExpression]);

  /**
   * Set the expression directly (for history recall)
   */
  const setExpression = useCallback((expression: string) => {
    setState((prev) => ({
      ...prev,
      expression,
      result: '',
      isError: false,
    }));
  }, []);

  /**
   * Handle keyboard input
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key;

      // Digits and operators
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        appendToExpression(key);
      } else if (key === '.') {
        e.preventDefault();
        appendToExpression('.');
      } else if (key === '+') {
        e.preventDefault();
        appendToExpression('+');
      } else if (key === '-') {
        e.preventDefault();
        appendToExpression('-');
      } else if (key === '*') {
        e.preventDefault();
        appendToExpression('×');
      } else if (key === '/') {
        e.preventDefault();
        appendToExpression('÷');
      } else if (key === '(' || key === ')') {
        e.preventDefault();
        appendToExpression(key);
      } else if (key === '^') {
        e.preventDefault();
        appendToExpression('^');
      }
      // Actions
      else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculateResult();
      } else if (key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        clear();
      } else if (key === 'Delete') {
        e.preventDefault();
        allClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendToExpression, calculateResult, backspace, clear, allClear]);

  return {
    state,
    appendToExpression,
    clear,
    allClear,
    backspace,
    calculateResult,
    toggleAngleUnit,
    setMode,
    insertAns,
    insertFunction,
    insertConstant,
    setExpression,
  };
}
