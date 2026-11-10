import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/features/catalog/catalog";
import { productById } from "@/features/catalog/products.logic";
import ProductDetails from "@/features/catalog/ProductDetails";

type Props = { params: Promise<{ id: string }> };

// This phase serves the fixed source catalog; other IDs use the shared 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = productById(id, products);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = productById(id, products);
  if (!product) notFound();
  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/products">Shop</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <ProductDetails product={product} />
      <Link href="/products" className="inline-flex min-h-11 items-center underline underline-offset-4">Back to Shop</Link>
    </div>
  );
}
