import apiClient from './client'
import type { Category } from '../types'

export const getCategories = (): Promise<Category[]> =>
  apiClient
    .get<{ data: Category[] }>('/api/categories')
    .then((r) => r.data.data)
