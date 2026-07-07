import type { Category, ProductFilters } from '../../types'

interface ProductFiltersProps {
  categories: Category[]
  filters: ProductFilters
  onFiltersChange: (updates: Partial<ProductFilters>) => void
  onReset: () => void
  isLoading?: boolean
}

export function ProductFilters({
  categories,
  filters,
  onFiltersChange,
  onReset,
  isLoading = false,
}: ProductFiltersProps) {
  const hasActiveFilters =
    filters.categoryId !== null ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.searchQuery !== ''

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 mb-6"
      aria-label="Product filters"
    >
      <div className="flex flex-wrap items-end gap-4">

        {/* Category */}
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Category
          </label>
          <select
            value={filters.categoryId ?? ''}
            onChange={(e) =>
              onFiltersChange({ categoryId: e.target.value || null })
            }
            aria-label="Filter by category"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Categories</option>
            {isLoading
              ? null
              : categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min $"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onFiltersChange({ minPrice: e.target.value ? Number(e.target.value) : null })
              }
              aria-label="Minimum price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-gray-400 text-sm flex-shrink-0">–</span>
            <input
              type="number"
              placeholder="Max $"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onFiltersChange({ maxPrice: e.target.value ? Number(e.target.value) : null })
              }
              aria-label="Maximum price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFiltersChange({ sortBy: e.target.value as ProductFilters['sortBy'] })
            }
            aria-label="Sort products"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Reset button — only shows when filters are active */}
        {hasActiveFilters && (
          <div className="flex-shrink-0 pb-0.5">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              aria-label="Reset all filters"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
