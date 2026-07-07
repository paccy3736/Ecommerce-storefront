import type { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { SkeletonGrid } from '../common/SkeletonLoader'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  showQuickAdd?: boolean
  onQuickAdd?: (product: Product) => void
}

export function ProductGrid({ products, isLoading = false, showQuickAdd, onQuickAdd }: ProductGridProps) {
  if (isLoading) {
    return <SkeletonGrid count={12} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showQuickAdd={showQuickAdd}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  )
}
