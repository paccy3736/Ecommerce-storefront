import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../api/orders.api'
import { ErrorState } from '../components/common/ErrorState'
import { OrderHistorySkeleton } from '../components/common/SkeletonLoader'
import { formatPrice, formatDate } from '../utils/formatters'
import { ApiError } from '../api/client'
import type { Order } from '../types'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    getOrderById(id)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 404) setNotFound(true)
        else setError((err as Error).message)
      })
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <OrderHistorySkeleton />
      </div>
    )
  }

  if (notFound || (!isLoading && !order)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorState
          message="Order not found"
          actionLabel="View All Orders"
          actionHref="/orders"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link to="/orders" className="hover:text-indigo-600">My Orders</Link></li>
          <li>/</li>
          <li className="text-gray-800 font-medium">#{order.id.slice(-8).toUpperCase()}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            Items ({order.items.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => {
            const variantLabel = [item.variant.size, item.variant.color].filter(Boolean).join(' / ')
            return (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.productId}`}
                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 truncate block"
                  >
                    {item.product.name}
                  </Link>
                  {variantLabel && <p className="text-xs text-gray-500 mt-0.5">{variantLabel}</p>}
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.priceAtPurchase * item.quantity)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="px-5 py-4 border-t border-gray-200 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span className="text-indigo-600">{formatPrice(order.total)}</span>
        </div>
      </div>

      <Link
        to="/orders"
        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Orders
      </Link>
    </div>
  )
}
