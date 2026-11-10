"use client";

import { useState } from "react";

export default function AnnouncementBar() {
  const [message, setMessage] = useState("");
  async function copyCode() {
    try { await navigator.clipboard.writeText("GLOW20"); setMessage("Discount code GLOW20 copied."); }
    catch { setMessage("Copy unavailable. Your discount code is GLOW20."); }
  }
  return (
    <div className="bg-primary px-[var(--page-gutter)] pb-2.5 pt-[calc(10px+env(safe-area-inset-top,0px))] text-center text-[10px] leading-[1.7] tracking-[0.4px] text-primary-foreground dark:bg-card dark:text-foreground">
      FREE SHIPPING ON ORDERS OVER $50 <span aria-hidden="true" className="mx-2 opacity-60">|</span> USE CODE: <button type="button" aria-label="Copy discount code GLOW20" onClick={copyCode} className="min-h-7 cursor-pointer font-bold hover:underline focus-visible:outline-current">GLOW20</button>
      <span role="status" className="sr-only">{message}</span>
    </div>
  );
}
