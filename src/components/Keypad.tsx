import type { AngleUnit, CalculatorMode } from '../types';

interface KeypadProps {
  mode: CalculatorMode;
  angleUnit: AngleUnit;
  onDigit: (digit: string) => void;
  onOperator: (operator: string) => void;
  onFunction: (funcName: string) => void;
  onConstant: (constant: string) => void;
  onAction: (action: 'clear' | 'allClear' | 'backspace' | 'equals' | 'ans') => void;
  onToggleAngleUnit: () => void;
}

interface ButtonDef {
  label: string;
  value: string;
  type: 'digit' | 'operator' | 'function' | 'action' | 'constant' | 'toggle';
  ariaLabel?: string;
  className?: string;
}

/**
 * Basic calculator buttons
 */
const BASIC_BUTTONS: ButtonDef[] = [
  { label: 'C', value: 'clear', type: 'action', ariaLabel: 'Clear', className: 'btn-action' },
  { label: 'AC', value: 'allClear', type: 'action', ariaLabel: 'All Clear', className: 'btn-action' },
  { label: '⌫', value: 'backspace', type: 'action', ariaLabel: 'Backspace', className: 'btn-action' },
  { label: '÷', value: '÷', type: 'operator', ariaLabel: 'Divide', className: 'btn-operator' },
  { label: '7', value: '7', type: 'digit' },
  { label: '8', value: '8', type: 'digit' },
  { label: '9', value: '9', type: 'digit' },
  { label: '×', value: '×', type: 'operator', ariaLabel: 'Multiply', className: 'btn-operator' },
  { label: '4', value: '4', type: 'digit' },
  { label: '5', value: '5', type: 'digit' },
  { label: '6', value: '6', type: 'digit' },
  { label: '−', value: '-', type: 'operator', ariaLabel: 'Subtract', className: 'btn-operator' },
  { label: '1', value: '1', type: 'digit' },
  { label: '2', value: '2', type: 'digit' },
  { label: '3', value: '3', type: 'digit' },
  { label: '+', value: '+', type: 'operator', ariaLabel: 'Add', className: 'btn-operator' },
  { label: '0', value: '0', type: 'digit' },
  { label: '.', value: '.', type: 'digit', ariaLabel: 'Decimal' },
  { label: 'ANS', value: 'ans', type: 'action', ariaLabel: 'Previous Answer', className: 'btn-secondary' },
  { label: '=', value: 'equals', type: 'action', ariaLabel: 'Equals', className: 'btn-equals' },
];

/**
 * Scientific function buttons
 */
const SCIENTIFIC_BUTTONS: ButtonDef[] = [
  { label: 'sin', value: 'sin', type: 'function', className: 'btn-function' },
  { label: 'cos', value: 'cos', type: 'function', className: 'btn-function' },
  { label: 'tan', value: 'tan', type: 'function', className: 'btn-function' },
  { label: 'π', value: 'π', type: 'constant', ariaLabel: 'Pi', className: 'btn-constant' },
  { label: 'sin⁻¹', value: 'asin', type: 'function', ariaLabel: 'Arc Sine', className: 'btn-function' },
  { label: 'cos⁻¹', value: 'acos', type: 'function', ariaLabel: 'Arc Cosine', className: 'btn-function' },
  { label: 'tan⁻¹', value: 'atan', type: 'function', ariaLabel: 'Arc Tangent', className: 'btn-function' },
  { label: 'e', value: 'e', type: 'constant', ariaLabel: 'Euler\'s number', className: 'btn-constant' },
  { label: 'log', value: 'log', type: 'function', ariaLabel: 'Logarithm base 10', className: 'btn-function' },
  { label: 'ln', value: 'ln', type: 'function', ariaLabel: 'Natural Logarithm', className: 'btn-function' },
  { label: 'log₂', value: 'log2', type: 'function', ariaLabel: 'Logarithm base 2', className: 'btn-function' },
  { label: '(', value: '(', type: 'operator', ariaLabel: 'Open Parenthesis', className: 'btn-paren' },
  { label: 'x²', value: '^2', type: 'operator', ariaLabel: 'Square', className: 'btn-function' },
  { label: 'x³', value: '^3', type: 'operator', ariaLabel: 'Cube', className: 'btn-function' },
  { label: 'xʸ', value: '^', type: 'operator', ariaLabel: 'Power', className: 'btn-function' },
  { label: ')', value: ')', type: 'operator', ariaLabel: 'Close Parenthesis', className: 'btn-paren' },
  { label: '√', value: 'sqrt', type: 'function', ariaLabel: 'Square Root', className: 'btn-function' },
  { label: '∛', value: 'cbrt', type: 'function', ariaLabel: 'Cube Root', className: 'btn-function' },
  { label: '10ˣ', value: '10^', type: 'operator', ariaLabel: '10 to the power', className: 'btn-function' },
  { label: 'eˣ', value: 'e^', type: 'operator', ariaLabel: 'e to the power', className: 'btn-function' },
  { label: '|x|', value: 'abs', type: 'function', ariaLabel: 'Absolute Value', className: 'btn-function' },
  { label: 'n!', value: 'factorial', type: 'function', ariaLabel: 'Factorial', className: 'btn-function' },
  { label: '%', value: '%', type: 'operator', ariaLabel: 'Percent', className: 'btn-function' },
  { label: 'DEG', value: 'toggleAngle', type: 'toggle', className: 'btn-toggle' },
];

/**
 * Keypad component with calculator buttons
 */
export function Keypad({
  mode,
  angleUnit,
  onDigit,
  onOperator,
  onFunction,
  onConstant,
  onAction,
  onToggleAngleUnit,
}: KeypadProps) {
  const handleClick = (button: ButtonDef) => {
    switch (button.type) {
      case 'digit':
        onDigit(button.value);
        break;
      case 'operator':
        onOperator(button.value);
        break;
      case 'function':
        onFunction(button.value);
        break;
      case 'constant':
        onConstant(button.value);
        break;
      case 'action':
        onAction(button.value as 'clear' | 'allClear' | 'backspace' | 'equals' | 'ans');
        break;
      case 'toggle':
        if (button.value === 'toggleAngle') {
          onToggleAngleUnit();
        }
        break;
    }
  };

  const showScientific = mode === 'scientific' || mode === 'statistics';

  return (
    <div class="keypad-container">
      {showScientific && (
        <div class="keypad keypad-scientific">
          {SCIENTIFIC_BUTTONS.map((button) => {
            // Special handling for angle toggle button
            if (button.value === 'toggleAngle') {
              return (
                <button
                  key={button.value}
                  class={`btn ${button.className || ''}`}
                  onClick={() => handleClick(button)}
                  aria-label={button.ariaLabel || button.label}
                  aria-pressed={angleUnit === 'deg'}
                >
                  {angleUnit === 'deg' ? 'DEG' : 'RAD'}
                </button>
              );
            }

            return (
              <button
                key={button.value}
                class={`btn ${button.className || ''}`}
                onClick={() => handleClick(button)}
                aria-label={button.ariaLabel || button.label}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      )}

      <div class="keypad keypad-basic">
        {BASIC_BUTTONS.map((button) => (
          <button
            key={button.value}
            class={`btn ${button.className || ''}`}
            onClick={() => handleClick(button)}
            aria-label={button.ariaLabel || button.label}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
