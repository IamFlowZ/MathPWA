import { useState, useCallback, useRef } from 'preact/hooks';
import { Calculator } from './components/Calculator';
import { History } from './components/History';
import { useHistory } from './hooks/useHistory';
import type { CalculatorMode, Theme } from './types';

/**
 * Main application component
 */
export function App() {
  const [theme, setTheme] = useState<Theme>('system');
  const [currentMode, setCurrentMode] = useState<CalculatorMode>('scientific');
  const history = useHistory();

  // Ref to calculator for setting expressions from history
  const calculatorSetExpression = useRef<((expr: string) => void) | null>(null);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      let newTheme: Theme;
      if (current === 'system') {
        newTheme = 'dark';
      } else if (current === 'dark') {
        newTheme = 'light';
      } else {
        newTheme = 'system';
      }

      // Apply theme to document
      if (newTheme === 'system') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', newTheme);
      }

      return newTheme;
    });
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return '🌙';
      case 'light':
        return '☀️';
      default:
        return '💻';
    }
  };

  const handleSelectExpression = useCallback((expression: string) => {
    calculatorSetExpression.current?.(expression);
  }, []);

  const handleSelectResult = useCallback((result: string) => {
    calculatorSetExpression.current?.(result);
  }, []);

  const showHistory =
    currentMode !== 'graphing' &&
    currentMode !== 'statistics' &&
    history.entries.length > 0;

  return (
    <div class="app">
      <header class="app-header">
        <h1 class="app-title">MathPWA</h1>
        <button
          class="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Current theme: ${theme}. Click to change.`}
          title={`Theme: ${theme}`}
        >
          {getThemeIcon()}
        </button>
      </header>

      <main class="app-main">
        <Calculator
          onHistoryAdd={history.addEntry}
          onModeChange={setCurrentMode}
        />

        {showHistory && (
          <History
            entries={history.entries}
            onClear={history.clearHistory}
            onSelectExpression={handleSelectExpression}
            onSelectResult={handleSelectResult}
          />
        )}
      </main>
    </div>
  );
}
