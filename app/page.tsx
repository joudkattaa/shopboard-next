import type { Metadata } from "next";
import HeroSection from "@/components/hero/HeroSection";
import HeroBenefits from "@/components/hero/HeroBenefits";
import CategorySection from "@/components/editorial/CategorySection";
import AboutSection from "@/components/editorial/AboutSection";
import BeautyPromise from "@/components/editorial/BeautyPromise";
import ProductDiscovery from "@/features/catalog/ProductDiscovery";
import { readCatalog } from "@/features/catalog/products.server";
export const metadata: Metadata = { title: "Home" };
export default async function HomePage() {
 const catalog = await readCatalog();
 return <><HeroSection/><HeroBenefits/><CategorySection/><AboutSection/><div className="mx-auto w-[calc(100%-var(--inset-start)-var(--inset-end))] max-w-[1250px]"><ProductDiscovery products={catalog.products}/></div><BeautyPromise/></>;
}
