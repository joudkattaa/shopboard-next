import Link from "next/link";
import AddToBagButton from "@/features/cart/AddToBagButton";
import type { Product } from "@/features/catalog/products.types";
import ProductImage from "@/features/catalog/ProductImage";
import { formatMoney } from "@/lib/format-money";

export default function ProductCard({ product }: { product: Readonly<Product> }) {
  return (
    <article aria-label={product.name} className="group/card relative flex min-w-0 w-full flex-col rounded-[27px_15px_15px_15px] border border-[var(--product-card-border)] bg-card p-2.5 text-card-foreground shadow-[var(--product-card-shadow)] even:rounded-[15px_27px_15px_15px] dark:border-border motion-safe:transition-transform motion-safe:duration-[220ms] motion-safe:ease-out motion-safe:focus-within:-translate-y-[3px] pointer-fine:motion-safe:hover:-translate-y-[3px] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-[var(--product-card-hover-shadow)] after:content-[''] motion-safe:after:transition-opacity motion-safe:after:duration-[220ms] motion-safe:after:ease-out motion-safe:focus-within:after:opacity-100 pointer-fine:motion-safe:hover:after:opacity-100">
      <Link href={"/products/" + product.id} aria-label={"View " + product.name} className="relative block aspect-square w-full overflow-hidden rounded-[16px_4px_4px_4px] bg-[var(--product-image-surface)] group-even/card:rounded-[4px_16px_4px_4px] dark:bg-background">
        <ProductImage product={product} className="aspect-square h-full w-full object-contain outline outline-black/10 -outline-offset-1 dark:outline-white/10 motion-safe:transition-transform motion-safe:duration-[280ms] motion-safe:ease-out motion-safe:group-focus-within/card:scale-[1.025] pointer-fine:motion-safe:group-hover/card:scale-[1.025]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-2 end-2 inline-flex items-center gap-[5px] rounded-roseveil-30 border border-border bg-background/95 px-[9px] py-[5px] text-[9px] leading-[1.4] dark:bg-card">View details<svg viewBox="0 0 24 24" className="size-3 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-5-5 5 5-5 5" /></svg></span>
      </Link>
      <div className="flex-1 px-0.5 pb-3 pt-3.5">
        <p className="mb-2 text-[9px] uppercase tracking-[1.2px] text-[var(--rose-dark)] dark:text-primary">{product.category}</p>
        <h3><Link href={"/products/" + product.id} className="block min-h-[2.3em] wrap-anywhere text-left font-heading text-[clamp(18px,1.6vw,23px)] font-semibold leading-[1.15]">{product.name}</Link></h3>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <p className="text-sm font-medium tracking-[0.2px] tabular-nums">{formatMoney(product.price)}</p>
          <span className="text-[10px] text-muted-foreground">{product.size}</span>
        </div>
      </div>
      <AddToBagButton id={product.id} name={product.name} />
    </article>
  );
}
