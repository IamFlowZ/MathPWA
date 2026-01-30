import type { HistoryEntry } from '../types';

interface HistoryProps {
  entries: HistoryEntry[];
  onClear: () => void;
  onSelectExpression?: (expression: string) => void;
  onSelectResult?: (result: string) => void;
}

/**
 * Format timestamp for display
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * History panel component
 */
export function History({
  entries,
  onClear,
  onSelectExpression,
  onSelectResult,
}: HistoryProps) {
  if (entries.length === 0) {
    return (
      <div class="history-panel">
        <div class="history-header">
          <span class="history-title">History</span>
        </div>
        <div class="history-empty">No calculations yet</div>
      </div>
    );
  }

  return (
    <div class="history-panel">
      <div class="history-header">
        <span class="history-title">History ({entries.length})</span>
        <button class="history-clear-btn" onClick={onClear} aria-label="Clear history">
          Clear
        </button>
      </div>
      <div class="history-list">
        {entries.map((entry) => (
          <div key={entry.id} class="history-item">
            <div
              class="history-expression"
              onClick={() => onSelectExpression?.(entry.expression)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectExpression?.(entry.expression);
                }
              }}
              title="Click to use expression"
            >
              {entry.expression}
            </div>
            <div
              class="history-result"
              onClick={() => onSelectResult?.(entry.result)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectResult?.(entry.result);
                }
              }}
              title="Click to insert result"
            >
              = {entry.result}
            </div>
            <div class="history-time">{formatTime(entry.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
