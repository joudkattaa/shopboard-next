import { ApiError, fetchJson } from '@/lib/api/client'
import { abortableFetch } from '@/lib/api/abortableFetch'
import type { Product } from '@/features/catalog/products.types'
import { isProduct, isProductId, isProductsResponse } from '@/features/catalog/product.validation'

export async function getProducts(
  fetcher: typeof fetch = globalThis.fetch,
  query = '',
): Promise<Product[]> {
  const response = await fetchJson('/products' + query, isProductsResponse, undefined, fetcher)
  return response.items.map((product) => ({ ...product }))
}

interface ProductRequestOptions {
  signal?: AbortSignal
  fetcher?: typeof fetch
}

export async function getProductById(
  id: unknown,
  options: ProductRequestOptions = {},
): Promise<Product> {
  if (!isProductId(id)) throw new ApiError('Invalid product ID.', 400)
  const signal = options.signal ?? new AbortController().signal
  signal.throwIfAborted()
  try {
    const product = await fetchJson(
      '/products/' + encodeURIComponent(id),
      isProduct,
      { signal },
      abortableFetch(options.fetcher ?? globalThis.fetch, signal),
    )
    signal.throwIfAborted()
    if (product.id !== id)
      throw new ApiError('The API returned a different product.', 200)
    return { ...product }
  } catch (error) {
    // The protected client wraps aborts; restore a distinguishable cancellation.
    if (signal.aborted)
      throw (
        signal.reason ?? new DOMException('Request cancelled.', 'AbortError')
      )
    throw error
  }
}
