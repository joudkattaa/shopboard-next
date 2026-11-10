"use client";

/* Native images preserve the source srcSet and transparent layer geometry. */
/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { useHeroEntrance } from "@/components/hero/useHeroEntrance";

const layers = [
  { id: "tube", width: 265, height: 650, className: "left-[25%] bottom-[32%] w-[17%] z-[1]", delay: "0ms" },
  { id: "pump", width: 227, height: 650, className: "left-[68%] bottom-[27%] w-[14%] z-[1]", delay: "540ms" },
  { id: "serum", width: 248, height: 650, className: "left-[39%] bottom-[25%] w-[14%] z-[2]", delay: "180ms" },
  { id: "jar", width: 450, height: 362, className: "left-[51%] bottom-[22%] w-[24%] z-[3]", delay: "360ms" },
];
export default function HeroArtwork() {
  const { artworkRef, active, entrance, imageLoaded, imageFailed } = useHeroEntrance();
  return (
    <div ref={artworkRef} role="img" aria-label="Roseveil mauve tube, plum serum, cream jar and rose-gold pump on ivory marble with blush blossoms and a vase" className="pointer-events-none absolute -right-[16vw] top-0 z-0 w-[min(90vw,700px)] min-[800px]:right-0 min-[800px]:top-1/2 min-[800px]:w-[min(64vw,840px)] min-[800px]:-translate-y-1/2 after:pointer-events-none after:absolute after:inset-0 after:z-[4] after:bg-[linear-gradient(90deg,var(--hero-surface),transparent_16%),linear-gradient(180deg,var(--hero-surface),transparent_10%)] after:content-['']">
      <picture hidden={active} className="relative block h-auto overflow-hidden [&[hidden]]:hidden">
        <img src="/roseveil/hero-ivory-classic.jpg" srcSet="/roseveil/hero-ivory-classic-640.jpg 640w, /roseveil/hero-ivory-classic.jpg 1254w" sizes="(min-width: 1313px) 840px, (min-width: 800px) 64vw, (min-width: 778px) 700px, 90vw" decoding="async" alt="" fetchPriority="high" width={1254} height={1254} className="block aspect-square h-auto min-h-0 w-full object-contain object-center" />
      </picture>
      <div hidden={!active} data-entrance={active ? entrance : undefined} className="group/scene relative aspect-square h-auto overflow-hidden [&[hidden]]:hidden">
        <img src="/roseveil/hero-stage-ivory.jpg" data-hero-asset="stage" alt="" width={1254} height={1254} loading="eager" decoding="async" onLoad={() => imageLoaded("stage")} onError={imageFailed} className="block aspect-square h-auto w-full" />
        {layers.map(layer => (
          <span key={layer.id} style={{ "--hero-delay": layer.delay } as CSSProperties} className={"pointer-events-none absolute motion-safe:group-data-[entrance=ready]/scene:opacity-0 motion-safe:group-data-[entrance=ready]/scene:translate-y-[30px] min-[800px]:motion-safe:group-data-[entrance=ready]/scene:translate-y-0 min-[800px]:motion-safe:group-data-[entrance=ready]/scene:translate-x-12 motion-safe:group-data-[entrance=playing]/scene:animate-[roseveil-product-entrance_1100ms_cubic-bezier(0.22,1,0.36,1)_var(--hero-delay)_both] min-[800px]:motion-safe:group-data-[entrance=playing]/scene:[animation-name:roseveil-product-entrance-desktop] after:absolute after:bottom-0 after:left-[10%] after:h-[1%] after:w-4/5 after:rounded-full after:bg-[var(--hero-layer-shadow)] after:shadow-[0_2px_5px_2px_var(--hero-layer-shadow-blur)] after:content-[''] " + layer.className}>
            <img src={"/roseveil/hero-layer-classic-" + layer.id + ".webp"} data-hero-asset={layer.id} alt="" width={layer.width} height={layer.height} loading="eager" decoding="async" onLoad={() => imageLoaded(layer.id)} onError={imageFailed} className="relative z-[1] block h-auto w-full" />
          </span>
        ))}
      </div>
    </div>
  );
}
