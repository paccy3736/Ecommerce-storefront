import type { CartItem as CartItemType } from '../../types'
import { formatPrice } from '../../utils/formatters'
import { useCartStore } from '../../store/cart.store'
import toast from 'react-hot-toast'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCartStore()

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1 || newQty > item.variant.stock) return
    try {
      await updateItem(item.id, newQty)
    } catch {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemove = async () => {
    try {
      await removeItem(item.id)
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const variantLabel = [item.variant.size, item.variant.color].filter(Boolean).join(' / ')
  const firstImage = item.product.images[0] ?? ''

  return (
    <article className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={item.product.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">📦</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</h3>
        {variantLabel && (
          <p className="text-xs text-gray-500 mt-0.5">{variantLabel}</p>
        )}
        <p className="text-sm font-medium text-indigo-600 mt-1">
          {formatPrice(item.variant.price)} each
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm"
          >
            −
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.variant.stock}
            aria-label="Increase quantity"
            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal + Remove */}
      <div className="flex flex-col items-end justify-between">
        <span className="text-sm font-bold text-gray-900">{formatPrice(item.subtotal)}</span>
        <button
          onClick={handleRemove}
          aria-label={`Remove ${item.product.name}`}
          className="text-xs text-red-400 hover:text-red-600 transition-colors mt-2"
        >
          Remove
        </button>
      </div>
    </article>
  )
}
