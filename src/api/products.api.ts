import apiClient from './client'
import type { Product, PaginatedResponse, GetProductsParams } from '../types'

export const getProducts = (params: GetProductsParams = {}): Promise<PaginatedResponse<Product>> =>
  apiClient
    .get<PaginatedResponse<Product>>('/api/public/products', { params })
    .then((r) => r.data)

export const getProductById = (id: string): Promise<Product> =>
  apiClient.get<Product>(`/api/public/products/${id}`).then((r) => r.data)

export const getProductsByCategory = (
  categoryId: string,
  params: Omit<GetProductsParams, 'categoryId'> = {}
): Promise<PaginatedResponse<Product>> =>
  apiClient
    .get<PaginatedResponse<Product>>(`/api/public/products/category/${categoryId}`, { params })
    .then((r) => r.data)
