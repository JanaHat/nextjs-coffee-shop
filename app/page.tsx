import Link from "next/link";

export default function Home() {
  return (
    <div className="app-page flex items-center justify-center px-4 py-12">
      <main className="app-surface w-full max-w-2xl rounded-2xl p-8 shadow-sm">
        <p className="app-muted mb-3 text-sm font-medium uppercase tracking-wide">
          Technical Test
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-zinc-900">
          Coffee Product Catalogue
        </h1>
        <p className="app-muted mb-6">
          Built with Next.js App Router, TypeScript, and Tailwind CSS.
        </p>

        <Link
          href="/products"
          className="app-button-primary inline-flex h-11 items-center rounded-lg px-5 text-sm font-medium"
        >
          Browse products
        </Link>
      </main>
    </div>
  );
}
