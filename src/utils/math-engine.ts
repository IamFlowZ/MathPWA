import { create, all, type MathJsInstance } from 'mathjs';
import type { AngleUnit, CalculationResult } from '../types';

/**
 * Configure math.js instance with custom settings
 */
const math: MathJsInstance = create(all, {
  number: 'number',
  precision: 14,
});

/**
 * Maximum display precision for results
 */
const DISPLAY_PRECISION = 12;

/**
 * Error messages for common calculation errors
 */
const ERROR_MESSAGES: Record<string, string> = {
  'Undefined function': 'Unknown function',
  'Unexpected end of expression': 'Incomplete expression',
  'Value expected': 'Missing value',
  'Parenthesis ) expected': 'Missing )',
  'Cannot divide by zero': 'Divide by zero',
};

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Format a number for display, handling special cases
 */
function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'Error';
    return value > 0 ? 'Infinity' : '-Infinity';
  }

  // Use exponential notation for very large or very small numbers
  if (Math.abs(value) > 1e12 || (Math.abs(value) < 1e-10 && value !== 0)) {
    return value.toExponential(DISPLAY_PRECISION - 4);
  }

  // Round to avoid floating point display issues
  const rounded = Number(value.toPrecision(DISPLAY_PRECISION));

  // Format with appropriate decimal places
  const str = rounded.toString();

  // Limit length for display
  if (str.length > DISPLAY_PRECISION + 2) {
    return value.toExponential(DISPLAY_PRECISION - 4);
  }

  return str;
}

/**
 * Transform expression to handle angle units for trig functions
 * Note: The actual angle conversion is handled via scope overrides in evaluate()
 * This function is kept for any future expression preprocessing needs
 */
function transformForAngleUnit(expression: string, angleUnit: AngleUnit): string {
  if (angleUnit === 'rad') {
    return expression;
  }
  // In degree mode, the trig function overrides in evaluate() handle conversion
  return expression;
}

/**
 * Parse user-friendly syntax to math.js compatible expression
 */
function preprocessExpression(expression: string): string {
  let processed = expression;

  // Replace × with *
  processed = processed.replace(/×/g, '*');

  // Replace ÷ with /
  processed = processed.replace(/÷/g, '/');

  // Replace π with pi
  processed = processed.replace(/π/g, 'pi');

  // Replace common function names
  processed = processed.replace(/√\(/g, 'sqrt(');

  // Handle logarithm functions:
  // - ln -> natural log (math.js's log function)
  // - log -> base 10 (math.js's log10 function)
  // - log10, log2 -> math.js already supports these natively

  // Step 1: Protect ln, log10, and log2 from replacement
  processed = processed.replace(/\bln\(/g, '__NATLOG__(');
  processed = processed.replace(/\blog10\(/g, '__LOG10__(');
  processed = processed.replace(/\blog2\(/g, '__LOG2__(');

  // Step 2: Replace remaining log( with log10(
  processed = processed.replace(/\blog\(/g, 'log10(');

  // Step 3: Restore protected functions
  processed = processed.replace(/__NATLOG__\(/g, 'log(');
  processed = processed.replace(/__LOG10__\(/g, 'log10(');
  processed = processed.replace(/__LOG2__\(/g, 'log2(');

  // Handle implicit multiplication: 2π, 3sin, 5(, etc.
  // Important: digit followed by letter that starts a function/variable name
  // Exclude digits that are part of function names like log10, log2
  // Match: digit followed by letter (except when letter is part of log10/log2 suffix)
  processed = processed.replace(/(\d)(?=\s*[a-zA-Z(])(?![0-9])/g, (match, digit, offset) => {
    // Check if this digit is part of log10 or log2
    const before = processed.substring(Math.max(0, offset - 4), offset);
    if (/log1?$/.test(before) || /log$/.test(before)) {
      return match;
    }
    return digit + '*';
  });

  // Handle percentage
  processed = processed.replace(/(\d+\.?\d*)%/g, '($1/100)');

  return processed;
}

/**
 * Get a user-friendly error message
 */
function getUserFriendlyError(error: Error): string {
  const message = error.message;

  for (const [pattern, friendly] of Object.entries(ERROR_MESSAGES)) {
    if (message.includes(pattern)) {
      return friendly;
    }
  }

  // Truncate long error messages
  if (message.length > 30) {
    return 'Syntax Error';
  }

  return message;
}

/**
 * Evaluate a mathematical expression
 */
export function evaluate(
  expression: string,
  angleUnit: AngleUnit = 'rad'
): CalculationResult {
  if (!expression.trim()) {
    return {
      success: false,
      error: 'Empty expression',
    };
  }

  try {
    // Preprocess the expression
    let processed = preprocessExpression(expression);

    // Transform for angle unit
    processed = transformForAngleUnit(processed, angleUnit);

    // Create a scope with degree-aware trig functions if needed
    const scope: Record<string, unknown> = {};

    if (angleUnit === 'deg') {
      // Override trig functions to work in degrees
      scope['sin'] = (x: number) => Math.sin(degreesToRadians(x));
      scope['cos'] = (x: number) => Math.cos(degreesToRadians(x));
      scope['tan'] = (x: number) => Math.tan(degreesToRadians(x));
      scope['asin'] = (x: number) => radiansToDegrees(Math.asin(x));
      scope['acos'] = (x: number) => radiansToDegrees(Math.acos(x));
      scope['atan'] = (x: number) => radiansToDegrees(Math.atan(x));
    }

    const result = math.evaluate(processed, scope);

    // Handle different result types
    if (typeof result === 'number') {
      const displayValue = formatNumber(result);
      return {
        success: true,
        value: result,
        displayValue,
      };
    }

    if (typeof result === 'boolean') {
      return {
        success: true,
        value: result ? 'true' : 'false',
        displayValue: result ? 'true' : 'false',
      };
    }

    // Handle arrays, matrices, etc.
    if (result !== null && result !== undefined) {
      const str = math.format(result, { precision: DISPLAY_PRECISION });
      return {
        success: true,
        value: str,
        displayValue: str,
      };
    }

    return {
      success: false,
      error: 'No result',
    };
  } catch (error) {
    return {
      success: false,
      error: getUserFriendlyError(error as Error),
    };
  }
}

/**
 * Validate if an expression is syntactically valid (for real-time feedback)
 */
export function isValidExpression(expression: string): boolean {
  if (!expression.trim()) {
    return false;
  }

  try {
    const processed = preprocessExpression(expression);
    math.parse(processed);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if expression has balanced parentheses
 */
export function hasBalancedParentheses(expression: string): boolean {
  let count = 0;
  for (const char of expression) {
    if (char === '(') count++;
    if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

/**
 * Get the number of unclosed parentheses
 */
export function getUnclosedParentheses(expression: string): number {
  let count = 0;
  for (const char of expression) {
    if (char === '(') count++;
    if (char === ')') count--;
  }
  return Math.max(0, count);
}

/**
 * Calculate factorial
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial requires a non-negative integer');
  }
  if (n > 170) {
    return Infinity;
  }
  return math.factorial(n) as number;
}

/**
 * Calculate permutations nPr
 */
export function permutations(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('Permutations require non-negative integers');
  }
  if (r > n) {
    return 0;
  }
  return math.permutations(n, r) as number;
}

/**
 * Calculate combinations nCr
 */
export function combinations(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('Combinations require non-negative integers');
  }
  if (r > n) {
    return 0;
  }
  return math.combinations(n, r) as number;
}

export { math };
