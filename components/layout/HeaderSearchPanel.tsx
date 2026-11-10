"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDiscovery } from "@/features/catalog/DiscoveryProvider";
import { discoveryHref } from "@/features/catalog/discovery-url";
import SearchField from "@/features/catalog/SearchField";
export default function HeaderSearchPanel() {
  const { filters, setFilters, searchOpen, setSearchOpen } = useDiscovery();
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (!searchOpen) return;
    input.current?.focus();
    function outside(event: PointerEvent) {
      if (!(event.target instanceof Node) || panel.current?.contains(event.target) || document.getElementById("header-search-toggle")?.contains(event.target)) return;
      const restore = panel.current?.contains(document.activeElement);
      setSearchOpen(false);
      if (restore) document.getElementById("header-search-toggle")?.focus();
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [searchOpen, setSearchOpen]);
  if (!searchOpen) return null;
  return <div ref={panel} id="header-search-panel" className="mx-auto w-[calc(100%-var(--inset-start)-var(--inset-end))] max-w-[1250px] pb-6 pt-[18px]" onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); setSearchOpen(false); document.getElementById("header-search-toggle")?.focus(); } }}>
    <form role="search" aria-label="Search the collection" onSubmit={event => { event.preventDefault(); setSearchOpen(false); router.push(discoveryHref({ ...filters, featured: false })); const heading = document.getElementById("products-title"); heading?.focus({ preventScroll: true }); heading?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }}>
      <SearchField id="product-search" inputRef={input} label="Find your everyday beauty essential" placeholder="Search serum, shampoo, perfume…" value={filters.query} onChange={query => setFilters(current => ({ ...current, query, featured: false }))}><button type="submit" className="min-h-11 rounded-lg bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground">SEARCH</button></SearchField>
    </form>
  </div>;
}
