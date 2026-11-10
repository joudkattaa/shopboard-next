import ShopLink from "@/features/catalog/ShopLink";
import HeroArtwork from "@/components/hero/HeroArtwork";

const badgeIcon = "mx-auto size-[18px] shrink-0 fill-none stroke-current stroke-[1.1] text-vintage-plum min-[800px]:size-[26px] dark:text-primary";
export default function HeroSection() {
  return (
    <section data-home-hero aria-labelledby="hero-title" className="relative isolate block min-h-[clamp(400px,75vw,560px)] overflow-hidden bg-[var(--hero-surface)] [--hero-surface:var(--hero-ivory)] min-[800px]:min-h-[clamp(560px,48vw,720px)] dark:[--hero-surface:var(--background)]">
      <link rel="preload" as="image" type="image/jpeg" href="/roseveil/hero-ivory-classic.jpg" imageSrcSet="/roseveil/hero-ivory-classic-640.jpg 640w, /roseveil/hero-ivory-classic.jpg 1254w" imageSizes="(min-width: 1313px) 840px, (min-width: 800px) 64vw, (min-width: 778px) 700px, 90vw" fetchPriority="high" />
      <div className="pointer-events-none relative z-[2] mx-auto grid min-h-[inherit] w-[calc(100%-40px)] max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center py-6 min-[800px]:py-14">
        <div className="pointer-events-auto max-w-[44%] pb-0 pt-2 motion-safe:animate-[roseveil-hero-in_750ms_ease-out]">
          <p className="mb-3 text-[8px] font-semibold leading-[1.6] tracking-[1.2px] text-[var(--rose-dark)] min-[800px]:mb-[18px] min-[800px]:text-[10px] min-[800px]:tracking-[2.2px] dark:text-primary">YOUR DAILY DOSE OF ROSEVEIL</p>
          <h1 id="hero-title" className="text-balance text-[clamp(28px,6.5vw,40px)] font-normal leading-[0.98] tracking-[-0.8px] min-[800px]:text-[clamp(62px,6.3vw,88px)] min-[800px]:tracking-[-1.8px]">A softer kind<br />of <em className="font-normal text-[var(--rose-dark)]">radiance.</em></h1>
          <p className="mt-3.5 max-w-[370px] text-[11px] leading-[1.65] text-muted-foreground min-[800px]:mt-6 min-[800px]:text-[15px] min-[800px]:leading-[1.85] dark:text-primary">A little rose. A little ritual. Discover beauty essentials that make the everyday feel extraordinary.</p>
          <ShopLink className="mt-[18px] inline-flex min-h-11 items-center justify-center rounded-4xl border border-primary bg-primary px-[22px] py-[11px] text-[11px] font-semibold leading-[1.4] tracking-[1.6px] text-primary-foreground hover:border-[var(--rose-dark)] hover:bg-[var(--rose-dark)] motion-safe:transition-[scale,background-color,opacity] motion-safe:duration-150 motion-safe:ease-out motion-safe:active:not-focus-visible:scale-[0.96] min-[800px]:mt-[26px] min-[800px]:min-h-12 min-[800px]:px-[30px] min-[800px]:py-[15px]">SHOP NOW</ShopLink>
          <div className="mt-5 flex max-w-[360px] gap-2 min-[800px]:mt-[30px] min-[800px]:gap-[18px] dark:text-primary">
            <div className="flex-1 text-center"><svg viewBox="0 0 32 32" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round" className={badgeIcon}><path d="M16 29V15M16 22C4 24 2 15 3 10c9-1 13 4 13 12ZM16 17C15 6 24 3 29 3c1 9-5 15-13 14Z" /><path d="m8 16 8 6 8-13" /></svg><span className="mt-2 block text-[6.5px] font-semibold leading-[1.7] min-[800px]:text-[8px]">BOTANICAL<br />INSPIRATION</span></div>
            <div className="flex-1 text-center"><svg viewBox="0 0 32 32" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round" className={badgeIcon}><path d="M12 15C5 1 12 0 15 13c2-15 9-13 5 1 8 2 8 13 0 15H10c-6-2-6-8-2-11M9 22l-3-1M19 19h.01M17 25h4" /><circle cx="27" cy="25" r="3" /></svg><span className="mt-2 block text-[6.5px] font-semibold leading-[1.7] min-[800px]:text-[8px]">THOUGHTFUL<br />BEAUTY</span></div>
            <div className="flex-1 text-center"><svg viewBox="0 0 32 32" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round" className={badgeIcon}><path d="M12 3h8M14 3v9L5 28h22l-9-16V3M10 20h12M13 23h.01M19 25h.01" /></svg><span className="mt-2 block text-[6.5px] font-semibold leading-[1.7] min-[800px]:text-[8px]">CONSIDERED<br />FORMULAS</span></div>
          </div>
        </div>
      </div>
      <HeroArtwork />
    </section>
  );
}
