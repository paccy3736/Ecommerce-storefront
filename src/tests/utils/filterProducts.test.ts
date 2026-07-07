import { describe, it, expect } from 'vitest'
import { filterAndSortProducts } from '../../utils/filterProducts'
import type { Product, ProductFilters } from '../../types'

const makeProduct = (overrides?: Partial<Product> & { price?: number }): Product => {
  const price = overrides?.price ?? 10
  return {
    id: Math.random().toString(36).slice(2),
    name: 'Test Product',
    description: 'A test product',
    images: [],
    categoryId: 'cat1',
    variants: [{ id: 'v1', price, stock: 10 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(overrides ?? {}),
  }
}

const defaultFilters: ProductFilters = {
  categoryId: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
  searchQuery: '',
}

describe('filterAndSortProducts', () => {
  it('returns all products when no filters applied', () => {
    const products = [makeProduct(), makeProduct(), makeProduct()]
    const result = filterAndSortProducts(products, defaultFilters)
    expect(result).toHaveLength(3)
  })

  it('returns empty array for empty input', () => {
    const result = filterAndSortProducts([], defaultFilters)
    expect(result).toHaveLength(0)
  })

  it('does not mutate input array', () => {
    const p1 = makeProduct({ name: 'B' })
    const p2 = makeProduct({ name: 'A' })
    const products = [p1, p2]
    filterAndSortProducts(products, { ...defaultFilters, sortBy: 'name' })
    expect(products[0]?.name).toBe('B')
    expect(products[1]?.name).toBe('A')
  })

  it('filters by categoryId', () => {
    const p1 = makeProduct({ categoryId: 'cat1' })
    const p2 = makeProduct({ categoryId: 'cat2' })
    const result = filterAndSortProducts([p1, p2], { ...defaultFilters, categoryId: 'cat1' })
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(p1.id)
  })

  it('filters by minPrice', () => {
    const cheap = makeProduct({ price: 5 })
    const expensive = makeProduct({ price: 50 })
    const result = filterAndSortProducts([cheap, expensive], { ...defaultFilters, minPrice: 20, maxPrice: null })
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(expensive.id)
  })

  it('filters by maxPrice', () => {
    const cheap = makeProduct({ price: 5 })
    const expensive = makeProduct({ price: 50 })
    const result = filterAndSortProducts([cheap, expensive], { ...defaultFilters, maxPrice: 10, minPrice: null })
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(cheap.id)
  })

  it('filters by search query (name)', () => {
    const p1 = makeProduct({ name: 'Red Shoes' })
    const p2 = makeProduct({ name: 'Blue Hat' })
    const result = filterAndSortProducts([p1, p2], { ...defaultFilters, searchQuery: 'shoe' })
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(p1.id)
  })

  it('filters by search query (description)', () => {
    const p1 = makeProduct({ description: 'comfortable walking shoe' })
    const p2 = makeProduct({ description: 'summer hat' })
    const result = filterAndSortProducts([p1, p2], { ...defaultFilters, searchQuery: 'shoe' })
    expect(result).toHaveLength(1)
  })

  it('sorts by price ascending', () => {
    const p1 = makeProduct({ price: 30 })
    const p2 = makeProduct({ price: 10 })
    const p3 = makeProduct({ price: 20 })
    const result = filterAndSortProducts([p1, p2, p3], { ...defaultFilters, sortBy: 'price_asc' })
    expect(result[0]?.variants[0]?.price).toBe(10)
    expect(result[1]?.variants[0]?.price).toBe(20)
    expect(result[2]?.variants[0]?.price).toBe(30)
  })

  it('sorts by price descending', () => {
    const p1 = makeProduct({ price: 10 })
    const p2 = makeProduct({ price: 30 })
    const result = filterAndSortProducts([p1, p2], { ...defaultFilters, sortBy: 'price_desc' })
    expect(result[0]?.variants[0]?.price).toBe(30)
  })

  it('sorts by name', () => {
    const p1 = makeProduct({ name: 'Zebra' })
    const p2 = makeProduct({ name: 'Apple' })
    const result = filterAndSortProducts([p1, p2], { ...defaultFilters, sortBy: 'name' })
    expect(result[0]?.name).toBe('Apple')
  })

  it('result is always a subset of input', () => {
    const products = [makeProduct(), makeProduct(), makeProduct()]
    const result = filterAndSortProducts(products, { ...defaultFilters, minPrice: 999 })
    result.forEach((p) => expect(products.some((op) => op.id === p.id)).toBe(true))
  })
})
