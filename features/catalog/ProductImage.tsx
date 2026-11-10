"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/features/catalog/products.types";

type Props = { product: Readonly<Product>; variant?: "card" | "detail" | "cart"; className?: string };
export default function ProductImage({ product, variant = "card", className = "" }: Props) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  if (failedImage === product.image) {
    return <span role="img" aria-label={product.name + ": image unavailable"} className={"grid aspect-square h-full w-full place-items-center p-3 text-center text-xs dark:bg-background dark:text-foreground " + className}>Image unavailable</span>;
  }
  return <Image src={"/roseveil/" + product.image + ".webp"} alt={product.name} width={1254} height={1254}
    sizes={variant === "cart" ? "70px" : variant === "card"
      ? "(min-width: 1330px) 214px, (min-width: 1200px) calc((100vw - 262px) / 5), (min-width: 900px) calc((100vw - 222px) / 4), (min-width: 600px) calc((100vw - 150px) / 3), (min-width: 480px) calc((100vw - 104px) / 2), calc((100vw - 88px) / 2)"
      : "(min-width: 1200px) 540px, (min-width: 760px) 48vw, calc(100vw - 48px)"}
    loading={variant === "card" ? "lazy" : "eager"} decoding="async" onError={() => setFailedImage(product.image)} className={className} />;
}
