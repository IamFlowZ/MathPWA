import { useCalculator } from '../hooks/useCalculator';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { StatisticsView } from './StatisticsView';
import { GraphView } from './GraphView';
import type { HistoryEntry, CalculatorMode } from '../types';

interface CalculatorProps {
  onHistoryAdd?: (entry: HistoryEntry) => void;
  onModeChange?: (mode: CalculatorMode) => void;
}

/**
 * Main Calculator component
 */
export function Calculator({ onHistoryAdd, onModeChange }: CalculatorProps) {
  const calculator = useCalculator(onHistoryAdd);

  const handleAction = (action: 'clear' | 'allClear' | 'backspace' | 'equals' | 'ans') => {
    switch (action) {
      case 'clear':
        calculator.clear();
        break;
      case 'allClear':
        calculator.allClear();
        break;
      case 'backspace':
        calculator.backspace();
        break;
      case 'equals':
        calculator.calculateResult();
        break;
      case 'ans':
        calculator.insertAns();
        break;
    }
  };

  const handleModeChange = (mode: CalculatorMode) => {
    calculator.setMode(mode);
    onModeChange?.(mode);
  };

  const showStatisticsView = calculator.state.mode === 'statistics';
  const showGraphView = calculator.state.mode === 'graphing';
  const showCalculator = !showStatisticsView && !showGraphView;

  return (
    <div class="calculator">
      <div class="calculator-header">
        <div class="mode-tabs">
          <button
            class={`mode-tab ${calculator.state.mode === 'basic' ? 'active' : ''}`}
            onClick={() => handleModeChange('basic')}
          >
            Basic
          </button>
          <button
            class={`mode-tab ${calculator.state.mode === 'scientific' ? 'active' : ''}`}
            onClick={() => handleModeChange('scientific')}
          >
            Scientific
          </button>
          <button
            class={`mode-tab ${calculator.state.mode === 'statistics' ? 'active' : ''}`}
            onClick={() => handleModeChange('statistics')}
          >
            Stats
          </button>
          <button
            class={`mode-tab ${calculator.state.mode === 'graphing' ? 'active' : ''}`}
            onClick={() => handleModeChange('graphing')}
          >
            Graph
          </button>
        </div>
      </div>

      {showStatisticsView && <StatisticsView />}

      {showGraphView && <GraphView />}

      {showCalculator && (
        <>
          <Display state={calculator.state} />

          <Keypad
            mode={calculator.state.mode}
            angleUnit={calculator.state.angleUnit}
            onDigit={(digit) => calculator.appendToExpression(digit)}
            onOperator={(op) => calculator.appendToExpression(op)}
            onFunction={(func) => calculator.insertFunction(func)}
            onConstant={(constant) => calculator.insertConstant(constant)}
            onAction={handleAction}
            onToggleAngleUnit={calculator.toggleAngleUnit}
          />
        </>
      )}
    </div>
  );
}
