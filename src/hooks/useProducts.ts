import { useState, useCallback, useEffect, useRef } from 'react'
import { getProducts } from '../api/products.api'
import type { Product, ProductFilters } from '../types'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'
import type { PaginationState } from './usePagination'

interface UseProductsOptions {
  initialFilters?: Partial<ProductFilters>
  pageSize?: number
  categoryId?: string
}

interface UseProductsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
  filters: ProductFilters
  pagination: PaginationState
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void
  resetFilters: () => void
  refetch: () => void
}

const DEFAULT_FILTERS: ProductFilters = {
  categoryId: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
  searchQuery: '',
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const pageSize = options.pageSize ?? 12
  const externalCategoryId = options.categoryId

  // Store initialFilters in a ref so it never changes reference
  const initialFiltersRef = useRef<ProductFilters>({
    ...DEFAULT_FILTERS,
    ...options.initialFilters,
  })

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>(initialFiltersRef.current)

  // Debounce only the search string
  const debouncedSearch = useDebounce(filters.searchQuery, 350)

  const pagination = usePagination(total, pageSize)

  // Keep a ref to current fetch params so the callback always reads latest values
  const fetchParamsRef = useRef({
    currentPage: pagination.currentPage,
    debouncedSearch,
    categoryId: filters.categoryId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    pageSize,
    externalCategoryId,
  })
  fetchParamsRef.current = {
    currentPage: pagination.currentPage,
    debouncedSearch,
    categoryId: filters.categoryId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    pageSize,
    externalCategoryId,
  }

  const fetchProducts = useCallback(async () => {
    const p = fetchParamsRef.current
    setIsLoading(true)
    setError(null)
    try {
      const params: Record<string, unknown> = {
        page: p.currentPage,
        limit: p.pageSize,
      }
      if (p.debouncedSearch) params.search = p.debouncedSearch
      if (p.externalCategoryId) params.categoryId = p.externalCategoryId
      else if (p.categoryId) params.categoryId = p.categoryId
      if (p.minPrice !== null) params.minPrice = p.minPrice
      if (p.maxPrice !== null) params.maxPrice = p.maxPrice

      const response = await getProducts(params)

      // The API returns: { success: true, data: { grouped: { under50: [], between50And150: [], over150: [] } } }
      // OR a flat array, OR { data: [], total: n } — handle all cases
      const raw = response as unknown
      let items: Product[] = []
      let totalCount = 0

      if (Array.isArray(raw)) {
        items = raw as Product[]
        totalCount = items.length
      } else if (raw && typeof raw === 'object') {
        const obj = raw as Record<string, unknown>

        // Case 1: { success, data: { grouped: { under50, between50And150, over150 } } }
        if (obj['data'] && typeof obj['data'] === 'object') {
          const dataObj = obj['data'] as Record<string, unknown>
          if (dataObj['grouped'] && typeof dataObj['grouped'] === 'object') {
            const grouped = dataObj['grouped'] as Record<string, unknown>
            const allProducts = [
              ...((grouped['under50'] as Product[]) ?? []),
              ...((grouped['between50And150'] as Product[]) ?? []),
              ...((grouped['over150'] as Product[]) ?? []),
            ]
            items = allProducts
            totalCount = (obj['total'] as number) ?? (dataObj['total'] as number) ?? items.length
          } else if (Array.isArray(dataObj)) {
            items = dataObj as Product[]
            totalCount = items.length
          } else if (Array.isArray(obj['data'])) {
            items = obj['data'] as Product[]
            totalCount = typeof obj['total'] === 'number' ? obj['total'] : items.length
          }
        } else if (Array.isArray(obj['products'])) {
          items = obj['products'] as Product[]
          totalCount = typeof obj['total'] === 'number' ? obj['total'] : items.length
        } else if (Array.isArray(obj['items'])) {
          items = obj['items'] as Product[]
          totalCount = typeof obj['total'] === 'number' ? obj['total'] : items.length
        }
      }

      // Normalize each product — ensure variants array exists and price is available
      const normalized = items.map((p) => {
        const product = p as Product & { price?: number; stock?: number }
        // If the API returns flat price/stock instead of variants, create a synthetic variant
        if ((!product.variants || product.variants.length === 0) && product.price !== undefined) {
          return {
            ...product,
            variants: [{
              id: `${product.id}-default`,
              price: product.price,
              stock: product.stock ?? 0,
            }],
          }
        }
        return { ...product, variants: product.variants ?? [] }
      })

      setProducts(normalized)
      setTotal(totalCount)
    } catch (err) {
      setError((err as Error).message)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, []) // stable — reads everything from ref

  // Track what changed to know when to refetch vs when to reset page
  const prevFiltersRef = useRef({
    debouncedSearch,
    categoryId: filters.categoryId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    externalCategoryId,
  })

  useEffect(() => {
    const prev = prevFiltersRef.current
    const filtersChanged =
      prev.debouncedSearch !== debouncedSearch ||
      prev.categoryId !== filters.categoryId ||
      prev.minPrice !== filters.minPrice ||
      prev.maxPrice !== filters.maxPrice ||
      prev.externalCategoryId !== externalCategoryId

    if (filtersChanged) {
      // Reset to page 1 when filters change, then fetch
      pagination.resetPage()
      prevFiltersRef.current = {
        debouncedSearch,
        categoryId: filters.categoryId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        externalCategoryId,
      }
    }

    void fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.currentPage,
    debouncedSearch,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    externalCategoryId,
  ])

  const setFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters({ ...initialFiltersRef.current })
  }, [])

  return {
    products,
    isLoading,
    error,
    filters,
    pagination,
    setFilter,
    resetFilters,
    refetch: fetchProducts,
  }
}
