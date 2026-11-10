import type { CatalogFilters } from "@/features/catalog/DiscoveryProvider";
import type { Category } from "@/features/catalog/products.types";
import { isCategory, isSortOrder } from "@/features/catalog/products.logic";

export function readDiscoveryParams(params: Pick<URLSearchParams, "get">): CatalogFilters {
  const category = params.get("category"), sort = params.get("sort");
  return { category: isCategory(category) ? category : "All", query: params.get("q") ?? "", sort: isSortOrder(sort) ? sort : "default", featured: params.get("featured") === "true" };
}
export function discoveryHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.category !== "All") params.set("category", filters.category);
  if (filters.query) params.set("q", filters.query);
  if (filters.sort !== "default") params.set("sort", filters.sort);
  if (filters.featured) params.set("featured", "true");
  return "/products" + (params.size ? "?" + params.toString() : "");
}
export function categoryHref(category: Category | "All") {
  return discoveryHref({ category, query: "", sort: "default", featured: false });
}
