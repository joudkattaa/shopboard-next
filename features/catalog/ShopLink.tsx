"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useDiscovery } from "@/features/catalog/DiscoveryProvider";
export default function ShopLink({ children, className }: { children: ReactNode; className?: string }) {
  const { reset } = useDiscovery();
  return <Link href="/products" onNavigate={reset} className={className}>{children}</Link>;
}
