import Image from "next/image";
import Link from "next/link";

// Temporary Task 1 layout; original editorial composition follows in Task 3.
export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="grid items-center gap-8 md:grid-cols-2">
      <div className="space-y-5">
        <p className="text-sm tracking-widest text-muted-foreground">YOUR DAILY DOSE OF ROSEVEIL</p>
        <h1 id="hero-title" className="text-5xl leading-tight sm:text-6xl">A softer kind<br />of <em>radiance.</em></h1>
        <p>A little rose. A little ritual. Discover beauty essentials that make the everyday feel extraordinary.</p>
        <Link href="/products" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 py-3 text-primary-foreground">SHOP NOW</Link>
      </div>
      <Image src="/roseveil/hero-ivory-classic.jpg" alt="Roseveil mauve tube, plum serum, cream jar and rose-gold pump on ivory marble with blush blossoms and a vase" width={1254} height={1254} sizes="(min-width: 768px) 50vw, 100vw" preload className="h-auto w-full rounded-lg" />
    </section>
  );
}
