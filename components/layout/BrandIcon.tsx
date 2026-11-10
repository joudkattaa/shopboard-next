import type { SVGProps } from "react";

type IconName = "flower" | "menu" | "search" | "user" | "bag" | "moon" | "sun" | "arrow" | "mail" | "pin";
const shapes: Record<IconName, React.ReactNode> = {
  flower: <><circle cx="16" cy="16" r="4" /><path d="M12 11c-9-9 8-15 8 0 9-9 15 8 0 9 9 9-8 15-8 0-9 9-15-8 0-9Z" /></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  user: <><circle cx="12" cy="7" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2Z" /></>,
  bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V5a3 3 0 0 1 6 0v3" /></>,
  moon: <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  arrow: <path d="M4 12h16m-5-5 5 5-5 5" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>,
  pin: <><path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0Z" /><circle cx="12" cy="9" r="2" /></>,
};

export default function BrandIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg viewBox={name === "flower" ? "0 0 32 32" : "0 0 24 24"} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{shapes[name]}</svg>;
}
