import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/features/catalog/products.types";
import { formatMoney } from "@/lib/format-money";

export default function ProductGrid({ products }: { products: readonly Product[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id} className="rounded-lg border border-border bg-card p-4 text-card-foreground">
          <Link href={`/products/${product.id}`} className="block space-y-3">
            <Image src={`/roseveil/${product.image}.webp`} alt={product.name} width={1254} height={1254} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full rounded-lg" />
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h2 className="text-2xl">{product.name}</h2>
            <p>{formatMoney(product.price)} <span className="text-sm text-muted-foreground">· {product.size}</span></p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
