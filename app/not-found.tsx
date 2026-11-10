import Link from "next/link";

export default function NotFound() {
  return (
    <section className="space-y-5">
      <h1 className="text-4xl">Page not found</h1>
      <p>404: We could not find that page.</p>
      <Link href="/" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 py-3 text-primary-foreground">Return to Home</Link>
    </section>
  );
}
