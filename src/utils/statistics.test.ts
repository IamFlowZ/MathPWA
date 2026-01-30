import { describe, it, expect } from 'vitest';
import {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateVariance,
  calculateSampleVariance,
  calculateStdDev,
  calculateSampleStdDev,
  calculateSum,
  calculateStatistics,
  factorial,
  permutations,
  combinations,
  normalPDF,
  normalCDF,
  normalInverseCDF,
  parseDataInput,
} from './statistics';

describe('statistics', () => {
  describe('calculateMean', () => {
    it('calculates mean of a simple dataset', () => {
      expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
    });

    it('calculates mean of a single value', () => {
      expect(calculateMean([5])).toBe(5);
    });

    it('returns 0 for empty dataset', () => {
      expect(calculateMean([])).toBe(0);
    });

    it('handles decimal values', () => {
      expect(calculateMean([1.5, 2.5, 3.5])).toBeCloseTo(2.5, 10);
    });

    it('handles negative values', () => {
      expect(calculateMean([-2, -1, 0, 1, 2])).toBe(0);
    });
  });

  describe('calculateMedian', () => {
    it('calculates median of odd-length dataset', () => {
      expect(calculateMedian([1, 2, 3, 4, 5])).toBe(3);
    });

    it('calculates median of even-length dataset', () => {
      expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
    });

    it('returns single value for single-element dataset', () => {
      expect(calculateMedian([5])).toBe(5);
    });

    it('returns 0 for empty dataset', () => {
      expect(calculateMedian([])).toBe(0);
    });

    it('handles unsorted input', () => {
      expect(calculateMedian([5, 1, 3, 2, 4])).toBe(3);
    });
  });

  describe('calculateMode', () => {
    it('finds single mode', () => {
      expect(calculateMode([1, 2, 2, 3])).toEqual([2]);
    });

    it('finds multiple modes', () => {
      expect(calculateMode([1, 1, 2, 2, 3])).toEqual([1, 2]);
    });

    it('returns empty for dataset with all unique values', () => {
      expect(calculateMode([1, 2, 3, 4, 5])).toEqual([]);
    });

    it('returns empty for empty dataset', () => {
      expect(calculateMode([])).toEqual([]);
    });

    it('handles single element', () => {
      expect(calculateMode([5])).toEqual([5]);
    });
  });

  describe('calculateVariance', () => {
    it('calculates population variance', () => {
      expect(calculateVariance([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(4, 10);
    });

    it('returns 0 for single value', () => {
      expect(calculateVariance([5])).toBe(0);
    });

    it('returns 0 for empty dataset', () => {
      expect(calculateVariance([])).toBe(0);
    });

    it('returns 0 for identical values', () => {
      expect(calculateVariance([5, 5, 5, 5])).toBe(0);
    });
  });

  describe('calculateSampleVariance', () => {
    it('calculates sample variance with Bessel correction', () => {
      const data = [2, 4, 4, 4, 5, 5, 7, 9];
      const popVar = calculateVariance(data);
      const sampleVar = calculateSampleVariance(data);
      expect(sampleVar).toBeGreaterThan(popVar);
    });

    it('returns 0 for single value', () => {
      expect(calculateSampleVariance([5])).toBe(0);
    });
  });

  describe('calculateStdDev', () => {
    it('calculates population standard deviation', () => {
      expect(calculateStdDev([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2, 10);
    });

    it('returns 0 for single value', () => {
      expect(calculateStdDev([5])).toBe(0);
    });
  });

  describe('calculateSampleStdDev', () => {
    it('calculates sample standard deviation', () => {
      const data = [2, 4, 4, 4, 5, 5, 7, 9];
      const popStd = calculateStdDev(data);
      const sampleStd = calculateSampleStdDev(data);
      expect(sampleStd).toBeGreaterThan(popStd);
    });
  });

  describe('calculateSum', () => {
    it('calculates sum', () => {
      expect(calculateSum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('returns 0 for empty dataset', () => {
      expect(calculateSum([])).toBe(0);
    });

    it('handles negative values', () => {
      expect(calculateSum([-1, 1])).toBe(0);
    });
  });

  describe('calculateStatistics', () => {
    it('returns all statistics for a dataset', () => {
      const stats = calculateStatistics([1, 2, 2, 3, 4]);
      expect(stats.count).toBe(5);
      expect(stats.sum).toBe(12);
      expect(stats.mean).toBeCloseTo(2.4, 10);
      expect(stats.median).toBe(2);
      expect(stats.mode).toEqual([2]);
      expect(stats.variance).toBeGreaterThan(0);
      expect(stats.stdDev).toBeGreaterThan(0);
    });
  });

  describe('factorial', () => {
    it('calculates factorial of 0', () => {
      expect(factorial(0)).toBe(1);
    });

    it('calculates factorial of 1', () => {
      expect(factorial(1)).toBe(1);
    });

    it('calculates factorial of 5', () => {
      expect(factorial(5)).toBe(120);
    });

    it('calculates factorial of 10', () => {
      expect(factorial(10)).toBe(3628800);
    });

    it('throws for negative numbers', () => {
      expect(() => factorial(-1)).toThrow();
    });

    it('throws for non-integers', () => {
      expect(() => factorial(2.5)).toThrow();
    });
  });

  describe('permutations', () => {
    it('calculates nP0 = 1', () => {
      expect(permutations(5, 0)).toBe(1);
    });

    it('calculates nP1 = n', () => {
      expect(permutations(7, 1)).toBe(7);
    });

    it('calculates nPn = n!', () => {
      expect(permutations(5, 5)).toBe(120);
    });

    it('calculates nPr correctly', () => {
      expect(permutations(5, 2)).toBe(20);
      expect(permutations(8, 3)).toBe(336);
    });

    it('returns 0 when r > n', () => {
      expect(permutations(3, 5)).toBe(0);
    });

    it('throws for negative values', () => {
      expect(() => permutations(-1, 2)).toThrow();
    });
  });

  describe('combinations', () => {
    it('calculates nC0 = 1', () => {
      expect(combinations(5, 0)).toBe(1);
    });

    it('calculates nCn = 1', () => {
      expect(combinations(5, 5)).toBe(1);
    });

    it('calculates nC1 = n', () => {
      expect(combinations(7, 1)).toBe(7);
    });

    it('calculates nCr correctly', () => {
      expect(combinations(5, 2)).toBe(10);
      expect(combinations(10, 3)).toBe(120);
      expect(combinations(52, 5)).toBe(2598960); // poker hands
    });

    it('returns 0 when r > n', () => {
      expect(combinations(3, 5)).toBe(0);
    });

    it('is symmetric: nCr = nC(n-r)', () => {
      expect(combinations(10, 3)).toBe(combinations(10, 7));
    });

    it('throws for negative values', () => {
      expect(() => combinations(-1, 2)).toThrow();
    });
  });

  describe('normalPDF', () => {
    it('peaks at mean for standard normal', () => {
      const atMean = normalPDF(0);
      const offMean = normalPDF(1);
      expect(atMean).toBeGreaterThan(offMean);
    });

    it('is symmetric around mean', () => {
      expect(normalPDF(-1)).toBeCloseTo(normalPDF(1), 10);
    });

    it('handles non-standard normal', () => {
      const value = normalPDF(10, 10, 2);
      expect(value).toBeGreaterThan(0);
    });
  });

  describe('normalCDF', () => {
    it('returns ~0.5 at mean', () => {
      expect(normalCDF(0)).toBeCloseTo(0.5, 2);
    });

    it('returns close to 0.84 at z=1', () => {
      // The Abramowitz-Stegun approximation has some error
      expect(normalCDF(1)).toBeCloseTo(0.84, 1);
    });

    it('returns close to 0.16 at z=-1', () => {
      expect(normalCDF(-1)).toBeCloseTo(0.16, 1);
    });

    it('returns close to 0.975 at z=1.96', () => {
      expect(normalCDF(1.96)).toBeCloseTo(0.975, 1);
    });

    it('handles non-standard normal', () => {
      expect(normalCDF(100, 100, 15)).toBeCloseTo(0.5, 2);
    });
  });

  describe('normalInverseCDF', () => {
    it('returns ~0 for p=0.5', () => {
      expect(normalInverseCDF(0.5)).toBeCloseTo(0, 1);
    });

    it('returns ~1.96 for p=0.975', () => {
      expect(normalInverseCDF(0.975)).toBeCloseTo(1.96, 1);
    });

    it('returns ~-1.96 for p=0.025', () => {
      expect(normalInverseCDF(0.025)).toBeCloseTo(-1.96, 1);
    });

    it('handles non-standard normal', () => {
      const result = normalInverseCDF(0.5, 100, 15);
      expect(result).toBeCloseTo(100, 1);
    });

    it('throws for p <= 0', () => {
      expect(() => normalInverseCDF(0)).toThrow();
    });

    it('throws for p >= 1', () => {
      expect(() => normalInverseCDF(1)).toThrow();
    });
  });

  describe('parseDataInput', () => {
    it('parses comma-separated values', () => {
      expect(parseDataInput('1, 2, 3')).toEqual([1, 2, 3]);
    });

    it('parses space-separated values', () => {
      expect(parseDataInput('1 2 3')).toEqual([1, 2, 3]);
    });

    it('parses newline-separated values', () => {
      expect(parseDataInput('1\n2\n3')).toEqual([1, 2, 3]);
    });

    it('parses semicolon-separated values', () => {
      expect(parseDataInput('1;2;3')).toEqual([1, 2, 3]);
    });

    it('handles mixed delimiters', () => {
      expect(parseDataInput('1, 2; 3\n4')).toEqual([1, 2, 3, 4]);
    });

    it('ignores non-numeric values', () => {
      expect(parseDataInput('1, abc, 2, xyz, 3')).toEqual([1, 2, 3]);
    });

    it('returns empty array for invalid input', () => {
      expect(parseDataInput('abc')).toEqual([]);
    });

    it('handles decimal numbers', () => {
      expect(parseDataInput('1.5, 2.5, 3.5')).toEqual([1.5, 2.5, 3.5]);
    });

    it('handles negative numbers', () => {
      expect(parseDataInput('-1, -2, 3')).toEqual([-1, -2, 3]);
    });
  });
});
