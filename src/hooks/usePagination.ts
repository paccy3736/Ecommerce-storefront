import { useState, useCallback } from 'react'

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  hasNextPage: boolean
  hasPrevPage: boolean
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  resetPage: () => void
}

/**
 * Manages pagination state.
 * Invariant: 1 <= currentPage <= totalPages always holds.
 * Call resetPage() explicitly when filters change — do NOT auto-reset on totalItems
 * change, as that causes infinite loops when totalItems is set by the fetcher.
 */
export function usePagination(totalItems: number, pageSize: number = 12): PaginationState {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const goToPage = useCallback((page: number) => {
    setCurrentPage((prev) => {
      const max = Math.max(1, Math.ceil(totalItems / pageSize))
      const clamped = Math.max(1, Math.min(page, max))
      return clamped === prev ? prev : clamped
    })
  }, [totalItems, pageSize])

  const resetPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
    resetPage,
  }
}
