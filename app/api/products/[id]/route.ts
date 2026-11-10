import { readProduct } from "@/features/catalog/products.server";
import { isProductId } from "@/features/catalog/product.validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const headers = { "Cache-Control": "no-store" };
  if (!isProductId(id)) {
    return Response.json({ error: "Invalid product ID" }, { status: 400, headers });
  }
  const product = await readProduct(id);
  return product
    ? Response.json(product, { headers })
    : Response.json({ error: "Product not found" }, { status: 404, headers });
}
