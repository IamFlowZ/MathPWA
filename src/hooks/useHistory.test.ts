import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/preact';
import { useHistory } from './useHistory';
import type { HistoryEntry } from '../types';

describe('useHistory', () => {
  // Mock localStorage
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
      }),
    });

    // Clear storage before each test
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const createEntry = (id: string, expression: string, result: string): HistoryEntry => ({
    id,
    expression,
    result,
    timestamp: Date.now(),
  });

  it('initializes with empty entries', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });

  it('loads entries from localStorage on init', () => {
    const storedEntries: HistoryEntry[] = [
      createEntry('1', '2+2', '4'),
      createEntry('2', '3*3', '9'),
    ];
    mockStorage['mathpwa-history'] = JSON.stringify(storedEntries);

    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries[0].expression).toBe('2+2');
  });

  it('adds entries to the beginning', () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.addEntry(createEntry('1', '2+2', '4'));
    });

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].expression).toBe('2+2');

    act(() => {
      result.current.addEntry(createEntry('2', '3*3', '9'));
    });

    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries[0].expression).toBe('3*3');
    expect(result.current.entries[1].expression).toBe('2+2');
  });

  it('limits entries to 100 (FIFO)', () => {
    const { result } = renderHook(() => useHistory());

    // Add 101 entries
    act(() => {
      for (let i = 0; i < 101; i++) {
        result.current.addEntry(createEntry(`${i}`, `${i}+1`, `${i + 1}`));
      }
    });

    expect(result.current.entries).toHaveLength(100);
    // Most recent should be first
    expect(result.current.entries[0].expression).toBe('100+1');
    // Oldest (entry 0) should be removed, entry 1 should be last
    expect(result.current.entries[99].expression).toBe('1+1');
  });

  it('clears all entries', () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.addEntry(createEntry('1', '2+2', '4'));
      result.current.addEntry(createEntry('2', '3*3', '9'));
    });

    expect(result.current.entries).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.entries).toHaveLength(0);
  });

  it('removes a specific entry', () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.addEntry(createEntry('1', '2+2', '4'));
      result.current.addEntry(createEntry('2', '3*3', '9'));
      result.current.addEntry(createEntry('3', '4/2', '2'));
    });

    expect(result.current.entries).toHaveLength(3);

    act(() => {
      result.current.removeEntry('2');
    });

    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries.find((e) => e.id === '2')).toBeUndefined();
  });

  it('saves to localStorage when entries change', () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.addEntry(createEntry('1', '2+2', '4'));
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'mathpwa-history',
      expect.any(String)
    );

    const saved = JSON.parse(mockStorage['mathpwa-history']);
    expect(saved).toHaveLength(1);
    expect(saved[0].expression).toBe('2+2');
  });

  it('handles invalid localStorage data gracefully', () => {
    mockStorage['mathpwa-history'] = 'not valid json';

    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });

  it('validates entries from localStorage', () => {
    // Store invalid entries mixed with valid ones
    mockStorage['mathpwa-history'] = JSON.stringify([
      { id: '1', expression: '2+2', result: '4', timestamp: 123 }, // valid
      { id: '2' }, // invalid - missing fields
      'not an object', // invalid
      null, // invalid
      { id: '3', expression: '3*3', result: '9', timestamp: 456 }, // valid
    ]);

    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toHaveLength(2);
  });
});
