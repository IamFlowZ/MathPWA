/**
 * Angle unit for trigonometric calculations
 */
export type AngleUnit = 'deg' | 'rad';

/**
 * Calculator display mode
 */
export type CalculatorMode = 'basic' | 'scientific' | 'statistics' | 'graphing';

/**
 * Theme preference
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Calculation result that may include an error
 */
export type CalculationResult = {
  readonly success: true;
  readonly value: number | string;
  readonly displayValue: string;
} | {
  readonly success: false;
  readonly error: string;
};

/**
 * Entry in calculation history
 */
export interface HistoryEntry {
  readonly id: string;
  readonly expression: string;
  readonly result: string;
  readonly timestamp: number;
}

/**
 * State of the calculator
 */
export interface CalculatorState {
  readonly expression: string;
  readonly result: string;
  readonly previousResult: string;
  readonly angleUnit: AngleUnit;
  readonly mode: CalculatorMode;
  readonly isError: boolean;
}

/**
 * Button configuration for the keypad
 */
export interface ButtonConfig {
  readonly label: string;
  readonly value: string;
  readonly type: 'digit' | 'operator' | 'function' | 'action' | 'constant';
  readonly ariaLabel?: string;
  readonly span?: number;
}

/**
 * Scientific function category
 */
export type ScientificFunctionCategory =
  | 'trig'
  | 'inverse-trig'
  | 'log'
  | 'power'
  | 'root'
  | 'other';

/**
 * Scientific function definition
 */
export interface ScientificFunction {
  readonly name: string;
  readonly displayName: string;
  readonly category: ScientificFunctionCategory;
  readonly mathJsName: string;
}

/**
 * Graph function definition
 */
export interface GraphFunction {
  readonly id: string;
  readonly expression: string;
  readonly color: string;
  readonly visible: boolean;
}

/**
 * Graph viewport bounds
 */
export interface GraphBounds {
  readonly xMin: number;
  readonly xMax: number;
  readonly yMin: number;
  readonly yMax: number;
}

/**
 * Trace point on graph
 */
export interface TracePoint {
  readonly x: number;
  readonly y: number;
  readonly functionId: string;
}

/**
 * Statistics data set
 */
export interface StatisticsData {
  readonly values: readonly number[];
  readonly mean: number;
  readonly median: number;
  readonly mode: readonly number[];
  readonly stdDev: number;
  readonly variance: number;
  readonly sum: number;
  readonly count: number;
}
