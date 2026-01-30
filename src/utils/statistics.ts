import type { StatisticsData } from '../types';

/**
 * Calculate the mean of a dataset
 */
export function calculateMean(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate the median of a dataset
 */
export function calculateMedian(values: readonly number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate the mode(s) of a dataset
 */
export function calculateMode(values: readonly number[]): number[] {
  if (values.length === 0) return [];

  const counts = new Map<number, number>();
  let maxCount = 0;

  for (const value of values) {
    const count = (counts.get(value) || 0) + 1;
    counts.set(value, count);
    maxCount = Math.max(maxCount, count);
  }

  // If all values appear only once, there is no mode
  if (maxCount === 1 && values.length > 1) return [];

  const modes: number[] = [];
  for (const [value, count] of counts) {
    if (count === maxCount) {
      modes.push(value);
    }
  }

  return modes.sort((a, b) => a - b);
}

/**
 * Calculate the variance of a dataset (population variance)
 */
export function calculateVariance(values: readonly number[]): number {
  if (values.length === 0) return 0;

  const mean = calculateMean(values);
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate the sample variance of a dataset
 */
export function calculateSampleVariance(values: readonly number[]): number {
  if (values.length <= 1) return 0;

  const mean = calculateMean(values);
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / (values.length - 1);
}

/**
 * Calculate the standard deviation (population)
 */
export function calculateStdDev(values: readonly number[]): number {
  return Math.sqrt(calculateVariance(values));
}

/**
 * Calculate the sample standard deviation
 */
export function calculateSampleStdDev(values: readonly number[]): number {
  return Math.sqrt(calculateSampleVariance(values));
}

/**
 * Calculate sum of dataset
 */
export function calculateSum(values: readonly number[]): number {
  return values.reduce((sum, val) => sum + val, 0);
}

/**
 * Calculate all statistics for a dataset
 */
export function calculateStatistics(values: readonly number[]): StatisticsData {
  return {
    values,
    mean: calculateMean(values),
    median: calculateMedian(values),
    mode: calculateMode(values),
    stdDev: calculateStdDev(values),
    variance: calculateVariance(values),
    sum: calculateSum(values),
    count: values.length,
  };
}

/**
 * Calculate factorial
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial requires a non-negative integer');
  }
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Calculate permutations nPr = n! / (n-r)!
 */
export function permutations(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('nPr requires non-negative integers');
  }
  if (r > n) return 0;
  if (r === 0) return 1;

  let result = 1;
  for (let i = n; i > n - r; i--) {
    result *= i;
  }
  return result;
}

/**
 * Calculate combinations nCr = n! / (r! * (n-r)!)
 */
export function combinations(n: number, r: number): number {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error('nCr requires non-negative integers');
  }
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;

  // Use smaller r for efficiency
  const k = r > n - r ? n - r : r;

  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

/**
 * Standard normal probability density function
 */
export function normalPDF(x: number, mean: number = 0, stdDev: number = 1): number {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return coefficient * Math.exp(exponent);
}

/**
 * Standard normal cumulative distribution function (approximation)
 * Uses Abramowitz and Stegun approximation
 */
export function normalCDF(x: number, mean: number = 0, stdDev: number = 1): number {
  // Standardize
  const z = (x - mean) / stdDev;

  // Constants for approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // Handle negative z
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);

  // A&S approximation
  const t = 1.0 / (1.0 + p * absZ);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ / 2);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Inverse normal CDF (approximation)
 * Returns z such that P(Z < z) = p
 */
export function normalInverseCDF(p: number, mean: number = 0, stdDev: number = 1): number {
  if (p <= 0 || p >= 1) {
    throw new Error('Probability must be between 0 and 1 (exclusive)');
  }

  // Rational approximation for lower region
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
    -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let z: number;

  if (p < pLow) {
    // Lower region
    const q = Math.sqrt(-2 * Math.log(p));
    z =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    // Central region
    const q = p - 0.5;
    const r = q * q;
    z =
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    // Upper region
    const q = Math.sqrt(-2 * Math.log(1 - p));
    z =
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  return z * stdDev + mean;
}

/**
 * Parse a string of numbers into an array
 */
export function parseDataInput(input: string): number[] {
  // Split by common delimiters: comma, space, newline, semicolon
  const parts = input.split(/[,\s;]+/).filter((s) => s.trim().length > 0);

  const values: number[] = [];
  for (const part of parts) {
    const num = parseFloat(part.trim());
    if (!Number.isNaN(num) && Number.isFinite(num)) {
      values.push(num);
    }
  }

  return values;
}
