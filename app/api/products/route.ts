import { readProducts } from "@/features/catalog/products.server";

export async function GET() {
  const items = await readProducts();
  return Response.json({ items, total: items.length }, {
    headers: { "Cache-Control": "no-store" },
  });
}
