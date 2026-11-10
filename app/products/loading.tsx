export default function ProductsLoading() {
  return (
    <div role="status" aria-label="Loading products" className="space-y-8">
      <span className="sr-only">Loading products…</span>
      <div aria-hidden="true" className="space-y-8">
        <div className="h-10 w-56 rounded-lg bg-muted" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-4 rounded-lg border border-border p-4">
              <div className="aspect-square rounded-lg bg-muted motion-safe:animate-pulse" />
              <div className="h-6 w-3/4 rounded-lg bg-muted" />
              <div className="h-4 w-1/2 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
