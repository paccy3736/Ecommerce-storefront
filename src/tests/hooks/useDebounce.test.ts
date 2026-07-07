import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../../hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 350))
    expect(result.current).toBe('hello')
  })

  it('does not update within delay window', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 350), {
      initialProps: { val: 'hello' },
    })
    rerender({ val: 'world' })
    // Not advanced yet
    expect(result.current).toBe('hello')
  })

  it('updates after delay elapses', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 350), {
      initialProps: { val: 'hello' },
    })
    rerender({ val: 'world' })
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(result.current).toBe('world')
  })

  it('resets timer on rapid changes and only emits final value', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 350), {
      initialProps: { val: 'a' },
    })
    rerender({ val: 'b' })
    act(() => { vi.advanceTimersByTime(200) })
    rerender({ val: 'c' })
    act(() => { vi.advanceTimersByTime(200) })
    // 'b' timer was cancelled, still on 'a'
    expect(result.current).toBe('a')
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe('c')
  })
})
