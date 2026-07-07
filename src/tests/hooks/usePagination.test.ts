import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination } from '../../hooks/usePagination'

describe('usePagination', () => {
  it('starts at page 1', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    expect(result.current.currentPage).toBe(1)
  })

  it('calculates totalPages correctly', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    expect(result.current.totalPages).toBe(10)
  })

  it('rounds up for non-divisible totals', () => {
    const { result } = renderHook(() => usePagination(25, 10))
    expect(result.current.totalPages).toBe(3)
  })

  it('returns totalPages of 1 for empty list', () => {
    const { result } = renderHook(() => usePagination(0, 10))
    expect(result.current.totalPages).toBe(1)
  })

  it('hasNextPage is true when not on last page', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    expect(result.current.hasNextPage).toBe(true)
  })

  it('hasPrevPage is false on first page', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    expect(result.current.hasPrevPage).toBe(false)
  })

  it('goToPage navigates correctly', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    act(() => result.current.goToPage(5))
    expect(result.current.currentPage).toBe(5)
  })

  it('goToPage clamps to [1, totalPages]', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    act(() => result.current.goToPage(0))
    expect(result.current.currentPage).toBe(1)
    act(() => result.current.goToPage(999))
    expect(result.current.currentPage).toBe(10)
  })

  it('nextPage increments page', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    act(() => result.current.nextPage())
    expect(result.current.currentPage).toBe(2)
  })

  it('prevPage decrements page', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    act(() => result.current.goToPage(3))
    act(() => result.current.prevPage())
    expect(result.current.currentPage).toBe(2)
  })

  it('exposes a resetPage function', () => {
    const { result } = renderHook(() => usePagination(100, 10))
    act(() => result.current.goToPage(5))
    expect(result.current.currentPage).toBe(5)
    act(() => result.current.resetPage())
    expect(result.current.currentPage).toBe(1)
  })
})
