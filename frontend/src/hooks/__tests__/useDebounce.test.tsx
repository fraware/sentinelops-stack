
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast forward time by 299ms
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast forward by 1 more ms to complete the delay
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated'); // Now should be updated
  });

  it('resets timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    // Change value multiple times rapidly
    rerender({ value: 'first', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'second', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'final', delay: 300 });
    
    // After 200ms, should still be initial
    expect(result.current).toBe('initial');

    // After full delay, should be the final value
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('final');
  });
});
