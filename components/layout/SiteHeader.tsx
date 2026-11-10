import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href="/" aria-label="Roseveil Cosmetics home" className="font-heading text-3xl">
          ROSEVEIL <span className="font-sans text-xs tracking-widest">COSMETICS</span>
        </Link>
        <nav aria-label="Main navigation" className="flex gap-6">
          <Link href="/" className="inline-flex min-h-11 items-center hover:underline">Home</Link>
          <Link href="/products" className="inline-flex min-h-11 items-center hover:underline">Shop</Link>
        </nav>
      </div>
    </header>
  );
}
