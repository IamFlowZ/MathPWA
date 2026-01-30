import { useState, useCallback, useRef } from 'preact/hooks';
import type { GraphFunction, GraphBounds, TracePoint } from '../types';
import { DEFAULT_BOUNDS, evaluateFunction, GRAPH_COLORS } from '../utils/graphing';

/**
 * Zoom factor for zoom in/out
 */
const ZOOM_FACTOR = 1.5;

/**
 * Maximum number of functions
 */
const MAX_FUNCTIONS = 3;

export interface UseGraphReturn {
  functions: GraphFunction[];
  bounds: GraphBounds;
  tracePoint: TracePoint | null;
  isTracing: boolean;
  addFunction: (expression: string) => void;
  updateFunction: (id: string, expression: string) => void;
  removeFunction: (id: string) => void;
  toggleFunctionVisibility: (id: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  pan: (deltaX: number, deltaY: number) => void;
  startPan: (x: number, y: number) => void;
  updatePan: (x: number, y: number) => void;
  endPan: () => void;
  setTraceMode: (enabled: boolean) => void;
  updateTracePosition: (canvasX: number, canvasY: number, canvasWidth: number, canvasHeight: number) => void;
  setBounds: (bounds: GraphBounds) => void;
}

/**
 * Hook for managing graph state
 */
export function useGraph(): UseGraphReturn {
  const [functions, setFunctions] = useState<GraphFunction[]>([
    { id: '1', expression: '', color: GRAPH_COLORS[0], visible: true },
  ]);
  const [bounds, setBounds] = useState<GraphBounds>(DEFAULT_BOUNDS);
  const [tracePoint, setTracePoint] = useState<TracePoint | null>(null);
  const [isTracing, setIsTracing] = useState(false);

  // Pan state refs to avoid re-renders during drag
  const panStart = useRef<{ x: number; y: number } | null>(null);
  const panBoundsStart = useRef<GraphBounds | null>(null);

  const addFunction = useCallback((expression: string) => {
    setFunctions((prev) => {
      if (prev.length >= MAX_FUNCTIONS) return prev;

      const newId = (Math.max(...prev.map((f) => parseInt(f.id, 10)), 0) + 1).toString();
      const colorIndex = prev.length % GRAPH_COLORS.length;

      return [
        ...prev,
        {
          id: newId,
          expression,
          color: GRAPH_COLORS[colorIndex],
          visible: true,
        },
      ];
    });
  }, []);

  const updateFunction = useCallback((id: string, expression: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, expression } : f))
    );
  }, []);

  const removeFunction = useCallback((id: string) => {
    setFunctions((prev) => {
      // Don't remove if only one function left
      if (prev.length <= 1) {
        return prev.map((f) => (f.id === id ? { ...f, expression: '' } : f));
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const toggleFunctionVisibility = useCallback((id: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  }, []);

  const zoomIn = useCallback(() => {
    setBounds((prev) => {
      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;
      const xRange = (prev.xMax - prev.xMin) / ZOOM_FACTOR;
      const yRange = (prev.yMax - prev.yMin) / ZOOM_FACTOR;

      return {
        xMin: xCenter - xRange / 2,
        xMax: xCenter + xRange / 2,
        yMin: yCenter - yRange / 2,
        yMax: yCenter + yRange / 2,
      };
    });
  }, []);

  const zoomOut = useCallback(() => {
    setBounds((prev) => {
      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;
      const xRange = (prev.xMax - prev.xMin) * ZOOM_FACTOR;
      const yRange = (prev.yMax - prev.yMin) * ZOOM_FACTOR;

      return {
        xMin: xCenter - xRange / 2,
        xMax: xCenter + xRange / 2,
        yMin: yCenter - yRange / 2,
        yMax: yCenter + yRange / 2,
      };
    });
  }, []);

  const resetView = useCallback(() => {
    setBounds(DEFAULT_BOUNDS);
  }, []);

  const pan = useCallback((deltaX: number, deltaY: number) => {
    setBounds((prev) => ({
      xMin: prev.xMin + deltaX,
      xMax: prev.xMax + deltaX,
      yMin: prev.yMin + deltaY,
      yMax: prev.yMax + deltaY,
    }));
  }, []);

  const startPan = useCallback((x: number, y: number) => {
    panStart.current = { x, y };
    panBoundsStart.current = bounds;
  }, [bounds]);

  const updatePan = useCallback(
    (x: number, y: number) => {
      if (!panStart.current || !panBoundsStart.current) return;

      // Calculate movement in graph units
      const xRange = panBoundsStart.current.xMax - panBoundsStart.current.xMin;
      const yRange = panBoundsStart.current.yMax - panBoundsStart.current.yMin;

      // deltaX and deltaY are in pixels, need to convert to graph units
      // We'll pass canvas dimensions through context or props if needed
      // For now, estimate based on typical canvas size
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight * 0.6;

      const deltaX = ((panStart.current.x - x) / canvasWidth) * xRange;
      const deltaY = ((y - panStart.current.y) / canvasHeight) * yRange;

      setBounds({
        xMin: panBoundsStart.current.xMin + deltaX,
        xMax: panBoundsStart.current.xMax + deltaX,
        yMin: panBoundsStart.current.yMin + deltaY,
        yMax: panBoundsStart.current.yMax + deltaY,
      });
    },
    []
  );

  const endPan = useCallback(() => {
    panStart.current = null;
    panBoundsStart.current = null;
  }, []);

  const setTraceMode = useCallback((enabled: boolean) => {
    setIsTracing(enabled);
    if (!enabled) {
      setTracePoint(null);
    }
  }, []);

  const updateTracePosition = useCallback(
    (canvasX: number, _canvasY: number, canvasWidth: number, _canvasHeight: number) => {
      if (!isTracing) return;

      // Convert canvas position to graph coordinates (we only need x for tracing)
      const xRange = bounds.xMax - bounds.xMin;
      const graphX = (canvasX / canvasWidth) * xRange + bounds.xMin;

      // Find the first visible function and evaluate at this x
      const visibleFunc = functions.find((f) => f.visible && f.expression.trim());
      if (!visibleFunc) {
        setTracePoint(null);
        return;
      }

      const graphY = evaluateFunction(visibleFunc.expression, graphX);
      if (graphY !== null) {
        setTracePoint({
          x: graphX,
          y: graphY,
          functionId: visibleFunc.id,
        });
      } else {
        setTracePoint(null);
      }
    },
    [isTracing, bounds, functions]
  );

  return {
    functions,
    bounds,
    tracePoint,
    isTracing,
    addFunction,
    updateFunction,
    removeFunction,
    toggleFunctionVisibility,
    zoomIn,
    zoomOut,
    resetView,
    pan,
    startPan,
    updatePan,
    endPan,
    setTraceMode,
    updateTracePosition,
    setBounds,
  };
}
