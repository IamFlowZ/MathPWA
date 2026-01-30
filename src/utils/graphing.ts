import { evaluate } from './math-engine';
import type { GraphBounds } from '../types';

/**
 * Default graph bounds
 */
export const DEFAULT_BOUNDS: GraphBounds = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

/**
 * Graph colors for multiple functions
 */
export const GRAPH_COLORS = ['#4a90d9', '#e53935', '#43a047'];

/**
 * Grid line colors
 */
export const GRID_COLOR = {
  major: 'rgba(128, 128, 128, 0.4)',
  minor: 'rgba(128, 128, 128, 0.15)',
};

/**
 * Axis color
 */
export const AXIS_COLOR = 'rgba(128, 128, 128, 0.8)';

/**
 * Evaluate a function expression at a given x value
 */
export function evaluateFunction(expression: string, x: number): number | null {
  // Replace 'x' with the actual value
  const expr = expression.replace(/\bx\b/gi, `(${x})`);
  const result = evaluate(expr, 'rad');

  if (result.success && typeof result.value === 'number') {
    if (Number.isFinite(result.value)) {
      return result.value;
    }
  }
  return null;
}

/**
 * Transform graph coordinates to canvas coordinates
 */
export function graphToCanvas(
  graphX: number,
  graphY: number,
  bounds: GraphBounds,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const xRange = bounds.xMax - bounds.xMin;
  const yRange = bounds.yMax - bounds.yMin;

  const x = ((graphX - bounds.xMin) / xRange) * canvasWidth;
  const y = ((bounds.yMax - graphY) / yRange) * canvasHeight;

  return { x, y };
}

/**
 * Transform canvas coordinates to graph coordinates
 */
export function canvasToGraph(
  canvasX: number,
  canvasY: number,
  bounds: GraphBounds,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const xRange = bounds.xMax - bounds.xMin;
  const yRange = bounds.yMax - bounds.yMin;

  const x = (canvasX / canvasWidth) * xRange + bounds.xMin;
  const y = bounds.yMax - (canvasY / canvasHeight) * yRange;

  return { x, y };
}

/**
 * Calculate appropriate grid step size
 */
export function calculateGridStep(range: number): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(range)));
  const normalized = range / magnitude;

  if (normalized <= 2) return magnitude / 5;
  if (normalized <= 5) return magnitude / 2;
  return magnitude;
}

/**
 * Draw the grid and axes
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  bounds: GraphBounds,
  width: number,
  height: number
): void {
  const xRange = bounds.xMax - bounds.xMin;
  const yRange = bounds.yMax - bounds.yMin;

  const xStep = calculateGridStep(xRange);
  const yStep = calculateGridStep(yRange);

  // Draw minor grid lines
  ctx.strokeStyle = GRID_COLOR.minor;
  ctx.lineWidth = 1;

  const minorXStep = xStep / 5;
  const minorYStep = yStep / 5;

  // Minor vertical lines
  for (let x = Math.floor(bounds.xMin / minorXStep) * minorXStep; x <= bounds.xMax; x += minorXStep) {
    const { x: canvasX } = graphToCanvas(x, 0, bounds, width, height);
    ctx.beginPath();
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, height);
    ctx.stroke();
  }

  // Minor horizontal lines
  for (let y = Math.floor(bounds.yMin / minorYStep) * minorYStep; y <= bounds.yMax; y += minorYStep) {
    const { y: canvasY } = graphToCanvas(0, y, bounds, width, height);
    ctx.beginPath();
    ctx.moveTo(0, canvasY);
    ctx.lineTo(width, canvasY);
    ctx.stroke();
  }

  // Draw major grid lines
  ctx.strokeStyle = GRID_COLOR.major;

  // Major vertical lines
  for (let x = Math.floor(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    const { x: canvasX } = graphToCanvas(x, 0, bounds, width, height);
    ctx.beginPath();
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, height);
    ctx.stroke();
  }

  // Major horizontal lines
  for (let y = Math.floor(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    const { y: canvasY } = graphToCanvas(0, y, bounds, width, height);
    ctx.beginPath();
    ctx.moveTo(0, canvasY);
    ctx.lineTo(width, canvasY);
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth = 2;

  // Y-axis (x = 0)
  if (bounds.xMin <= 0 && bounds.xMax >= 0) {
    const { x: axisX } = graphToCanvas(0, 0, bounds, width, height);
    ctx.beginPath();
    ctx.moveTo(axisX, 0);
    ctx.lineTo(axisX, height);
    ctx.stroke();
  }

  // X-axis (y = 0)
  if (bounds.yMin <= 0 && bounds.yMax >= 0) {
    const { y: axisY } = graphToCanvas(0, 0, bounds, width, height);
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(width, axisY);
    ctx.stroke();
  }

  // Draw axis labels
  ctx.fillStyle = 'rgba(128, 128, 128, 0.9)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // X-axis labels
  for (let x = Math.floor(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    if (Math.abs(x) < xStep / 100) continue; // Skip 0
    const { x: canvasX, y: canvasY } = graphToCanvas(x, 0, bounds, width, height);
    const labelY = Math.max(5, Math.min(height - 20, canvasY + 5));
    ctx.fillText(formatAxisLabel(x), canvasX, labelY);
  }

  // Y-axis labels
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (let y = Math.floor(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    if (Math.abs(y) < yStep / 100) continue; // Skip 0
    const { x: canvasX, y: canvasY } = graphToCanvas(0, y, bounds, width, height);
    const labelX = Math.max(5, Math.min(width - 30, canvasX + 5));
    ctx.fillText(formatAxisLabel(y), labelX, canvasY);
  }
}

/**
 * Format axis labels
 */
