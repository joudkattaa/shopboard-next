"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const serverReducedMotion = () => true;

export function useHeroEntrance() {
  const artworkRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<readonly string[]>([]);
  const [failed, setFailed] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, serverReducedMotion);
  const [entrance, setEntrance] = useState<"ready" | "playing">("ready");
  const active = loaded.length === 5 && !failed && !reduced;
  function imageLoaded(id: string) {
    setLoaded(current => current.includes(id) ? current : [...current, id]);
  }
  useEffect(() => {
    // Cached assets may complete before hydration attaches their load handlers.
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      artworkRef.current?.querySelectorAll<HTMLImageElement>("img[data-hero-asset]").forEach(image => {
        const id = image.dataset.heroAsset;
        if (!id || !image.complete) return;
        if (image.naturalWidth > 0) imageLoaded(id);
        else setFailed(true);
      });
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!active) return;
    const artwork = artworkRef.current;
    const target = artwork?.closest("section") ?? artwork;
    if (!target) return;
    if (typeof IntersectionObserver === "undefined") {
      let cancelled = false;
      queueMicrotask(() => { if (!cancelled) setEntrance("playing"); });
      return () => { cancelled = true; };
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target !== target) continue;
        if (!entry.isIntersecting) setEntrance("ready");
        else if (entry.intersectionRatio >= 0.12) setEntrance("playing");
      }
    }, { threshold: [0, 0.12] });
    observer.observe(target);
    return () => observer.disconnect();
  }, [active]);
  return { artworkRef, active, entrance, imageLoaded, imageFailed: () => setFailed(true) };
}
