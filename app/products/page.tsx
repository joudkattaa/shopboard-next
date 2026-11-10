import type { Metadata } from "next";
import { readCatalog } from "@/features/catalog/products.server";
import ProductDiscovery from "@/features/catalog/ProductDiscovery";

export const metadata: Metadata = { title: "Shop ROSEVEIL" };

export default async function ProductsPage() {
  const catalog = await readCatalog();
  return (
    <div data-product-listing className="mx-auto w-[calc(100%-var(--inset-start)-var(--inset-end))] max-w-[1250px] pb-12 pt-8">
      <h1 className="mb-6 text-[clamp(32px,4vw,46px)] font-medium leading-[1.2]">Shop ROSEVEIL</h1>
      <ProductDiscovery products={catalog.products} />
    </div>
  );
}
