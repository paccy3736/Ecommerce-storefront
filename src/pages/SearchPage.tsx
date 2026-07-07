import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { ProductGrid } from '../components/product/ProductGrid'
import { Pagination } from '../components/common/Pagination'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const { products, isLoading, error, pagination, refetch } = useProducts({
    initialFilters: { searchQuery: query },
    pageSize: 12,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? `Results for "${query}"` : 'All Products'}
        </h1>
        {!isLoading && (
          <p className="text-sm text-gray-500 mt-1">
            {pagination.totalItems} result{pagination.totalItems !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !isLoading && products.length === 0 ? (
        <EmptyState
          message={`No results for "${query}"`}
          description="Try a different search term."
          actionLabel="Back to Products"
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
