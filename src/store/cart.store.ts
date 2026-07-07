import { create } from 'zustand'
import type { Cart } from '../types'

interface CartStore {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  isOpen: boolean
  fetchCart: () => Promise<void>
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  toggleDrawer: () => void
  closeDrawer: () => void
  setCart: (cart: Cart | null) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,
  isOpen: false,

  getTotalItems: () => {
    const cart = get().cart
    if (!cart) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  getTotalPrice: () => {
    return get().cart?.total ?? 0
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const { getCart } = await import('../api/cart.api')
      const cart = await getCart()
      set({ cart, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  addItem: async (variantId: string, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      const { addCartItem } = await import('../api/cart.api')
      const cart = await addCartItem(variantId, quantity)
      set({ cart, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
      throw err
    }
  },

  updateItem: async (itemId: string, quantity: number) => {
    const previousCart = get().cart
    // Optimistic update
    if (previousCart) {
      const optimisticCart: Cart = {
        ...previousCart,
        items: previousCart.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, subtotal: item.variant.price * quantity }
            : item
        ),
        total: previousCart.items.reduce((sum, item) => {
          const q = item.id === itemId ? quantity : item.quantity
          return sum + item.variant.price * q
        }, 0),
      }
      set({ cart: optimisticCart })
    }
    try {
      const { updateCartItem } = await import('../api/cart.api')
      const cart = await updateCartItem(itemId, quantity)
      set({ cart })
    } catch (err) {
      set({ cart: previousCart, error: (err as Error).message })
      throw err
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const { removeCartItem } = await import('../api/cart.api')
      const cart = await removeCartItem(itemId)
      set({ cart })
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  clearCart: async () => {
    try {
      const { clearCart } = await import('../api/cart.api')
      await clearCart()
      set({ cart: null })
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    }
  },

  toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),
  closeDrawer: () => set({ isOpen: false }),
  setCart: (cart) => set({ cart }),
}))
