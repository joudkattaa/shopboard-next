import type { Product } from "@/features/catalog/products.types";
import type { Cart } from "@/features/cart/cart.types";
import { normalizeCart } from "@/features/cart/cart.logic";
import { productById } from "@/features/catalog/products.logic";

export const BAG_KEY = "roseveil-shopping-bag-v1";
export const LEGACY_BAG_KEY = "lumiere-shopping-bag-v1";
export type BagStorage = Pick<Storage, "getItem" | "setItem">;
type Snapshot = { items: Cart; promoCode: string; ready: boolean; message: string };

export function createBagStore(catalog: readonly Product[]) {
  const initial: Snapshot = { items: [], promoCode: "", ready: false, message: "" };
  let snapshot = initial;
  let storage: BagStorage | undefined;
  const listeners = new Set<() => void>();
  function update(next: Partial<Snapshot>, persist = true) {
    snapshot = { ...snapshot, ...next };
    if (persist && snapshot.ready) {
      try { storage?.setItem(BAG_KEY, JSON.stringify({ items: snapshot.items, promoCode: snapshot.promoCode })); } catch { /* Keep working in memory. */ }
    }
    listeners.forEach(listener => listener());
  }
  return {
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
    hydrate(adapter?: BagStorage) {
      if (snapshot.ready) return;
      storage = adapter;
      let items: Cart = [], promoCode = "";
      try {
        const saved: unknown = JSON.parse(storage?.getItem(BAG_KEY) ?? storage?.getItem(LEGACY_BAG_KEY) ?? "{}");
        if (typeof saved === "object" && saved !== null) {
          items = normalizeCart("items" in saved ? saved.items : undefined, catalog);
          promoCode = "promoCode" in saved && saved.promoCode === "GLOW20" ? "GLOW20" : "";
        }
      } catch { /* Corrupt or inaccessible storage starts with an empty bag. */ }
      update({ items, promoCode, ready: true }, false);
    },
    add(id: string) {
      if (!snapshot.ready) return false;
      const product = productById(id, catalog);
      if (!product) return false;
      const current = snapshot.items.find(item => item.id === id);
      if (current?.quantity === 99) { update({ message: "Maximum quantity is 99." }, false); return false; }
      const items = current ? snapshot.items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...snapshot.items, { id, quantity: 1 }];
      update({ items, message: product.name + " added to your shopping bag." });
      return true;
    },
    changeQuantity(id: string, delta: number) {
      if (!snapshot.ready || !Number.isInteger(delta)) return;
      const items = snapshot.items.map(item => item.id === id ? { ...item, quantity: Math.min(99, item.quantity + delta) } : item).filter(item => item.quantity > 0);
      update({ items, message: "Shopping bag updated." });
    },
    remove(id: string) { if (snapshot.ready) update({ items: snapshot.items.filter(item => item.id !== id), message: "Item removed from your shopping bag." }); },
    clear() { if (snapshot.ready) update({ items: [], promoCode: "", message: "Your shopping bag is now empty." }); },
    setPromoCode(value: string) { if (snapshot.ready) update({ promoCode: value === "GLOW20" ? "GLOW20" : "", message: value === "GLOW20" ? "GLOW20 applied." : "Discount removed." }); },
    clearMessage() { update({ message: "" }, false); },
  };
}
