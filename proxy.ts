import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { invalidProductId, methodNotAllowed } from "@/lib/api/responses";
// Validate the raw path before Next decodes a dynamic route parameter.
export function proxy(request: NextRequest) {
  const path = new URL(request.url).pathname;
  if (path !== "/api/products" && !path.startsWith("/api/products/")) return NextResponse.next();
  if (request.method !== "GET") return methodNotAllowed();
  if (path.startsWith("/api/products/")) {
    try { if (!/^[a-z0-9-]+$/.test(decodeURIComponent(path.slice("/api/products/".length)))) return invalidProductId(); }
    catch { return invalidProductId(); }
  }
  return NextResponse.next();
}
export const config = { matcher: "/api/:path*" };
