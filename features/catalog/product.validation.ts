import type { Product } from '@/features/catalog/products.types'
import { isCategory } from '@/features/catalog/products.logic'

export function isProductId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9-]+$/.test(value)
}

export function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    isProductId(value.id) &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    'category' in value &&
    isCategory(value.category) &&
    value.category !== 'All' &&
    'price' in value &&
    typeof value.price === 'number' &&
    Number.isSafeInteger(value.price) &&
    value.price >= 0 &&
    'image' in value &&
    isProductId(value.image) &&
    'description' in value &&
    typeof value.description === 'string' &&
    value.description.trim().length > 0 &&
    'size' in value &&
    typeof value.size === 'string' &&
    value.size.trim().length > 0
  )
}

export function isProductsResponse(value: unknown): value is { items: Product[] } {
  if (
    typeof value !== 'object' || value === null || !('items' in value) ||
    !Array.isArray(value.items) || !value.items.every(isProduct)
  ) return false
  return new Set(value.items.map((product) => product.id)).size === value.items.length
}
