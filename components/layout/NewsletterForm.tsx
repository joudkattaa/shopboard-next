"use client";

import { useState, type FormEvent } from "react";
import BrandIcon from "@/components/layout/BrandIcon";

const confirmation = "A little glow, just for you. Demo signup complete — no email was saved or sent.";
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setEmail(""); setSubmitted(true); }
  return (
    <form id="newsletter" aria-labelledby="newsletter-title" onSubmit={submit} className="grid w-full grid-cols-1 gap-[18px] min-[1000px]:grid-cols-2 min-[1000px]:gap-8">
      <div>
        <p className="text-[9px] tracking-[2px] text-[var(--rose-dark)] dark:text-primary">LET YOUR EVERYDAY BLOOM</p>
        <h2 id="newsletter-title" className="mb-2.5 mt-2 text-balance text-[clamp(26px,3vw,32px)] font-normal leading-[1.05] tracking-[-0.6px]">A little beauty, <em className="text-[var(--rose-dark)] dark:text-primary">in your inbox.</em></h2>
        <p className="max-w-[340px] text-xs leading-[1.8] text-muted-foreground">New rituals, thoughtful notes, and a little Roseveil inspiration.</p>
      </div>
      <div className="min-w-0 self-center">
        <label htmlFor="newsletter-email" className="mb-1.5 block text-[11px]">Your email address</label>
        <div className="grid gap-2.5 min-[600px]:grid-cols-[minmax(0,1fr)_auto]">
          <input id="newsletter-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={254} aria-describedby="newsletter-demo" value={email} onChange={(event) => { setEmail(event.target.value); setSubmitted(false); }} className="min-h-11 w-full min-w-0 rounded-xl border border-border bg-background px-3.5 py-2.5 font-sans text-base text-foreground placeholder:text-[var(--footer-placeholder)] dark:placeholder:text-muted-foreground" />
          <button type="submit" className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-xl border border-primary bg-primary px-4 py-2.5 text-[10px] tracking-[1px] text-primary-foreground hover:border-[var(--rose-dark)] hover:bg-[var(--rose-dark)]">JOIN THE RITUAL <BrandIcon name="arrow" className="size-[18px]" /></button>
        </div>
        <p id="newsletter-demo" className="mt-3 text-[10px] leading-[1.7] text-muted-foreground">Demo signup only. Your email is not saved or sent.</p>
        <div className="mt-[9px] grid text-[11px]">
          <span aria-hidden="true" className="invisible col-start-1 row-start-1">{confirmation}</span>
          <p role="status" className="col-start-1 row-start-1 text-[var(--rose-dark)] dark:text-primary">{submitted ? confirmation : ""}</p>
        </div>
      </div>
    </form>
  );
}
