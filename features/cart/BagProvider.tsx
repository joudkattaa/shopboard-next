"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Product } from "@/features/catalog/products.types";
import { createBagStore } from "@/features/cart/bag.store";
import { cartTotals } from "@/features/cart/cart.logic";

const BagContext = createContext<null | { store: ReturnType<typeof createBagStore>; products: readonly Product[] }>(null);
export function BagProvider({ products, children }: { products: readonly Product[]; children: ReactNode }) {
  const [store] = useState(() => createBagStore(products));
  useEffect(() => {
    let storage: Storage | undefined;
    try { storage = window.localStorage; } catch { /* Memory-only bag. */ }
    store.hydrate(storage);
  }, [store]);
  return <BagContext value={{ store, products }}>{children}<BagFeedback /></BagContext>;
}
export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag requires BagProvider");
  const snapshot = useSyncExternalStore(context.store.subscribe, context.store.getSnapshot, context.store.getServerSnapshot);
  return { ...snapshot, store: context.store, products: context.products, totals: cartTotals(snapshot.items, snapshot.promoCode, context.products) };
}
function BagFeedback() {
  const { message, store } = useBag();
  useEffect(() => { if (!message) return; const timer = setTimeout(() => store.clearMessage(), 3500); return () => clearTimeout(timer); }, [message, store]);
  return <p role="status" aria-atomic="true" className={message ? "fixed bottom-4 left-1/2 z-50 w-max max-w-[calc(100%-32px)] -translate-x-1/2 rounded-md bg-foreground px-5 py-3 text-center text-sm text-background shadow-lg" : "sr-only"}>{message}</p>;
}
