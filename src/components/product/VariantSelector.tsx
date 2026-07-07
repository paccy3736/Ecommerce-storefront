import type { Variant } from '../../types'
import { formatPrice } from '../../utils/formatters'

interface VariantSelectorProps {
  variants: Variant[]
  selected: Variant | null
  onChange: (variant: Variant) => void
}

export function VariantSelector({ variants, selected, onChange }: VariantSelectorProps) {
  if (variants.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Select Variant</h3>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Product variants">
        {variants.map((variant) => {
          const isSelected = selected?.id === variant.id
          const isOutOfStock = variant.stock === 0

          const label = [variant.size, variant.color].filter(Boolean).join(' / ') || `Variant`

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onChange(variant)}
              disabled={isOutOfStock}
              aria-pressed={isSelected}
              aria-label={`${label} — ${formatPrice(variant.price)}${isOutOfStock ? ' (out of stock)' : ''}`}
              className={`
                relative px-4 py-2 rounded-lg border text-sm font-medium transition-all
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${isSelected
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 text-gray-700 hover:border-indigo-400'
                }
                ${isOutOfStock ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}
              `}
            >
              <span>{label}</span>
              <span className="ml-1 text-xs text-gray-500">({formatPrice(variant.price)})</span>
              {isOutOfStock && (
                <span className="ml-1 text-xs text-red-400">Out of stock</span>
              )}
            </button>
          )
        })}
      </div>

      {selected && (
        <p className="text-sm text-gray-500">
          {selected.stock > 0 ? (
            <span className="text-green-600 font-medium">{selected.stock} in stock</span>
          ) : (
            <span className="text-red-500 font-medium">Out of stock</span>
          )}
        </p>
      )}
    </div>
  )
}
