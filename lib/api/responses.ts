export function methodNotAllowed() {
  return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET", "Cache-Control": "no-store" } });
}
export function invalidProductId() {
  return Response.json({ error: "Invalid product ID" }, { status: 400, headers: { "Cache-Control": "no-store" } });
}
