"use client";

export default function ProductsError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section aria-labelledby="products-error-title" className="space-y-5">
      <h2 id="products-error-title" className="text-3xl">Unable to load the collection</h2>
      <p role="alert">We could not load the products. Please try again.</p>
      <button type="button" onClick={() => retry()} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 py-3 text-primary-foreground">
        Try again
      </button>
    </section>
  );
}
