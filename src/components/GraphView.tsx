import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import { useGraph } from '../hooks/useGraph';
import {
  drawGrid,
  drawFunction,
  drawTracePoint,
  generateTable,
} from '../utils/graphing';

type GraphTab = 'graph' | 'table';

/**
 * Format number for display in table
 */
function formatTableValue(value: number | null): string {
  if (value === null) return 'undefined';
  if (!Number.isFinite(value)) return 'undefined';
  if (Math.abs(value) < 0.0001 && value !== 0) {
    return value.toExponential(4);
  }
  return Number(value.toPrecision(6)).toString();
}

/**
 * Graph view component with canvas-based rendering
 */
export function GraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const graph = useGraph();

  const [activeTab, setActiveTab] = useState<GraphTab>('graph');

  // Draw the graph
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale for high DPI displays
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Fill background
    const isDarkMode =
      window.matchMedia('(prefers-color-scheme: dark)').matches ||
      document.documentElement.getAttribute('data-theme') === 'dark';

    ctx.fillStyle = isDarkMode ? '#1e1e1e' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, graph.bounds, width, height);

    // Draw functions
    for (const func of graph.functions) {
      if (func.visible && func.expression.trim()) {
        drawFunction(ctx, func.expression, func.color, graph.bounds, width, height);
      }
    }

    // Draw trace point if active
    if (graph.tracePoint) {
      const func = graph.functions.find((f) => f.id === graph.tracePoint?.functionId);
      if (func) {
        drawTracePoint(
          ctx,
          graph.tracePoint.x,
          graph.tracePoint.y,
          func.color,
          graph.bounds,
          width,
          height
        );
      }
    }
  }, [graph.bounds, graph.functions, graph.tracePoint]);

  // Redraw on changes
  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawGraph();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGraph]);

  // Handle mouse events for panning and tracing
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (graph.isTracing) return;
      graph.startPan(e.clientX, e.clientY);
    },
    [graph]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (graph.isTracing) {
        graph.updateTracePosition(x, y, rect.width, rect.height);
      } else if (e.buttons === 1) {
        // Left mouse button is pressed - pan
        graph.updatePan(e.clientX, e.clientY);
      }
    },
    [graph]
  );

  const handleMouseUp = useCallback(() => {
    graph.endPan();
  }, [graph]);

  // Handle touch events
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (graph.isTracing) {
          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            graph.updateTracePosition(
              touch.clientX - rect.left,
              touch.clientY - rect.top,
              rect.width,
              rect.height
            );
          }
        } else {
          graph.startPan(touch.clientX, touch.clientY);
        }
      }
    },
    [graph]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];

        if (graph.isTracing) {
          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            graph.updateTracePosition(
              touch.clientX - rect.left,
              touch.clientY - rect.top,
              rect.width,
              rect.height
            );
          }
        } else {
          graph.updatePan(touch.clientX, touch.clientY);
        }
      }
    },
    [graph]
  );

  const handleTouchEnd = useCallback(() => {
    graph.endPan();
  }, [graph]);

  // Handle wheel for zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        graph.zoomIn();
      } else {
        graph.zoomOut();
      }
    },
    [graph]
  );

  // Attach event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

  // Generate table data
  const tableData =
    activeTab === 'table' && graph.functions[0]?.expression
      ? generateTable(
          graph.functions[0].expression,
          graph.bounds.xMin,
          graph.bounds.xMax,
          (graph.bounds.xMax - graph.bounds.xMin) / 20
        )
      : [];

  return (
    <div class="graph-container">
      <div class="graph-tabs">
        <button
          class={`graph-tab ${activeTab === 'graph' ? 'active' : ''}`}
          onClick={() => setActiveTab('graph')}
        >
          Graph
        </button>
        <button
          class={`graph-tab ${activeTab === 'table' ? 'active' : ''}`}
          onClick={() => setActiveTab('table')}
        >
          Table
        </button>
      </div>

      {/* Function inputs */}
      <div class="graph-functions">
        {graph.functions.map((func, index) => (
          <div key={func.id} class="graph-function-row">
            <span
              class="graph-function-color"
              style={{ backgroundColor: func.color }}
            />
            <span class="graph-function-label">y{index + 1} =</span>
            <input
              type="text"
              class="graph-function-input"
              value={func.expression}
              onInput={(e) =>
                graph.updateFunction(func.id, (e.target as HTMLInputElement).value)
              }
              placeholder="e.g., sin(x), x^2"
            />
            <button
              class="graph-function-toggle"
              onClick={() => graph.toggleFunctionVisibility(func.id)}
              aria-label={func.visible ? 'Hide function' : 'Show function'}
            >
              {func.visible ? '👁' : '👁‍🗨'}
            </button>
            {graph.functions.length > 1 && (
              <button
                class="graph-function-remove"
                onClick={() => graph.removeFunction(func.id)}
                aria-label="Remove function"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {graph.functions.length < 3 && (
          <button class="graph-add-function" onClick={() => graph.addFunction('')}>
            + Add Function
          </button>
        )}
      </div>

      {activeTab === 'graph' && (
        <>
          {/* Canvas */}
          <div class="graph-canvas-container" ref={containerRef}>
            <canvas ref={canvasRef} class="graph-canvas" />

            {/* Trace info overlay */}
            {graph.tracePoint && (
              <div class="graph-trace-info">
                x: {formatTableValue(graph.tracePoint.x)}, y:{' '}
                {formatTableValue(graph.tracePoint.y)}
              </div>
            )}
          </div>

          {/* Controls */}
          <div class="graph-controls">
            <button
              class={`graph-control-btn ${graph.isTracing ? 'active' : ''}`}
              onClick={() => graph.setTraceMode(!graph.isTracing)}
              aria-pressed={graph.isTracing}
            >
              Trace
            </button>
            <button class="graph-control-btn" onClick={graph.zoomIn}>
              +
            </button>
            <button class="graph-control-btn" onClick={graph.zoomOut}>
              -
            </button>
            <button class="graph-control-btn" onClick={graph.resetView}>
              Reset
            </button>
          </div>
        </>
      )}

      {activeTab === 'table' && (
        <div class="graph-table-container">
          <table class="graph-table">
            <thead>
              <tr>
                <th>x</th>
                <th>y</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{formatTableValue(row.x)}</td>
                  <td>{formatTableValue(row.y)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
