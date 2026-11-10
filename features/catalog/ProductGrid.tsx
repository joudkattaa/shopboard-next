import type { Product } from "@/features/catalog/products.types";
import ProductCard from "@/features/catalog/ProductCard";

export default function ProductGrid({ products }: { products: readonly Product[] }) {
  return <>
    <p id="product-purchase-unavailable" className="sr-only">Shopping bag functionality is deferred. Browse product details using the image or product name.</p>
    <div id="product-grid" className="grid grid-cols-2 gap-x-3 gap-y-5 min-[600px]:grid-cols-3 min-[600px]:gap-x-[18px] min-[600px]:gap-y-6 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  </>;
}
