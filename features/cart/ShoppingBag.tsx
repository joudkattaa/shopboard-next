"use client";

import Link from "next/link";
import { useRef } from "react";
import { useBag } from "@/features/cart/BagProvider";
import { productById } from "@/features/catalog/products.logic";
import { formatMoney } from "@/lib/format-money";
import CartRow from "@/features/cart/CartRow";
import PromoForm from "@/features/cart/PromoForm";

export default function ShoppingBag() {
  const { items, promoCode, products, totals, ready, store } = useBag();
  const content = useRef<HTMLDivElement>(null);
  function restore() { content.current?.focus({ preventScroll: true }); }
  return <div ref={content} tabIndex={-1} id="cart-content" role="group" aria-label="Shopping bag contents">
    {!ready ? <p role="status">Loading your shopping bag…</p> : !items.length ? <div className="px-[15px] py-[30px] text-center"><h2 className="text-2xl">Your next little luxury awaits.</h2><p className="mb-[22px] mt-2.5 text-[13px] text-muted-foreground">Your shopping bag is empty. Find something you’ll love.</p><Link href="/products" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground">EXPLORE THE COLLECTION</Link></div> : <>
      <p className="my-[18px] bg-secondary p-3 text-xs text-muted-foreground dark:bg-card dark:text-foreground">{totals.merchandise > 5000 ? "Lovely! Your bag qualifies for free shipping." : `Add ${formatMoney(5001 - totals.merchandise)} more after discounts for free shipping.`}</p>
      <p className="text-xs text-muted-foreground">{totals.count} {totals.count === 1 ? "item" : "items"} in your bag.</p>
      <ul>{items.map(item => <CartRow key={item.id} id={item.id} product={productById(item.id, products)} quantity={item.quantity} pricesAvailable onQuantity={store.changeQuantity} onRemove={store.remove} onRowRemoved={restore} />)}</ul>
      <button type="button" onClick={() => { store.clear(); restore(); }} className="mb-5 ms-auto mt-2 flex min-h-11 items-center rounded-full border border-border bg-secondary/65 px-4 py-[9px] text-[11px] font-medium tracking-[0.3px] text-[var(--rose-dark)] hover:bg-secondary">Clear Bag</button>
      <PromoForm appliedCode={promoCode} onApply={store.setPromoCode} />
      <div className="my-5 space-y-3 [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&>div]:text-sm [&>div>span:last-child]:text-right">
        <div><span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span></div>
        {totals.discount > 0 && <div><span>GLOW20 · 20% off</span><span>−{formatMoney(totals.discount)}</span></div>}
        <div><span>Demo shipping</span><span>{totals.shipping ? formatMoney(totals.shipping) : "FREE"}</span></div>
        <div className="border-t border-border pt-4 font-semibold"><span>Total</span><span>{formatMoney(totals.total)}</span></div>
      </div>
      <Link href="/checkout" aria-describedby="checkout-demo" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground">DEMO CHECKOUT</Link>
      <p id="checkout-demo" className="mt-2.5 text-center text-[10px] text-muted-foreground">Demo only. No real payment, real order or shipping request occurs.</p>
      <Link href="/products" className="mt-4 inline-flex min-h-11 items-center text-xs text-[var(--rose-dark)] underline underline-offset-4">Continue shopping</Link>
    </>}
  </div>;
}
