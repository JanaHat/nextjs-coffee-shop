"use client";

import Link from "next/link";
import { useEffect } from "react";

type ProductsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductsError({ error, reset }: ProductsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl">
        <section className="app-surface rounded-2xl p-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold">Could not load products</h1>
          <p className="app-muted mb-6 text-sm">
            There was a problem loading this view. Please retry.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="app-button-primary rounded-lg px-4 py-2 text-sm font-medium"
            >
              Retry
            </button>
            <Link
              href="/"
              className="app-button-secondary inline-flex rounded-lg px-4 py-2 text-sm font-medium"
            >
              Go home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
