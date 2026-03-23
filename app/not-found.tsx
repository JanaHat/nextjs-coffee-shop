import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl">
        <section className="app-surface rounded-2xl p-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold">Page not found</h1>
          <p className="app-muted mb-6 text-sm">
            The page you are looking for does not exist or was removed. Please check the URL or select an option below.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="app-button-secondary inline-flex rounded-lg px-4 py-2 text-sm font-medium items-center justify-center"
            >
              Back to Main Page
            </Link>
            <Link
              href="/products"
              className="app-button-secondary inline-flex rounded-lg px-4 py-2 text-sm font-medium items-center justify-center"
            >
              Browse products
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
