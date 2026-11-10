import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { themeBootstrap } from "@/features/theme/theme";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { BagProvider } from "@/features/cart/BagProvider";
import { DiscoveryProvider } from "@/features/catalog/DiscoveryProvider";
import { readProducts } from "@/features/catalog/products.server";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "ROSEVEIL Cosmetics", template: "%s — ROSEVEIL Cosmetics" },
  description: "A little rose. A little ritual. Discover beauty essentials that make the everyday feel extraordinary.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const products = await readProducts();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="light"
      className={`h-full antialiased ${dmSans.variable} ${cormorantGaramond.variable}`}
    >
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-card focus:p-4">Skip to content</a>
        <BagProvider products={products}><DiscoveryProvider>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 has-[[data-home-hero]]:max-w-none has-[[data-home-hero]]:p-0 has-[[data-product-listing]]:max-w-none has-[[data-product-listing]]:p-0 has-[[data-about-page]]:max-w-none has-[[data-about-page]]:p-0">{children}</main>
        <SiteFooter />
        </DiscoveryProvider></BagProvider>
      </body>
    </html>
  );
}
