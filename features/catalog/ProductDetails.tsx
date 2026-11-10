import Link from "next/link";
import AddToBagButton from "@/features/cart/AddToBagButton";
import type { Product } from "@/features/catalog/products.types";
import ProductImage from "@/features/catalog/ProductImage";
import { formatMoney } from "@/lib/format-money";

export default function ProductDetails({ product }: { product: Readonly<Product> }) {
  return (
    <article className="grid min-w-0 gap-7 min-[760px]:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] min-[760px]:items-start min-[760px]:gap-[clamp(28px,5vw,72px)]">
      <figure className="m-0 flex aspect-square min-w-0 flex-col overflow-hidden rounded-editorial border border-border bg-linear-[145deg,var(--pink),var(--product-detail-gradient-end)] p-[clamp(14px,2.5vw,30px)] dark:bg-linear-[145deg,var(--card),var(--background)]">
        <ProductImage product={product} variant="detail" className="h-full min-h-0 w-full flex-1 rounded-editorial-compact object-contain" />
        <figcaption className="mt-3.5 shrink-0 text-center font-heading text-[17px] font-medium leading-[1.2] tracking-[3px] text-[var(--rose-dark)]">ROSEVEIL <span className="ms-[7px] font-sans text-[8px] font-normal leading-[1.5] tracking-[2px]">COSMETICS</span></figcaption>
      </figure>
      <div className="min-w-0">
        <p className="mb-3.5 text-[10px] uppercase tracking-[1.5px] text-[var(--rose-dark)] dark:text-primary">{product.category}</p>
        <h1 className="mb-5 text-4xl">{product.name}</h1>
        <p className="font-heading text-4xl font-medium leading-[1.2] tabular-nums">{formatMoney(product.price)} <span className="ms-[5px] font-sans text-[10px] font-normal leading-[1.5] tracking-[1px] text-muted-foreground">USD</span></p>
        <p className="my-5 text-sm leading-[1.9] text-muted-foreground">{product.description}</p>
        <dl className="my-6 grid grid-cols-2 gap-3 border-y border-border py-4">
          <div><dt className="mb-[5px] text-[10px] uppercase tracking-[1px] text-muted-foreground">Size</dt><dd className="text-[13px]">{product.size}</dd></div>
          <div><dt className="mb-[5px] text-[10px] uppercase tracking-[1px] text-muted-foreground">Collection</dt><dd className="text-[13px]">{product.category}</dd></div>
        </dl>
        <AddToBagButton id={product.id} name={product.name} detail />
        <Link href="/bag" className="inline-flex min-h-11 items-center text-xs underline underline-offset-4">View shopping bag ?</Link>
        <p className="text-sm text-muted-foreground">Illustrative product. Images and sizes are for this concept store. No real purchase or product claims. No payment, real order or shipping request occurs.</p>
      </div>
    </article>
  );
}
