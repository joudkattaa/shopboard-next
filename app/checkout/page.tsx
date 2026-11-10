import type { Metadata } from "next";
import Checkout from "@/features/checkout/Checkout";
export const metadata: Metadata = { title: "Demo Checkout" };
export default function CheckoutPage() { return <section className="mx-auto max-w-[850px] pb-12 pt-8"><h1 className="mb-6 text-[clamp(32px,4vw,46px)] font-medium leading-[1.2]">Demo Checkout</h1><Checkout /></section>; }
