import { describe, it, expect } from 'vitest';
import {
  evaluate,
  isValidExpression,
  hasBalancedParentheses,
  getUnclosedParentheses,
  degreesToRadians,
  radiansToDegrees,
  factorial,
  permutations,
  combinations,
} from './math-engine';

describe('math-engine', () => {
  describe('evaluate', () => {
    describe('basic operations', () => {
      it('evaluates addition', () => {
        const result = evaluate('2 + 3');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(5);
        }
      });

      it('evaluates subtraction', () => {
        const result = evaluate('10 - 4');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(6);
        }
      });

      it('evaluates multiplication', () => {
        const result = evaluate('6 * 7');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(42);
        }
      });

      it('evaluates division', () => {
        const result = evaluate('15 / 3');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(5);
        }
      });

      it('handles operator precedence', () => {
        const result = evaluate('2 + 3 * 4');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(14);
        }
      });

      it('handles parentheses', () => {
        const result = evaluate('(2 + 3) * 4');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(20);
        }
      });

      it('handles nested parentheses', () => {
        const result = evaluate('((2 + 3) * (4 - 1))');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(15);
        }
      });

      it('handles negative numbers', () => {
        const result = evaluate('-5 + 3');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(-2);
        }
      });

      it('handles decimal numbers', () => {
        const result = evaluate('3.14 * 2');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(6.28, 10);
        }
      });
    });

    describe('symbol replacements', () => {
      it('handles × for multiplication', () => {
        const result = evaluate('3 × 4');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(12);
        }
      });

      it('handles ÷ for division', () => {
        const result = evaluate('12 ÷ 4');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(3);
        }
      });

      it('handles π constant', () => {
        const result = evaluate('π');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(Math.PI, 10);
        }
      });

      it('handles percentage', () => {
        const result = evaluate('50%');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(0.5);
        }
      });
    });

    describe('scientific functions', () => {
      it('evaluates sqrt', () => {
        const result = evaluate('sqrt(16)');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(4);
        }
      });

      it('evaluates power', () => {
        const result = evaluate('2^10');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(1024);
        }
      });

      it('evaluates log10', () => {
        // Using math.js's log10 function directly
        const result = evaluate('log10(100)');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(2);
        }
      });

      it('evaluates log (base 10 in user syntax)', () => {
        // In our UI, "log(" means log10
        const result = evaluate('log(1000)');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(3);
        }
      });

      it('evaluates natural log (ln)', () => {
        // ln(e) = 1, but we test with ln which maps to math.js log
        const result = evaluate('ln(e)');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(1, 10);
        }
      });

      it('evaluates abs', () => {
        const result = evaluate('abs(-5)');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(5);
        }
      });

      it('evaluates factorial', () => {
        const result = evaluate('factorial(5)');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(120);
        }
      });
    });

    describe('trigonometric functions in radians', () => {
      it('evaluates sin(0)', () => {
        const result = evaluate('sin(0)', 'rad');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(0, 10);
        }
      });

      it('evaluates sin(π/2)', () => {
        const result = evaluate('sin(pi/2)', 'rad');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(1, 10);
        }
      });

      it('evaluates cos(0)', () => {
        const result = evaluate('cos(0)', 'rad');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(1, 10);
        }
      });

      it('evaluates cos(π)', () => {
        const result = evaluate('cos(pi)', 'rad');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(-1, 10);
        }
      });

      it('evaluates tan(0)', () => {
        const result = evaluate('tan(0)', 'rad');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(0, 10);
        }
      });
    });

    describe('trigonometric functions in degrees', () => {
      it('evaluates sin(90) in degrees', () => {
        const result = evaluate('sin(90)', 'deg');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(1, 10);
        }
      });

      it('evaluates cos(180) in degrees', () => {
        const result = evaluate('cos(180)', 'deg');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(-1, 10);
        }
      });

      it('evaluates tan(45) in degrees', () => {
        const result = evaluate('tan(45)', 'deg');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(1, 10);
        }
      });

      it('evaluates asin(1) in degrees', () => {
        const result = evaluate('asin(1)', 'deg');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(90, 10);
        }
      });
    });

    describe('error handling', () => {
      it('returns error for empty expression', () => {
        const result = evaluate('');
        expect(result.success).toBe(false);
      });

      it('returns error for whitespace-only expression', () => {
        const result = evaluate('   ');
        expect(result.success).toBe(false);
      });

      it('returns error for invalid syntax', () => {
        const result = evaluate('2 +');
        expect(result.success).toBe(false);
      });

      it('returns error for unknown function', () => {
        const result = evaluate('unknown(5)');
        expect(result.success).toBe(false);
      });

      it('handles division by zero', () => {
        const result = evaluate('1/0');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.displayValue).toBe('Infinity');
        }
      });
    });

    describe('edge cases', () => {
      it('handles very large numbers', () => {
        const result = evaluate('10^100');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.displayValue).toContain('e');
        }
      });

      it('handles very small numbers', () => {
        const result = evaluate('10^(-100)');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.displayValue).toContain('e');
        }
      });

      it('handles implicit multiplication with pi', () => {
        const result = evaluate('2π');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBeCloseTo(2 * Math.PI, 10);
        }
      });

      it('handles implicit multiplication with parentheses', () => {
        const result = evaluate('2(3+4)');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value).toBe(14);
        }
      });
    });
  });

  describe('isValidExpression', () => {
    it('returns true for valid expressions', () => {
      expect(isValidExpression('2 + 3')).toBe(true);
      expect(isValidExpression('sin(0)')).toBe(true);
      expect(isValidExpression('(1 + 2) * 3')).toBe(true);
    });

    it('returns false for invalid expressions', () => {
      expect(isValidExpression('')).toBe(false);
      expect(isValidExpression('2 +')).toBe(false);
    });
  });

  describe('hasBalancedParentheses', () => {
    it('returns true for balanced parentheses', () => {
      expect(hasBalancedParentheses('')).toBe(true);
      expect(hasBalancedParentheses('()')).toBe(true);
      expect(hasBalancedParentheses('(())')).toBe(true);
      expect(hasBalancedParentheses('()()((()))')).toBe(true);
    });

    it('returns false for unbalanced parentheses', () => {
      expect(hasBalancedParentheses('(')).toBe(false);
      expect(hasBalancedParentheses(')')).toBe(false);
      expect(hasBalancedParentheses('(()')).toBe(false);
      expect(hasBalancedParentheses('())')).toBe(false);
    });
  });

  describe('getUnclosedParentheses', () => {
    it('returns 0 for balanced expressions', () => {
      expect(getUnclosedParentheses('')).toBe(0);
      expect(getUnclosedParentheses('()')).toBe(0);
      expect(getUnclosedParentheses('(())')).toBe(0);
    });

    it('returns count of unclosed parentheses', () => {
      expect(getUnclosedParentheses('(')).toBe(1);
      expect(getUnclosedParentheses('((')).toBe(2);
      expect(getUnclosedParentheses('(sin(x)')).toBe(1);
    });
  });

  describe('angle conversion', () => {
    it('converts degrees to radians', () => {
      expect(degreesToRadians(0)).toBe(0);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10);
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 10);
    });

    it('converts radians to degrees', () => {
      expect(radiansToDegrees(0)).toBe(0);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 10);
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 10);
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360, 10);
    });
  });

  describe('combinatorics', () => {
    it('calculates factorial', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(10)).toBe(3628800);
    });

    it('throws for invalid factorial inputs', () => {
      expect(() => factorial(-1)).toThrow();
      expect(() => factorial(1.5)).toThrow();
    });

    it('calculates permutations', () => {
      expect(permutations(5, 0)).toBe(1);
      expect(permutations(5, 1)).toBe(5);
      expect(permutations(5, 2)).toBe(20);
      expect(permutations(5, 5)).toBe(120);
    });

    it('returns 0 for permutations where r > n', () => {
      expect(permutations(3, 5)).toBe(0);
    });

    it('calculates combinations', () => {
      expect(combinations(5, 0)).toBe(1);
      expect(combinations(5, 1)).toBe(5);
      expect(combinations(5, 2)).toBe(10);
      expect(combinations(5, 5)).toBe(1);
      expect(combinations(10, 3)).toBe(120);
    });

    it('returns 0 for combinations where r > n', () => {
      expect(combinations(3, 5)).toBe(0);
    });
  });
});
