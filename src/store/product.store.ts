// Product state is managed in the useProducts hook for simplicity.
// This file exports a minimal store for shared filter state if needed across pages.
import { create } from 'zustand'
import type { ProductFilters } from '../types'

const DEFAULT_FILTERS: ProductFilters = {
  categoryId: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
  searchQuery: '',
}

interface ProductStore {
  filters: ProductFilters
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void
  resetFilters: () => void
}

export const useProductStore = create<ProductStore>()((set) => ({
  filters: { ...DEFAULT_FILTERS },

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
}))
