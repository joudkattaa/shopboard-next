"use server";
import { readCatalog } from "@/features/catalog/products.server";
export async function refreshCatalog() { return readCatalog(); }
