import type { Metadata } from "next";
import { readProducts } from "@/features/catalog/products.server";
import ProductGrid from "@/features/catalog/ProductGrid";

export const metadata: Metadata = { title: "Shop ROSEVEIL" };

export default async function ProductsPage() {
  const products = await readProducts();
  return (
    <div data-product-listing className="mx-auto w-[calc(100%-var(--inset-start)-var(--inset-end))] max-w-[1250px] pb-12 pt-8">
      <h1 className="mb-6 text-[clamp(32px,4vw,46px)] font-medium leading-[1.2]">Shop ROSEVEIL</h1>
      <section id="products" aria-labelledby="products-title" className="py-10 min-[900px]:py-14">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3.5">
          <div>
            <p className="text-[10px] font-semibold tracking-[1.5px] text-[var(--rose-dark)] dark:text-primary">EXPLORE THE COLLECTION</p>
            <h2 id="products-title" tabIndex={-1} className="text-balance text-[clamp(30px,4vw,44px)] font-medium leading-[1.1] tracking-[-0.4px]">The Roseveil Collection</h2>
          </div>
        </div>
        <p role="status" aria-atomic="true" className="mb-4 text-xs text-muted-foreground">{products.length} {products.length === 1 ? "product" : "products"} shown.</p>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
