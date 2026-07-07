import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProductById } from '../api/products.api'
import { useCartStore } from '../store/cart.store'
import { useAuthStore } from '../store/auth.store'
import { VariantSelector } from '../components/product/VariantSelector'
import { ProductDetailSkeleton } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { ApiError } from '../api/client'
import { formatPrice, formatDate } from '../utils/formatters'
import type { Product, Variant } from '../types'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { addItem } = useCartStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    setNotFound(false)
    getProductById(id)
      .then((p) => {
        setProduct(p)
        // Auto-select first in-stock variant
        const firstInStock = p.variants.find((v) => v.stock > 0) ?? p.variants[0] ?? null
        setSelectedVariant(firstInStock)
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 404) {
          setNotFound(true)
        } else {
          setError((err as Error).message)
        }
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant')
      return
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } })
      return
    }
    setIsAddingToCart(true)
    try {
      await addItem(selectedVariant.id, quantity)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error((err as Error).message || 'Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) return <ProductDetailSkeleton />

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          message="Product not found"
          actionLabel="Back to Products"
          actionHref="/"
        />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error ?? 'Could not load product'} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  const maxQty = selectedVariant?.stock ?? 1

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
          <li>/</li>
          {product.category && (
            <>
              <li><Link to={`/categories/${product.categoryId}`} className="hover:text-indigo-600">{product.category.name}</Link></li>
              <li>/</li>
            </>
          )}
          <li className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ paddingBottom: '75%' }}>
            {product.images[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={`${product.name} — image ${activeImage + 1}`}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="450" fill="%23e5e7eb"%3E%3Crect width="600" height="450"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="16"%3ENo image%3C/text%3E%3C/svg%3E'
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-6xl">📦</div>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage ? 'border-indigo-500' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          {product.category && (
            <Link
              to={`/categories/${product.categoryId}`}
              className="inline-block text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          {selectedVariant && (
            <p className="text-3xl font-bold text-indigo-600">{formatPrice(selectedVariant.price)}</p>
          )}

          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

          {/* Variant selector */}
          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onChange={setSelectedVariant}
          />

          {/* Quantity */}
          {selectedVariant && selectedVariant.stock > 0 && (
            <div>
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={maxQty}
                  value={quantity}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(maxQty, Number(e.target.value)))
                    setQuantity(v)
                  }}
                  className="w-16 text-center border border-gray-300 rounded-lg py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  aria-label="Increase quantity"
                  className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  disabled={quantity >= maxQty}
                >
                  +
                </button>
                <span className="text-xs text-gray-400">Max: {maxQty}</span>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedVariant || selectedVariant.stock === 0}
            aria-busy={isAddingToCart}
            className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isAddingToCart
              ? 'Adding…'
              : !selectedVariant
              ? 'Select a Variant'
              : selectedVariant.stock === 0
              ? 'Out of Stock'
              : 'Add to Cart'}
          </button>

          {/* Meta */}
          <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1">
            <p>Added {formatDate(product.createdAt)}</p>
            <p>Product ID: {product.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
