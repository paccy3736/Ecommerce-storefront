import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategories } from '../api/categories.api'
import { useProducts } from '../hooks/useProducts'
import { ProductGrid } from '../components/product/ProductGrid'
import { ProductFilters } from '../components/product/ProductFilters'
import { Pagination } from '../components/common/Pagination'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import type { Category } from '../types'

export default function CategoryProductsPage() {
  const { id: categoryId } = useParams<{ id: string }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const currentCategory = categories.find((c) => c.id === categoryId)

  const { products, isLoading, error, filters, pagination, setFilter, resetFilters, refetch } =
    useProducts({
      categoryId: categoryId ?? '',
      initialFilters: { categoryId: categoryId ?? null },
      pageSize: 12,
    })

  useEffect(() => {
    getCategories()
      .then(setCategories)
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
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
          <li>/</li>
          <li><Link to="/categories" className="hover:text-indigo-600">Categories</Link></li>
          <li>/</li>
          <li className="text-gray-800 font-medium">{currentCategory?.name ?? 'Loading…'}</li>
        </ol>
      </nav>

      {/* Filters — horizontal bar on top */}
      <ProductFilters
        categories={categories}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={resetFilters}
        isLoading={categoriesLoading}
      />

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentCategory?.name ?? 'Category'}
        </h1>
        {currentCategory?.description && (
          <p className="text-gray-500 mt-1 text-sm">{currentCategory.description}</p>
        )}
        {!isLoading && (
          <p className="text-sm text-gray-450 mt-1">
            {pagination.totalItems} product{pagination.totalItems !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Grid */}
      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !isLoading && products.length === 0 ? (
        <EmptyState
          message="No products in this category"
          actionLabel="Browse All Products"
          actionHref="/"
          icon="📦"
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
