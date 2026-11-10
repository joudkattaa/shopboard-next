"use client";

import { useBag } from "@/features/cart/BagProvider";
export default function AddToBagButton({ id, name, detail = false }: { id: string; name: string; detail?: boolean }) {
  const { store, ready, pricesAvailable = true } = useBag();
  return <button type="button" disabled={!ready || !pricesAvailable} onClick={() => store.add(id)} aria-label={"Add " + name + " to bag"} className={detail ? "my-3 flex min-h-11 items-center justify-center gap-2 rounded-roseveil-30 border border-primary bg-primary px-6 py-3 text-[11px] font-semibold tracking-[1px] text-primary-foreground hover:bg-[var(--rose-dark)] disabled:opacity-50" : "flex min-h-11 w-full items-center justify-center gap-2 rounded-roseveil-30 border border-border bg-secondary px-1 py-2.5 text-[9px] font-semibold tracking-[1px] text-[var(--rose-dark)] hover:border-[var(--rose-dark)] hover:bg-[var(--rose-dark)] hover:text-background disabled:opacity-50 dark:bg-background dark:text-primary dark:hover:border-primary dark:hover:bg-primary dark:hover:text-primary-foreground"}>
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V5a3 3 0 0 1 6 0v3" /></svg>ADD TO BAG
  </button>;
}
