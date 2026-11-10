import type { Category, Product } from "@/features/catalog/products.types";

export const productCategories: readonly Category[] = [
  "Body Care", "Hair Care", "Skin Care", "Fragrance", "Makeup", "Face Masks", "Gift Sets",
];

export function isCategory(value: unknown): value is Category | "All" {
  return value === "All" || productCategories.some((category) => category === value);
}

export const productById = (
  id: string | undefined,
  catalog: readonly Product[] = [],
): Product | undefined => catalog.find((product) => product.id === id);
