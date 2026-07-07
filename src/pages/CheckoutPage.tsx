import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cart.store'
import { placeOrder } from '../api/orders.api'
import { CartSkeleton } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { formatPrice } from '../utils/formatters'
import { ApiError } from '../api/client'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, isLoading, error, fetchCart, clearCart, getTotalPrice } = useCartStore()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  useEffect(() => {
    void fetchCart()
  }, [fetchCart])

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) return
    setIsPlacingOrder(true)
    setOrderError(null)
    try {
      const order = await placeOrder()
      await clearCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to place order'
      setOrderError(msg)
      toast.error(msg)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
        <CartSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={() => fetchCart()} />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <EmptyState
          message="Your cart is empty"
          description="Add items to your cart before checking out."
          actionLabel="Shop Now"
          actionHref="/"
          icon="🛒"
        />
      </div>
    )
  }

  const total = getTotalPrice()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {orderError && (
        <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {orderError}
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Order Summary</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {cart.items.map((item) => {
            const variantLabel = [item.variant.size, item.variant.color].filter(Boolean).join(' / ')
            return (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                  {variantLabel && <p className="text-xs text-gray-500">{variantLabel}</p>}
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">{formatPrice(item.subtotal)}</span>
              </div>
            )
          })}
        </div>
        <div className="px-5 py-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span className="text-indigo-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || cart.items.length === 0}
          aria-busy={isPlacingOrder}
          className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPlacingOrder ? 'Placing Order…' : `Place Order — ${formatPrice(total)}`}
        </button>
        <Link
          to="/cart"
          className="block w-full py-3 border border-gray-300 text-gray-700 text-center font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          ← Back to Cart
        </Link>
      </div>
    </div>
  )
}
