"use client"

import { useRef } from 'react'
import type { Product } from '@/features/catalog/products.types'
import { formatMoney } from '@/lib/format-money'
import ProductImage from '@/features/catalog/ProductImage'

interface CartRowProps {
  id: string
  product: Readonly<Product> | undefined
  quantity: number
  pricesAvailable: boolean
  onQuantity: (id: string, delta: number) => void
  onRemove: (id: string) => void
  onRowRemoved: () => void
}

export default function CartRow({
  id,
  product,
  quantity,
  pricesAvailable,
  onQuantity,
  onRemove,
  onRowRemoved,
}: CartRowProps) {
  const decrease = useRef<HTMLButtonElement>(null)
  const name = product?.name ?? id
  return (
    <li className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 border-b border-border py-[18px] [&>div]:min-w-0 [&>img]:size-14 [&>img]:rounded-[4px] [&>img]:bg-secondary [&>img]:object-cover min-[480px]:grid-cols-[64px_minmax(0,1fr)_auto] min-[480px]:[&>img]:size-16 [&_h3]:text-sm [&_h3]:font-medium [&_p]:mt-[3px] [&_p]:text-xs [&_p]:text-muted-foreground">
      {product ? (
        <ProductImage product={product} variant="cart" />
      ) : (
        <span>Image unavailable</span>
      )}
      <div>
        <h3>{name}</h3>
        <p>
          {pricesAvailable && product
            ? formatMoney(product.price)
            : 'Price unavailable'}
          {product ? ` · ${product.size}` : ''}
        </p>
        <div className="mt-[9px] inline-flex items-center rounded-sm border border-border [&_button]:size-11 [&_button]:text-[15px] [&_button:disabled]:opacity-50 [&>span]:w-[26px] [&>span]:text-center [&>span]:text-[11px] [&>span]:tabular-nums">
          <button
            ref={decrease}
            type="button"
            aria-label={`Decrease quantity of ${name}`}
            onClick={() => {
              onQuantity(id, -1)
              if (quantity === 1) onRowRemoved()
            }}
          >
            −
          </button>
          <span aria-label={`Quantity of ${name}`}>{quantity}</span>
          <button
            type="button"
            disabled={quantity >= 99}
            aria-label={`Increase quantity of ${name}`}
            onClick={() => {
              onQuantity(id, 1)
              if (quantity === 98) decrease.current?.focus()
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="col-start-2 flex items-center justify-between gap-2.5 min-[480px]:col-auto min-[480px]:block">
        {pricesAvailable && product ? (
          <p className="text-right text-[13px] tabular-nums">
            {formatMoney(product.price * quantity)}
          </p>
        ) : null}
        <button
          className="ms-auto block min-h-11 px-2 text-xs text-berry-wine dark:text-foreground"
          type="button"
          aria-label={`Remove ${name}`}
          onClick={() => {
            onRemove(id)
            onRowRemoved()
          }}
        >
          Remove
        </button>
      </div>
    </li>
  )
}
