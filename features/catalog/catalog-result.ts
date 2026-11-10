import type { Product } from "@/features/catalog/products.types";
export type CatalogResult = { phase: "ready" | "empty" | "error"; products: readonly Product[] };
export async function catalogResult(reader: () => Promise<readonly Product[]>): Promise<CatalogResult> {
  try { const products = await reader(); return { phase: products.length ? "ready" : "empty", products }; }
  catch { return { phase: "error", products: [] }; }
}
