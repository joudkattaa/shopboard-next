import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readProducts, readProduct } from "@/features/catalog/products.server";
import ProductDetails from "@/features/catalog/ProductDetails";

type Props = { params: Promise<{ id: string }> };

// This phase serves the fixed source catalog; other IDs use the shared 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await readProducts();
  return products.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await readProduct(id);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = await readProduct(id);
  if (!product) notFound();
  return (
    <div className="pb-16 pt-6">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap gap-2 text-[11px] text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/products">Shop</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <h1 className="mb-7 text-[clamp(34px,4.5vw,56px)] leading-[1.05] tracking-[-0.8px]">{product.name}</h1>
      <ProductDetails product={product} />
      <Link href="/products" className="mt-5 inline-flex min-h-11 items-center underline underline-offset-4">Back to Shop</Link>
    </div>
  );
}
