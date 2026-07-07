import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { filterAndSortProducts } from '../../utils/filterProducts'
import type { Product, ProductFilters } from '../../types'

// Arbitrary for a Product
const productArb: fc.Arbitrary<Product> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string({ minLength: 0, maxLength: 200 }),
  images: fc.array(fc.webUrl(), { maxLength: 3 }),
  categoryId: fc.string({ minLength: 1, maxLength: 10 }),
  variants: fc.array(
    fc.record({
      id: fc.uuid(),
      price: fc.float({ min: 0, max: 10000, noNaN: true }),
      stock: fc.integer({ min: 0, max: 100 }),
      size: fc.option(fc.string({ minLength: 1, maxLength: 5 }), { nil: undefined }),
      color: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined }),
    }),
    { minLength: 1, maxLength: 5 }
  ),
  createdAt: fc.integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-01-01').getTime() }).map((ts) => new Date(ts).toISOString()),
  updatedAt: fc.integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-01-01').getTime() }).map((ts) => new Date(ts).toISOString()),
  category: fc.constant(undefined),
})

const filtersArb: fc.Arbitrary<ProductFilters> = fc.record({
  categoryId: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: null }),
  minPrice: fc.option(fc.float({ min: 0, max: 5000, noNaN: true }), { nil: null }),
  maxPrice: fc.option(fc.float({ min: 0, max: 5000, noNaN: true }), { nil: null }),
  sortBy: fc.constantFrom('name', 'price_asc', 'price_desc', 'newest' as const),
  searchQuery: fc.string({ maxLength: 20 }),
})

describe('filterAndSortProducts — property-based tests', () => {
  it('result is always a subset of input', () => {
    fc.assert(
      fc.property(fc.array(productArb, { maxLength: 20 }), filtersArb, (products, filters) => {
        const result = filterAndSortProducts(products, filters)
        return result.every((p) => products.some((op) => op.id === p.id))
      })
    )
  })

  it('result length is always <= input length', () => {
    fc.assert(
      fc.property(fc.array(productArb, { maxLength: 20 }), filtersArb, (products, filters) => {
        const result = filterAndSortProducts(products, filters)
        return result.length <= products.length
      })
    )
  })

  it('sort by price_asc produces non-decreasing price order', () => {
    fc.assert(
      fc.property(fc.array(productArb, { minLength: 2, maxLength: 20 }), (products) => {
        const filters: ProductFilters = {
          categoryId: null,
          minPrice: null,
          maxPrice: null,
          sortBy: 'price_asc',
          searchQuery: '',
        }
        const result = filterAndSortProducts(products, filters)
        for (let i = 0; i < result.length - 1; i++) {
          const a = result[i]
          const b = result[i + 1]
          if (!a || !b) continue
          const priceA = Math.min(...a.variants.map((v) => v.price))
          const priceB = Math.min(...b.variants.map((v) => v.price))
          if (priceA > priceB) return false
        }
        return true
      })
    )
  })

  it('input array is never mutated', () => {
    fc.assert(
      fc.property(fc.array(productArb, { maxLength: 10 }), filtersArb, (products, filters) => {
        const ids = products.map((p) => p.id)
        filterAndSortProducts(products, filters)
        return products.every((p, i) => p.id === ids[i])
      })
    )
  })
})