function formatAxisLabel(value: number): string {
  if (Math.abs(value) >= 1000 || (Math.abs(value) < 0.01 && value !== 0)) {
    return value.toExponential(1);
  }
  // Round to avoid floating point display issues
  const rounded = Math.round(value * 1000000) / 1000000;
  return rounded.toString();
}

/**
 * Draw a function curve
 */
export function drawFunction(
  ctx: CanvasRenderingContext2D,
  expression: string,
  color: string,
  bounds: GraphBounds,
  width: number,
  height: number
): void {
  if (!expression.trim()) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const points: Array<{ x: number; y: number } | null> = [];
  const numPoints = width * 2; // 2 points per pixel for smoothness
  const xStep = (bounds.xMax - bounds.xMin) / numPoints;

  // Evaluate function at each point
  for (let i = 0; i <= numPoints; i++) {
    const graphX = bounds.xMin + i * xStep;
    const graphY = evaluateFunction(expression, graphX);

    if (graphY !== null && graphY >= bounds.yMin - 100 && graphY <= bounds.yMax + 100) {
      points.push(graphToCanvas(graphX, graphY, bounds, width, height));
    } else {
      points.push(null); // Discontinuity marker
    }
  }

  // Draw connected segments
  ctx.beginPath();
  let drawing = false;

  for (const point of points) {
    if (point === null) {
      if (drawing) {
        ctx.stroke();
        ctx.beginPath();
        drawing = false;
      }
    } else {
      if (!drawing) {
        ctx.moveTo(point.x, point.y);
        drawing = true;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
  }

  if (drawing) {
    ctx.stroke();
  }
}

/**
 * Draw a trace point
 */
export function drawTracePoint(
  ctx: CanvasRenderingContext2D,
  graphX: number,
  graphY: number,
  color: string,
  bounds: GraphBounds,
  width: number,
  height: number
): void {
  const { x, y } = graphToCanvas(graphX, graphY, bounds, width, height);

  // Draw crosshairs
  ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);

  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();

  ctx.setLineDash([]);

  // Draw point
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();

  // Draw border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

/**
 * Generate a table of values for a function
 */
export function generateTable(
  expression: string,
  xStart: number,
  xEnd: number,
  step: number
): Array<{ x: number; y: number | null }> {
  const table: Array<{ x: number; y: number | null }> = [];

  for (let x = xStart; x <= xEnd; x += step) {
    const y = evaluateFunction(expression, x);
    table.push({ x, y });
  }

  return table;
}
