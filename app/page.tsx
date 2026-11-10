import type { Metadata } from "next";
import HeroSection from "@/components/hero/HeroSection";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return <HeroSection />;
}
