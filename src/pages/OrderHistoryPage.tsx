import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/orders.api'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { OrderHistorySkeleton } from '../components/common/SkeletonLoader'
import { formatPrice, formatDate } from '../utils/formatters'
import type { Order } from '../types'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = () => {
    setIsLoading(true)
    setError(null)
    getOrders()
      .then((data) => {
        // Sort newest first
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setOrders(sorted)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        <OrderHistorySkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={fetchOrders} />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <EmptyState
          message="No orders yet"
          description="Your order history will appear here once you make a purchase."
          actionLabel="Browse Products"
          actionHref="/"
          icon="📦"
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Order #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </p>
              <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
            </div>

            <div className="mt-3 flex justify-end">
              <Link
                to={`/orders/${order.id}`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Details →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
