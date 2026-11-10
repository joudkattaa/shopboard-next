"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useBag } from "@/features/cart/BagProvider";
import { checkoutOrder, validateCheckout, type DemoOrder, type CheckoutErrors, type CheckoutValues } from "@/features/checkout/checkout.logic";
import OrderSummary from "@/features/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
const fields = [{key:"fullName",label:"Full name",type:"text"},{key:"email",label:"Email",type:"email"},{key:"phone",label:"Phone number",type:"tel"},{key:"address",label:"Shipping address",type:"text"}] as const;
export default function Checkout() {
  const bag = useBag();
  const [confirmed, setConfirmed] = useState<DemoOrder | null>(null);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const submitted = useRef(false);
  const form = useRef<HTMLFormElement>(null), heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [confirmed, bag.ready]);
  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitted.current = true;
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map(({key})=>[key,String(data.get(key) ?? "")])) as CheckoutValues;
    const issues = validateCheckout(values); setErrors(issues);
    const first = fields.find(({key})=>issues[key]);
    if (first) { form.current?.querySelector<HTMLElement>(`[name="${first.key}"]`)?.focus(); return; }
    // Read the latest store at submission, never trust a stale displayed total.
    const current = bag.store.getSnapshot();
    const order = checkoutOrder({ ...current, ready: current.ready && (bag.pricesAvailable ?? true), products: bag.products });
    if (!order) return;
    form.current?.reset(); setConfirmed(order); bag.store.clear();
  }
  const order = checkoutOrder({ ...bag, ready: bag.ready && (bag.pricesAvailable ?? true) });
  if (!bag.ready) return <p role="status">Loading your shopping bag…</p>;
  if (confirmed) return <div><h2 ref={heading} tabIndex={-1} className="text-[26px] font-medium leading-[1.2]">Demo order confirmed</h2><p className="mb-5 mt-3 text-[13px] text-muted-foreground">This was a demo only. No payment was collected, no real order was placed and no shipping request was made. Your customer details were not saved or sent. Your shopping bag is now empty.</p><OrderSummary order={confirmed} /><Link href="/products" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground">Continue shopping</Link></div>;
  if (!bag.items.length) return <div><p>Your shopping bag is empty.</p><Link href="/products" className="inline-flex min-h-11 items-center text-primary underline">Explore the collection</Link></div>;
  return <div><h2 ref={heading} tabIndex={-1} className="text-[26px] font-medium leading-[1.2]">Customer information</h2><p id="checkout-demo-note" className="mb-5 mt-3 text-[13px] text-muted-foreground">Demo only. No real payment, real order or shipping request occurs. Your details are not saved or sent. Use sample details.</p>{order ? <OrderSummary order={order} /> : <p role="alert">Checkout is unavailable. Go back to your bag and reload current product prices.</p>}
    <form ref={form} aria-label="Demo checkout" aria-describedby="checkout-demo-note" autoComplete="off" noValidate onChange={event => {
        if (!submitted.current) return;
        const data = new FormData(event.currentTarget);
        const values = Object.fromEntries(fields.map(({key}) => [key, String(data.get(key) ?? "")])) as CheckoutValues;
        const key = (event.target as unknown as { name: keyof CheckoutValues }).name as keyof CheckoutValues;
        if (fields.some(field => field.key === key)) setErrors(current => ({ ...current, [key]: validateCheckout(values)[key] }));
      }} onSubmit={confirm}>
      <fieldset disabled={!order} className="grid min-w-0 gap-2"><legend className="mb-3 font-medium">Demo customer details</legend>{fields.map(({key,label,type})=><div key={key} className="flex min-w-0 flex-col gap-[7px]"><label htmlFor={"checkout-"+key} className="text-[13px]">{label}</label>{key === "address" ? <textarea id={"checkout-"+key} name={key} rows={3} required aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? key+"-error" : undefined} className="min-h-11 w-full min-w-0 resize-y rounded-lg border border-border bg-card px-3 py-2.5 dark:bg-background aria-invalid:border-destructive" /> : <input id={"checkout-"+key} name={key} type={type} required aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? key+"-error" : undefined} className="min-h-11 w-full min-w-0 rounded-lg border border-border bg-card px-3 py-2.5 dark:bg-background aria-invalid:border-destructive" />}{errors[key] && <p id={key+"-error"} role="alert" className="mb-2.5 text-[13px] text-destructive">{errors[key]}</p>}</div>)}</fieldset>
      <div className="mt-4 flex flex-wrap gap-3"><Link href="/bag" className="inline-flex min-h-11 flex-[1_1_200px] items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-xs font-semibold dark:bg-background">Back to shopping bag</Link><Button type="submit" disabled={!order} className="flex-[1_1_200px]">Confirm demo order</Button></div>
    </form></div>;
}
