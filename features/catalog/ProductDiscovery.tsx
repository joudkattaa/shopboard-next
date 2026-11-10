"use client";

import { useRef } from "react";
import type { Product } from "@/features/catalog/products.types";
import { findProducts } from "@/features/catalog/products.logic";
import { useDiscovery } from "@/features/catalog/DiscoveryProvider";
import CatalogControls from "@/features/catalog/CatalogControls";
import ProductGrid from "@/features/catalog/ProductGrid";

export default function ProductDiscovery({ products }: { products: readonly Product[] }) {
  const { filters, setFilters, selectCategory, reset } = useDiscovery();
  const heading = useRef<HTMLHeadingElement>(null);
  const matches = findProducts(filters.category, filters.query, filters.featured, filters.sort, products);
  const filtered = filters.category !== "All" || Boolean(filters.query) || filters.sort !== "default";
  function clear() { reset(); heading.current?.focus({ preventScroll: true }); }
  return <section id="products" aria-labelledby="products-title" className="py-10 min-[900px]:py-14">
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3.5">
      <div><p className="text-[10px] font-semibold tracking-[1.5px] text-[var(--rose-dark)] dark:text-primary">{filters.featured ? "CURATED FAVORITES" : "EXPLORE THE COLLECTION"}</p><h2 ref={heading} id="products-title" tabIndex={-1} className="text-balance text-[clamp(30px,4vw,44px)] font-medium leading-[1.1] tracking-[-0.4px]">{filters.category !== "All" ? filters.category : filters.query ? "Find Your Next Favorite" : "The Roseveil Collection"}</h2></div>
      <button type="button" onClick={() => setFilters({ category: "All", query: "", sort: "default", featured: !filters.featured && !filtered })} className="min-h-11 text-[11px] font-semibold tracking-wider text-[var(--rose-dark)]">{filters.featured || filtered ? "VIEW ALL PRODUCTS" : "VIEW FEATURED PRODUCTS"} <span aria-hidden="true">→</span></button>
    </div>
    <div className="mb-4 flex w-full flex-wrap gap-3">
      <nav aria-label="Beauty collections" className="flex basis-full flex-wrap gap-2">
        {(["All", "Body Care", "Skin Care", "Hair Care", "Gift Sets"] as const).map(category => <button key={category} type="button" aria-current={!filters.featured && filters.category === category ? "true" : undefined} onClick={() => selectCategory(category)} className="inline-flex min-h-11 items-center justify-center rounded-roseveil-24 border border-border px-3.5 py-2.5 text-[11px] text-[var(--rose-dark)] hover:bg-secondary aria-[current=true]:border-[var(--rose-dark)] aria-[current=true]:bg-[var(--rose-dark)] aria-[current=true]:text-white dark:text-primary dark:aria-[current=true]:border-primary dark:aria-[current=true]:bg-primary dark:aria-[current=true]:text-primary-foreground">{category === "All" ? "All Beauty" : category}</button>)}
      </nav><CatalogControls filters={filters} onChange={setFilters} />
    </div>
    {filtered && <div className="flex flex-wrap items-center justify-between gap-3 pb-3 text-xs text-muted-foreground"><p>{[filters.category !== "All" ? filters.category : "", filters.query ? "Search: " + filters.query : ""].filter(Boolean).join(" · ")}</p><button type="button" onClick={clear} className="min-h-11 text-[var(--rose-dark)]">Clear Filters ×</button></div>}
    <p role="status" aria-atomic="true" className="mb-4 text-xs text-muted-foreground">{matches.length} {matches.length === 1 ? "product" : "products"} shown{filters.category !== "All" ? " in " + filters.category : ""}.</p>
    {!matches.length && <div className="my-6 rounded-lg border border-border bg-secondary p-6 text-center"><h3 className="text-2xl">A little change of search?</h3><p className="my-4 text-sm text-muted-foreground">We couldn’t find a match. Try “serum”, “rose”, or explore the full collection.</p><button type="button" onClick={clear} className="min-h-11 rounded-lg bg-primary px-5 text-primary-foreground">EXPLORE ALL PRODUCTS</button></div>}
    <ProductGrid products={matches} />
  </section>;
}
