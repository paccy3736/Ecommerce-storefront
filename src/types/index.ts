// Authentication
export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

// Products
export interface Variant {
  id: string
  size?: string
  color?: string
  stock: number
  price: number
}

export interface Product {
  id: string
  name: string
  description: string
  images: string[]
  categoryId: string
  category?: Category
  variants: Variant[]
  // Flat fields returned by the API (no variants)
  price?: number
  stock?: number
  brand?: string
  orderCount?: number
  createdAt: string
  updatedAt: string
}

export type ProductSortKey = 'name' | 'price_asc' | 'price_desc' | 'newest'

export interface ProductFilters {
  categoryId: string | null
  minPrice: number | null
  maxPrice: number | null
  sortBy: ProductSortKey
  searchQuery: string
}

// Categories
export interface Category {
  id: string
  name: string
  description?: string
  imageUrl?: string
  createdAt: string
}

// Cart
export interface CartItem {
  id: string
  productId: string
  variantId: string
  product: Product
  variant: Variant
  quantity: number
  subtotal: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  total: number
  itemCount: number
}

// Orders
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string
  productId: string
  variantId: string
  product: Product
  variant: Variant
  quantity: number
  priceAtPurchase: number
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: string
  updatedAt: string
}

// API Responses
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SuccessResponse<T = void> {
  message: string
  data?: T
}

export interface ErrorResponse {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// UI State
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

// API Params
export interface GetProductsParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}
