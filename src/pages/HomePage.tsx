import { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { ProductGrid } from '../components/product/ProductGrid'
import { ProductFilters } from '../components/product/ProductFilters'
import { Pagination } from '../components/common/Pagination'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { getCategories } from '../api/categories.api'
import type { Category } from '../types'

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const { products, isLoading, error, filters, pagination, setFilter, resetFilters, refetch } =
    useProducts({ pageSize: 12 })

  useEffect(() => {
    getCategories()
      .then((data) => {
        // Normalize categories API response
        const raw = data as unknown
        if (Array.isArray(raw)) {
          setCategories(raw as Category[])
        } else if (raw && typeof raw === 'object') {
          const obj = raw as Record<string, unknown>
          const list = obj['data'] ?? obj['categories'] ?? obj['items'] ?? []
          setCategories(Array.isArray(list) ? (list as Category[]) : [])
        }
      })
      .catch(() => setCategories([]))
      .finally(() => setCategoriesLoading(false))
  }, [])

  const handleFiltersChange = (updates: Partial<typeof filters>) => {
    Object.entries(updates).forEach(([k, v]) => {
      setFilter(k as keyof typeof filters, v as never)
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Filters — full width above the grid */}
      <ProductFilters
        categories={categories}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={resetFilters}
        isLoading={categoriesLoading}
      />

      {/* Page header */}
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        {!isLoading && (
          <p className="text-sm text-gray-500 mt-1">
            {pagination.totalItems} product{pagination.totalItems !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Product grid */}
      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !isLoading && products.length === 0 ? (
        <EmptyState
          message="No products found"
          description="Try adjusting your filters or search query."
          actionLabel="Clear Filters"
          actionHref="/"
          icon="🔍"
        />
      ) : (
        <>
          <ProductGrid products={products} isLoading={isLoading} />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
          />
        </>
      )}
    </div>
  )
}
