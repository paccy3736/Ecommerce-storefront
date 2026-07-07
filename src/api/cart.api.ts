import apiClient from './client'
import type { Cart, SuccessResponse } from '../types'

export const getCart = (): Promise<Cart> =>
  apiClient.get<Cart>('/api/auth/cart').then((r) => r.data)

export const addCartItem = (variantId: string, quantity: number): Promise<Cart> =>
  apiClient
    .post<Cart>('/api/auth/cart/items', { variantId, quantity })
    .then((r) => r.data)

export const updateCartItem = (itemId: string, quantity: number): Promise<Cart> =>
  apiClient
    .patch<Cart>(`/api/auth/cart/items/${itemId}`, { quantity })
    .then((r) => r.data)

export const removeCartItem = (itemId: string): Promise<Cart> =>
  apiClient.delete<Cart>(`/api/auth/cart/items/${itemId}`).then((r) => r.data)

export const clearCart = (): Promise<SuccessResponse> =>
  apiClient.delete<SuccessResponse>('/api/auth/cart').then((r) => r.data)
