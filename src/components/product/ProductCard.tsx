import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { formatPrice } from '../../utils/formatters'

interface ProductCardProps {
  product: Product
  showQuickAdd?: boolean
  onQuickAdd?: (product: Product) => void
}

export function ProductCard({ product, showQuickAdd = false, onQuickAdd }: ProductCardProps) {
  // Support both flat price (API) and variant-based price
  const minPrice =
    product.variants && product.variants.length > 0
      ? Math.min(...product.variants.map((v) => v.price))
      : (product.price ?? 0)

  const firstImage = product.images && product.images.length > 0 ? product.images[0] : ''

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100" style={{ paddingBottom: '75%' }}>
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              loading="lazy"
              width={400}
              height={300}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23e5e7eb"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3ENo image%3C/text%3E%3C/svg%3E'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {product.category && (
          <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2">
            {product.category.name}
          </span>
        )}
        <Link to={`/products/${product.id}`} className="block">
          <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-indigo-600 transition-colors leading-snug">
            {product.name}
          </h2>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">{formatPrice(minPrice)}</span>
          {product.variants.length > 1 && (
            <span className="text-xs text-gray-400">{product.variants.length} variants</span>
          )}
        </div>

        {showQuickAdd && (
          <button
            onClick={() => onQuickAdd?.(product)}
            className="mt-3 w-full text-sm bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  )
}
