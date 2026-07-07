import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../api/categories.api'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { SkeletonGrid } from '../components/common/SkeletonLoader'
import type { Category } from '../types'

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = () => {
    setIsLoading(true)
    setError(null)
    getCategories()
      .then(setCategories)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h1>

      {isLoading ? (
        <SkeletonGrid count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCategories} />
      ) : categories.length === 0 ? (
        <EmptyState message="No categories available" actionLabel="Browse Products" actionHref="/" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {category.imageUrl ? (
                <div className="relative overflow-hidden bg-gray-100" style={{ paddingBottom: '56.25%' }}>
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                  <span className="text-5xl">🏷️</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
