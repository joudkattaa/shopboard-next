"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Category, SortOrder } from "@/features/catalog/products.types";
export type CatalogFilters = { query: string; category: Category | "All"; sort: SortOrder; featured: boolean };
export const defaultFilters: CatalogFilters = { query: "", category: "All", sort: "default", featured: false };
function useDiscoveryState() {
  const [filters, setFilters] = useState(defaultFilters);
  const [searchOpen, setSearchOpen] = useState(false);
  function selectCategory(category: Category | "All") { setFilters(current => ({ ...current, category, featured: false })); }
  function reset() { setFilters(defaultFilters); }
  return { filters, setFilters, selectCategory, reset, searchOpen, setSearchOpen };
}
const DiscoveryContext = createContext<ReturnType<typeof useDiscoveryState> | null>(null);
export function DiscoveryProvider({ children }: { children: ReactNode }) { const value = useDiscoveryState(); return <DiscoveryContext value={value}>{children}</DiscoveryContext>; }
export function useDiscovery() { const value = useContext(DiscoveryContext); if (!value) throw new Error("useDiscovery requires DiscoveryProvider"); return value; }
