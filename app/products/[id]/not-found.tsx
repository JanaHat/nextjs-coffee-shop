import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl">
        <section className="app-surface rounded-2xl p-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold">Product not found</h1>
          <p className="app-muted mb-6 text-sm">
            The product you requested does not exist or was removed.
          </p>
          <Link
            href="/products"
            className="app-button-secondary inline-flex rounded-lg px-4 py-2 text-sm font-medium"
          >
            Back to catalogue
          </Link>
        </section>
      </main>
    </div>
  );
}
