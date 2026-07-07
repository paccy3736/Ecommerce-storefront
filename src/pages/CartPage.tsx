import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cart.store'
import { CartItem } from '../components/cart/CartItem'
import { CartSkeleton } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { EmptyState } from '../components/common/EmptyState'
import { formatPrice } from '../utils/formatters'

export default function CartPage() {
  const { cart, isLoading, error, fetchCart, getTotalItems, getTotalPrice } = useCartStore()

  useEffect(() => {
    void fetchCart()
  }, [fetchCart])

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        <CartSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={() => fetchCart()} />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          message="Your cart is empty"
          description="Browse our products and add something you love."
          actionLabel="Start Shopping"
          actionHref="/"
          icon="🛒"
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Shopping Cart{' '}
        <span className="text-base font-normal text-gray-500">
          ({totalItems} item{totalItems !== 1 ? 's' : ''})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
            <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(totalPrice)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 block w-full py-3 bg-indigo-600 text-white text-center font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/"
              className="mt-2 block w-full py-2.5 border border-gray-300 text-gray-700 text-center text-sm rounded-xl hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
