import Link from "next/link";
import ShopLink from "@/features/catalog/ShopLink";
import BrandIcon from "@/components/layout/BrandIcon";
import BrandLogo from "@/components/layout/BrandLogo";
import NewsletterForm from "@/components/layout/NewsletterForm";

const container = "mx-auto w-[calc(100%-var(--inset-start)-var(--inset-end))] max-w-[1250px]";
const item = "flex min-h-11 items-center gap-2 py-[5px] text-left text-xs leading-[1.5] hover:text-[var(--rose-dark)] hover:underline min-[1000px]:pointer-fine:min-h-[30px]";
const heading = "mb-3 text-balance font-sans text-[10px] font-semibold leading-[1.5] tracking-[1.5px] text-[var(--rose-dark)] dark:text-primary";
export default function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-linear-[120deg,var(--footer-gradient-start),var(--footer-gradient-end)] text-foreground dark:bg-none dark:bg-card">
      <div className={container + " border-b border-border py-6"}><NewsletterForm /></div>
      <p id="footer-unavailable" className="sr-only">About Us, journal, policies and contact features are unavailable during this migration stage.</p>
      <div className={container + " grid grid-cols-2 gap-6 py-9 [&>div]:min-w-0 min-[600px]:grid-cols-3 min-[1000px]:grid-cols-[1.4fr_1fr_1fr_1.2fr] min-[1000px]:gap-7 min-[1000px]:py-7"}>
        <div className="col-span-full min-[1000px]:col-span-1">
          <BrandLogo footer />
          <p className="text-xs leading-[1.7] text-muted-foreground dark:text-foreground">Your everyday moment of beauty.<br />Thoughtfully inspired by nature.</p>
          <a href="#newsletter" className={item + " mt-3 text-[11px] text-[var(--rose-dark)] dark:text-primary"}>A little inspiration, in your inbox <span aria-hidden="true">?</span></a>
        </div>
        <div>
          <h2 className={heading}>EXPLORE ROSEVEIL</h2>
          <Link className={item} href="/">Home</Link>
          <ShopLink className={item}>Shop</ShopLink>
          <Link className={item} href="/bag">Shopping Bag</Link>
          {["About Us", "Beauty Journal", "Contact Us"].map(label => <button key={label} type="button" disabled aria-describedby="footer-unavailable" className={item + " cursor-not-allowed disabled:opacity-50"}>{label}</button>)}
        </div>
        <div>
          <h2 className={heading}>CUSTOMER CARE</h2>
          {["Shipping Policy", "Return Policy", "Terms & Conditions", "Privacy Policy", "FAQs"].map(label => <button key={label} type="button" disabled aria-describedby="footer-unavailable" className={item + " cursor-not-allowed disabled:opacity-50"}>{label}</button>)}
        </div>
        <div className="col-span-full border-t border-border pt-4 min-[600px]:col-span-1 min-[600px]:border-0 min-[600px]:pt-0">
          <h2 className={heading}>LET&apos;S CONNECT</h2>
          <button type="button" disabled aria-describedby="footer-unavailable" className={item + " cursor-not-allowed disabled:opacity-50"}><BrandIcon name="mail" className="size-[15px] shrink-0" />Write to Roseveil</button>
          <p className="flex items-center gap-[9px] text-xs leading-[1.7] text-muted-foreground"><BrandIcon name="pin" className="size-[15px] shrink-0" />Beauty, wherever you are.</p>
          <p className="mt-3 text-[10px] leading-[1.7] text-muted-foreground dark:text-foreground">Concept store · Demo shopping.<br />No real payments or deliveries.</p>
        </div>
      </div>
      <div className={container + " flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[var(--footer-divider)] pb-[max(14px,env(safe-area-inset-bottom,0px))] pt-3.5 text-[10px] leading-[1.7] text-muted-foreground dark:border-border dark:text-foreground"}>
        <span>© 2026 Roseveil Cosmetics. Concept design.</span><span>A little glow, every day.</span>
      </div>
    </footer>
  );
}
