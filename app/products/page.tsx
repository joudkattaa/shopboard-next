import type { Metadata } from "next";
import { readProducts } from "@/features/catalog/products.server";
import ProductGrid from "@/features/catalog/ProductGrid";

export const metadata: Metadata = { title: "Shop ROSEVEIL" };

export default async function ProductsPage() {
  const products = await readProducts();
  return (
    <section aria-labelledby="collection-title" className="space-y-8">
      <h1 id="collection-title" className="text-4xl">Shop ROSEVEIL</h1>
      <ProductGrid products={products} />
    </section>
  );
}
