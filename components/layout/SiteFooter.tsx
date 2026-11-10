import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary px-4 py-8 text-secondary-foreground sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
        <div>
          <Link href="/" className="font-heading text-2xl">ROSEVEIL COSMETICS</Link>
          <p>Your everyday moment of beauty.<br />Thoughtfully inspired by nature.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex gap-6 sm:justify-end">
          <Link href="/" className="inline-flex min-h-11 items-center hover:underline">Home</Link>
          <Link href="/products" className="inline-flex min-h-11 items-center hover:underline">Shop</Link>
        </nav>
        <p className="text-sm">© 2026 Roseveil Cosmetics. Concept design.</p>
        <p className="text-sm sm:text-right">A little glow, every day.</p>
      </div>
    </footer>
  );
}
