"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDiscovery } from "@/features/catalog/DiscoveryProvider";
import { categoryHref } from "@/features/catalog/discovery-url";
import type { Category } from "@/features/catalog/products.types";
import BrandIcon from "@/components/layout/BrandIcon";

const items = ["HOME", "SHOP", "SKIN CARE", "MAKEUP", "HAIR CARE", "BODY CARE", "ABOUT US", "BLOG", "CONTACT US"];
export default function HeaderNavigation({ logo, actions }: { logo: ReactNode; actions: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { filters, reset, resetHome = reset, resetShop = reset } = useDiscovery();
  const categories: Partial<Record<number, Category>> = { 2: "Skin Care", 3: "Makeup", 4: "Hair Care", 5: "Body Care" };
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1200px)");
    function change(event: MediaQueryListEvent) {
      if (event.matches && document.activeElement === toggle.current) root.current?.querySelector<HTMLAnchorElement>('a[href="/"]')?.focus();
      if (!event.matches && nav.current?.contains(document.activeElement)) toggle.current?.focus();
      setOpen(false);
    }
    desktop.addEventListener("change", change);
    return () => desktop.removeEventListener("change", change);
  }, []);
  function closeMenu() {
    if (nav.current?.contains(document.activeElement) && !window.matchMedia("(min-width: 1200px)").matches) toggle.current?.focus();
    setOpen(false);
  }
  return (
    <div ref={root} onKeyDown={(event) => { if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); toggle.current?.focus(); } }} className="mx-auto grid min-h-[90px] w-[calc(100%-var(--inset-start)-var(--inset-end))] max-w-[1250px] min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4 min-[480px]:flex min-[480px]:flex-wrap min-[1000px]:min-h-[95px] min-[1000px]:gap-[30px] min-[1200px]:flex-nowrap min-[1200px]:gap-[18px] min-[1300px]:min-h-[102px]">
      {logo}
      <button ref={toggle} type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)} className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-border p-2.5 min-[480px]:order-1 min-[480px]:ml-auto min-[1200px]:hidden"><BrandIcon name="menu" /></button>
      <nav ref={nav} id="main-nav" aria-label="Main navigation" className={(open ? "flex " : "hidden ") + "order-4 col-span-full w-full min-w-0 flex-col min-[480px]:basis-full min-[1200px]:order-1 min-[1200px]:ml-auto min-[1200px]:flex min-[1200px]:w-auto min-[1200px]:basis-auto min-[1200px]:flex-row min-[1200px]:gap-2.5"}>
        {items.map((label, index) => {
          const className = "flex min-h-11 items-center bg-transparent px-3 py-3 text-left text-xs font-semibold leading-[1.2] tracking-[0.15px] min-[1200px]:whitespace-nowrap min-[1200px]:px-0 min-[1200px]:text-[10px]";
          if (index > 6) return <button key={label} type="button" disabled title="Available in a later migration stage" aria-describedby="header-unavailable" className={className + " cursor-not-allowed disabled:opacity-50"}>{label}</button>;
          const active = index === 0 ? pathname === "/" : index === 6 ? pathname === "/about" : pathname.startsWith("/products") && !filters.featured && (index === 1 ? filters.category === "All" : filters.category === categories[index]);
          return <Link key={label} href={index === 0 ? "/" : index === 6 ? "/about" : categoryHref(categories[index] ?? "All")} onClick={() => { if (index === 0) resetHome(); else if (index === 1) resetShop();  closeMenu(); }} aria-current={active ? "page" : undefined} className={className + " hover:text-[var(--rose-dark)] active:opacity-80 " + (active ? "text-[var(--rose-dark)] dark:text-primary" : "")}>{label}</Link>;
        })}
      </nav>
      {actions}
    </div>
  );
}
