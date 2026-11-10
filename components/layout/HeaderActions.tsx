"use client";

import Link from "next/link";
import BrandIcon from "@/components/layout/BrandIcon";
import { useBag } from "@/features/cart/BagProvider";
import { useDiscovery } from "@/features/catalog/DiscoveryProvider";
export default function HeaderActions() {
  const { totals } = useBag();
  const { searchOpen, setSearchOpen } = useDiscovery();
  const iconClass = "relative grid size-11 shrink-0 place-items-center rounded-full p-2.5";
  return <div className="order-2 col-span-full flex w-full justify-between gap-3 min-[480px]:w-auto min-[480px]:gap-1 min-[1200px]:shrink-0">
    <button type="button" disabled aria-label="Dark mode unavailable" aria-describedby="header-unavailable" className={iconClass + " cursor-not-allowed border border-border opacity-50"}><BrandIcon name="moon" className="dark:hidden" /><BrandIcon name="sun" className="hidden dark:block" /></button>
    <button id="header-search-toggle" type="button" aria-label="Search products" aria-expanded={searchOpen} aria-controls="header-search-panel" onClick={() => setSearchOpen(!searchOpen)} className={iconClass}><BrandIcon name="search" /></button>
    <button type="button" disabled aria-label="Demo account unavailable" aria-describedby="header-unavailable" className={iconClass + " cursor-not-allowed opacity-50"}><BrandIcon name="user" /></button>
    <Link href="/bag" aria-label={`Open shopping bag, ${totals.count} items`} className={iconClass}><BrandIcon name="bag" /><span aria-hidden="true" className="absolute right-0 top-0 h-[15px] min-w-[15px] rounded-full bg-primary px-[3px] text-[8px] text-primary-foreground">{totals.count}</span></Link>
  </div>;
}
