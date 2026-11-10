import type { Product } from "@/features/catalog/products.types";

export const productById = (
  id: string | undefined,
  catalog: readonly Product[] = [],
): Product | undefined => catalog.find((product) => product.id === id);
