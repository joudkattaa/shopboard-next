import "server-only";
import { cache } from "react";
import { products } from "@/features/catalog/catalog";
import { productById } from "@/features/catalog/products.logic";
import { isProductId, isProductsResponse } from "@/features/catalog/product.validation";

// Read the local source directly on the server; no self-HTTP request or second catalog.
export const readProducts = cache(async () => {
  if (!isProductsResponse({ items: products })) {
    throw new Error("The catalog has an invalid format.");
  }
  return products;
});

export const readProduct = cache(async (id: string) => {
  if (!isProductId(id)) return undefined;
  return productById(id, await readProducts());
});
