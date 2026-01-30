import type { AngleUnit } from '../types';

interface ModeToggleProps {
  angleUnit: AngleUnit;
  onToggle: () => void;
}

/**
 * Toggle button for DEG/RAD mode
 */
export function ModeToggle({ angleUnit, onToggle }: ModeToggleProps) {
  return (
    <button
      class="btn btn-toggle mode-toggle-btn"
      onClick={onToggle}
      aria-label={`Current angle unit: ${angleUnit === 'deg' ? 'degrees' : 'radians'}. Click to toggle.`}
      aria-pressed={angleUnit === 'deg'}
    >
      {angleUnit === 'deg' ? 'DEG' : 'RAD'}
    </button>
  );
}
