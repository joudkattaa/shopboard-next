"use client";

import { useSyncExternalStore } from "react";
import BrandIcon from "@/components/layout/BrandIcon";
import { THEME_KEY, resolveTheme, type Theme } from "@/features/theme/theme";
const getServerSnapshot = (): Theme => "light";
const getSnapshot = (): Theme => document.documentElement.dataset.theme === "dark" ? "dark" : "light";
function subscribe(callback: () => void) {
  function storage(event: StorageEvent) {
    if (event.key !== THEME_KEY && event.key !== null) return;
    document.documentElement.dataset.theme = resolveTheme(event.newValue, window.matchMedia('(prefers-color-scheme: dark)').matches);
    callback();
  }
  window.addEventListener("roseveil-theme-change", callback);
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener("roseveil-theme-change", callback); window.removeEventListener("storage", storage); };
}
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  function toggle() {
    const next = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { window.localStorage.setItem(THEME_KEY, next); } catch { /* Current tab still works without storage. */ }
    window.dispatchEvent(new Event("roseveil-theme-change"));
  }
  return <button type="button" aria-label="Dark mode" aria-pressed={theme === "dark"} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={toggle} className="relative grid size-11 shrink-0 place-items-center rounded-full border border-border p-2.5 hover:text-[var(--rose-dark)]"><BrandIcon name="moon" className="dark:hidden" /><BrandIcon name="sun" className="hidden dark:block" /></button>;
}
