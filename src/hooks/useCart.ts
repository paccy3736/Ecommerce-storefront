import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { useCartStore } from '../store/cart.store'
import toast from 'react-hot-toast'

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const cartStore = useCartStore()
  const navigate = useNavigate()

  const addToCart = async (variantId: string, quantity: number) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await cartStore.addItem(variantId, quantity)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error((err as Error).message || 'Failed to add to cart')
    }
  }

  return {
    ...cartStore,
    addToCart,
    totalItems: cartStore.getTotalItems(),
    totalPrice: cartStore.getTotalPrice(),
  }
}
