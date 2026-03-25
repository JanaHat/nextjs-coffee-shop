"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ProductsPaginationProps = {
  loadedCount: number;
  total: number;
  hasNext: boolean;
  nextHref: string;
};

export function ProductsPagination({
  loadedCount,
  total,
  hasNext,
  nextHref,
}: ProductsPaginationProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const raw = window.sessionStorage.getItem("products-scroll-y");

    if (!raw) {
      return;
    }

    window.sessionStorage.removeItem("products-scroll-y");
    const y = Number(raw);

    if (!Number.isFinite(y)) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: y });
    });
  }, [searchParams]);

  return (
    <nav className="app-surface flex flex-col items-center justify-center gap-3 rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <p className="app-muted text-sm">
          Loaded {loadedCount} of {total} coffees
        </p>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="app-button-secondary inline-flex h-7 w-7 items-center justify-center rounded-full"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="m6 15 6-6 6 6" />
          </svg>
        </button>
      </div>

      {hasNext ? (
        <Link
          href={nextHref}
          scroll={false}
          onClick={() => {
            window.sessionStorage.setItem("products-scroll-y", String(window.scrollY));
          }}
          className="app-button-secondary rounded-lg px-4 py-2 text-sm font-medium"
        >
          Load more
        </Link>
      ) : (
        <span className="app-muted text-sm">You have reached the end.</span>
      )}
    </nav>
  );
}
