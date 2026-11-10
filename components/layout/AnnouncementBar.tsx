"use client";

import { useBag } from "@/features/cart/BagProvider";

export default function AnnouncementBar() {
  const { store } = useBag();
  async function copyCode() {
    try { await navigator.clipboard.writeText("GLOW20"); store.notify("GLOW20 copied! Apply it in your bag for 20% off."); }
    catch { store.notify("Could not copy GLOW20. Enter it manually in your bag for 20% off."); }
  }
  return (
    <div className="bg-primary px-[var(--page-gutter)] pb-2.5 pt-[calc(10px+env(safe-area-inset-top,0px))] text-center text-[10px] leading-[1.7] tracking-[0.4px] text-primary-foreground dark:bg-card dark:text-foreground">
      FREE SHIPPING ON ORDERS OVER $50 <span aria-hidden="true" className="mx-2 opacity-60">|</span> USE CODE: <button type="button" aria-label="Copy discount code GLOW20" onClick={copyCode} className="min-h-7 cursor-pointer font-bold hover:underline [--focus-ring:currentColor]">GLOW20</button>
    </div>
  );
}
