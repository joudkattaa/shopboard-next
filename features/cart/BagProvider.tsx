"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Product } from "@/features/catalog/products.types";
import type { CatalogResult } from "@/features/catalog/catalog-result";
import { productById } from "@/features/catalog/products.logic";
import { createBagStore } from "@/features/cart/bag.store";
import { cartTotals } from "@/features/cart/cart.logic";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import ShoppingBag from "@/features/cart/ShoppingBag";

type Phase = CatalogResult["phase"] | "loading";
type Context = { store: ReturnType<typeof createBagStore>; products: readonly Product[]; catalogPhase: Phase; retryCatalog: () => Promise<void>; modalAvailable: boolean };
const BagContext = createContext<Context | null>(null);
export function BagProvider({ products, initialPhase = products.length ? "ready" : "empty", children }: { products: readonly Product[]; initialPhase?: CatalogResult["phase"]; children: ReactNode }) {
  const [store] = useState(() => createBagStore(products));
  const [catalog, setCatalog] = useState<{products: readonly Product[]; phase: Phase}>({ products, phase: initialPhase });
  const pathname = usePathname();
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  useEffect(() => { let storage: Storage | undefined; try { storage = window.localStorage; } catch { /* Memory-only bag. */ } store.hydrate(storage); }, [store]);
  useEffect(() => { store.closeModal(); }, [pathname, store]);
  async function retryCatalog() {
    if (catalog.phase === "loading") return;
    setCatalog(current => ({ ...current, phase: "loading" }));
    try { const { refreshCatalog } = await import("@/features/catalog/catalog.actions"); const result = await refreshCatalog(); store.updateCatalog(result.products); setCatalog(result); }
    catch { setCatalog(current => ({ ...current, phase: "error" })); }
  }
  return <BagContext value={{ store, products: catalog.products, catalogPhase: catalog.phase, retryCatalog, modalAvailable: pathname !== "/bag" && pathname !== "/checkout" }}><Dialog open={snapshot.modalOpen} onOpenChange={open => { if (open) store.openModal(); else store.closeModal(); }}>{children}<BagModal /><BagFeedback /></Dialog></BagContext>;
}
export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag requires BagProvider");
  const snapshot = useSyncExternalStore(context.store.subscribe, context.store.getSnapshot, context.store.getServerSnapshot);
  const pricesAvailable = context.catalogPhase === "ready" && context.products.length > 0 && snapshot.items.every(item => productById(item.id, context.products));
  const totals = cartTotals(snapshot.items, snapshot.promoCode, context.products);
  return { ...context, ...snapshot, pricesAvailable, totals: { ...totals, count: snapshot.items.reduce((sum,item)=>sum+item.quantity,0) } };
}
function BagModal() {
  const { modalOpen, message, revision } = useBag();
  if (!modalOpen) return null;
  return <DialogContent id="shopping-bag-dialog" finalFocus={() => document.getElementById("cart-button")}><DialogHeader><DialogTitle>Your Shopping Bag</DialogTitle><DialogDescription>Review your items, quantities and demo totals.</DialogDescription></DialogHeader><ShoppingBag /><p role="status" aria-atomic="true">{message && <span key={revision}>{message}</span>}</p></DialogContent>;
}
function BagFeedback() {
  const { message, revision, modalOpen, store } = useBag();
  useEffect(() => { if (!message) return; const timer = setTimeout(() => store.clearMessage(), 3800); return () => clearTimeout(timer); }, [message, revision, store]);
  return <p role="status" aria-atomic="true" className={message && !modalOpen ? "fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-1/2 z-50 w-max max-w-[calc(100%-32px)] -translate-x-1/2 rounded-md bg-deep-raisin px-5 py-3 text-center text-[13px] text-white shadow-[0_8px_30px_#36242d26] dark:bg-primary dark:text-background" : "sr-only"}>{!modalOpen && message && <span key={revision}>{message}</span>}</p>;
}
