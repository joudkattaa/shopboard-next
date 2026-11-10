"use client";

import { Suspense, createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { discoveryHref, readDiscoveryParams } from "@/features/catalog/discovery-url";
import type { Category, SortOrder } from "@/features/catalog/products.types";
export type CatalogFilters = { query: string; category: Category | "All"; sort: SortOrder; featured: boolean };
export const defaultFilters: CatalogFilters = { query: "", category: "All", sort: "default", featured: false };
export function focusCollection() { const heading = document.getElementById("products-title"); heading?.focus({ preventScroll: true }); heading?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
function useDiscoveryState() {
  const [filters, setFilters] = useState(defaultFilters);
  const [searchOpen, setSearchOpen] = useState(false);
  const [homeFilters, setHomeFilters] = useState<CatalogFilters>({ ...defaultFilters, featured: true });
  function selectCategory(category: Category | "All") { setFilters(current => ({ ...current, category, featured: false })); }
  function reset() { setFilters(defaultFilters); }
  function resetHome() { setHomeFilters({ ...defaultFilters, featured: true }); }
  return { filters, setFilters, selectCategory, reset, searchOpen, setSearchOpen, homeFilters, setHomeFilters, resetHome };
}
const DiscoveryContext = createContext<ReturnType<typeof useDiscoveryState> | null>(null);
export function DiscoveryProvider({ children }: { children: ReactNode }) { const value = useDiscoveryState(); return <DiscoveryContext value={value}>{children}</DiscoveryContext>; }
export function useDiscovery() {
  const value = useContext(DiscoveryContext); const path = usePathname();
  if (!value) throw new Error("useDiscovery requires DiscoveryProvider");
  return { ...value, resetShop: value.reset, ...(path === "/" ? { filters: value.homeFilters, setFilters: value.setHomeFilters, reset: () => value.setHomeFilters(defaultFilters), selectCategory: (category: Category | "All") => { value.setHomeFilters(current => ({ ...current, category, featured: false })); } } : {}) };
}

// The listing URL owns Shop filters; Home retains its separate in-memory scope.
export function ShopDiscoveryProvider({ children }: { children: ReactNode }) {
  const parent = useContext(DiscoveryContext);
  const params = useSearchParams();
  if (!parent) throw new Error("ShopDiscoveryProvider requires DiscoveryProvider");
  const filters = readDiscoveryParams(params);
  const setFilters: Dispatch<SetStateAction<CatalogFilters>> = value => {
    const current = readDiscoveryParams(new URLSearchParams(window.location.search));
    const next = typeof value === "function" ? value(current) : value;
    const href = discoveryHref(next);
    if (href !== window.location.pathname + window.location.search) window.history.pushState(null, "", href);
  };
  return <DiscoveryContext value={{ ...parent, filters, setFilters, selectCategory: category => setFilters(current => ({ ...current, category, featured: false })), reset: () => setFilters(defaultFilters) }}>{children}</DiscoveryContext>;
}

export function DiscoveryNavigation({ children }: { children: ReactNode }) {
  const path = usePathname();
  return path === "/products" ? <Suspense fallback={children}><ShopDiscoveryProvider>{children}</ShopDiscoveryProvider></Suspense> : children;
}
