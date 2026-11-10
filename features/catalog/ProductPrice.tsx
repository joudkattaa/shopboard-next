"use client";

import { useBag } from "@/features/cart/BagProvider";
import { productById } from "@/features/catalog/products.logic";
import { formatMoney } from "@/lib/format-money";

export default function ProductPrice({ id }: { id: string }) {
  const { products, catalogPhase, retryCatalog } = useBag();
  const product = productById(id, products);
  if (catalogPhase !== "ready" || !product) return <div role="status" className="text-sm text-muted-foreground"><p>Price unavailable. Please reload the collection before adding this product.</p><button type="button" onClick={() => void retryCatalog()} disabled={catalogPhase === "loading"} className="min-h-11 underline disabled:opacity-50">{catalogPhase === "loading" ? "Loading prices…" : "Reload prices"}</button></div>;
  return <p className="font-heading text-4xl font-medium leading-[1.2] tabular-nums">{formatMoney(product.price)} <span className="ms-[5px] font-sans text-[10px] font-normal leading-[1.5] tracking-[1px] text-muted-foreground">USD</span></p>;
}
