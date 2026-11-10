"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useDiscovery } from "@/features/catalog/DiscoveryProvider";
export default function ShopLink({ children, className }: { children: ReactNode; className?: string }) {
  const { reset, resetShop = reset } = useDiscovery();
  return <Link href="/products" onNavigate={resetShop} className={className}>{children}</Link>;
}

export function HomeLink({ children, ...props }: Omit<ComponentProps<typeof Link>, "href" | "onNavigate">) {
  const { resetHome } = useDiscovery();
  return <Link {...props} href="/" onNavigate={resetHome}>{children}</Link>;
}
