import type { Metadata } from "next";
import ShoppingBag from "@/features/cart/ShoppingBag";
export const metadata: Metadata = { title: "Your Shopping Bag" };
export default function BagPage() {
  return <section className="mx-auto w-full pb-12 pt-8"><h1 className="mb-6 text-[clamp(32px,4vw,46px)] font-medium leading-[1.2]">Your Shopping Bag</h1><ShoppingBag /></section>;
}
