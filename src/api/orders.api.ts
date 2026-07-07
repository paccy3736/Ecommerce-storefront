import apiClient from './client'
import type { Order } from '../types'

export const placeOrder = (): Promise<Order> =>
  apiClient.post<Order>('/api/auth/orders').then((r) => r.data)

export const getOrders = (): Promise<Order[]> =>
  apiClient.get<Order[]>('/api/auth/orders').then((r) => r.data)

export const getOrderById = (id: string): Promise<Order> =>
  apiClient.get<Order>(`/api/auth/orders/${id}`).then((r) => r.data)
