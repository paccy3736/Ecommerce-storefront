import type { Product, ProductFilters } from '../types'

/**
 * Filters and sorts a product list based on active filters.
 * Preconditions: products is a non-null array; filters is a valid ProductFilters object
 * Postconditions: result.length <= products.length; input not mutated
 */
export function filterAndSortProducts(products: Product[], filters: ProductFilters): Product[] {
  const getMinPrice = (product: Product): number => {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map((v) => v.price))
    }
    return product.price ?? 0
  }

  // Filter pass
  const filtered = products.filter((product) => {
    const price = getMinPrice(product)

    if (filters.categoryId && product.categoryId !== filters.categoryId) return false
    if (filters.minPrice !== null && price < filters.minPrice) return false
    if (filters.maxPrice !== null && price > filters.maxPrice) return false
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      const nameMatch = product.name.toLowerCase().includes(q)
      const descMatch = product.description.toLowerCase().includes(q)
      if (!nameMatch && !descMatch) return false
    }
    return true
  })

  // Sort pass — does not mutate filtered
  return [...filtered].sort((a, b) => {
    const priceA = getMinPrice(a)
    const priceB = getMinPrice(b)

    switch (filters.sortBy) {
      case 'price_asc':
        return priceA - priceB
      case 'price_desc':
        return priceB - priceA
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
}
