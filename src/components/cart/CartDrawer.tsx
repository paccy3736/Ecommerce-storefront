import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cart.store'
import { useAuthStore } from '../../store/auth.store'
import { CartItem } from './CartItem'
import { EmptyState } from '../common/EmptyState'
import { formatPrice } from '../../utils/formatters'

export function CartDrawer() {
  const { cart, isOpen, closeDrawer, fetchCart } = useCartStore()
  const totalItems = useCartStore((s) =>
    s.cart ? s.cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0
  )
  const totalPrice = useCartStore((s) => s.cart?.total ?? 0)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Fetch cart when drawer opens and user is authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      void fetchCart()
    }
  }, [isOpen, isAuthenticated, fetchCart])

  // Trap focus within drawer
  useEffect(() => {
    if (isOpen) {
      drawerRef.current?.focus()
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeDrawer()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, closeDrawer])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-xl flex flex-col focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">
            Cart {totalItems > 0 && <span className="text-indigo-600">({totalItems})</span>}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="text-gray-400 hover:text-gray-600 text-xl p-1"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <span className="text-5xl mb-4">🔒</span>
              <p className="text-gray-600 mb-4">Sign in to view your cart</p>
              <button
                onClick={() => { closeDrawer(); navigate('/login') }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
              >
                Sign In
              </button>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <EmptyState
              message="Your cart is empty"
              description="Add items to get started"
              actionLabel="Browse Products"
              actionHref="/"
              icon="🛒"
            />
          ) : (
            cart.items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && cart && cart.items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex gap-3">
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-50 transition-colors"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={closeDrawer}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium text-center hover:bg-indigo-700 transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
