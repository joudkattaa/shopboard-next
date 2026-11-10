import Image from "next/image";
import type { Product } from "@/features/catalog/products.types";
import { formatMoney } from "@/lib/format-money";

export default function ProductDetails({ product }: { product: Readonly<Product> }) {
  return (
    <article className="grid gap-8 md:grid-cols-2">
      <Image src={`/roseveil/${product.image}.webp`} alt={product.name} width={1254} height={1254} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full rounded-lg" />
      <div className="space-y-5">
        <p className="text-muted-foreground">{product.category}</p>
        <h1 className="text-4xl">{product.name}</h1>
        <p className="text-xl">{formatMoney(product.price)} USD</p>
        <p>{product.description}</p>
        <dl className="space-y-3">
          <div><dt className="font-medium">Size</dt><dd>{product.size}</dd></div>
          <div><dt className="font-medium">Collection</dt><dd>{product.category}</dd></div>
        </dl>
        <p className="text-sm text-muted-foreground">Illustrative product. Images and sizes are for this concept store. No real purchase or product claims. No payment, real order or shipping request occurs.</p>
      </div>
    </article>
  );
}
