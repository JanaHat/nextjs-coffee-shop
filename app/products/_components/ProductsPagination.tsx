import Link from "next/link";

type ProductsPaginationProps = {
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  previousHref: string;
  nextHref: string;
};

export function ProductsPagination({
  page,
  hasPrevious,
  hasNext,
  previousHref,
  nextHref,
}: ProductsPaginationProps) {
  return (
    <nav className="app-surface flex items-center justify-between rounded-2xl p-4">
      {hasPrevious ? (
        <Link
          href={previousHref}
          className="app-button-secondary rounded-lg px-3 py-2 text-sm"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-lg border px-3 py-2 text-sm text-zinc-400">
          Previous
        </span>
      )}

      <span className="app-muted text-sm">Page {page}</span>

      {hasNext ? (
        <Link
          href={nextHref}
          className="app-button-secondary rounded-lg px-3 py-2 text-sm"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-lg border px-3 py-2 text-sm text-zinc-400">Next</span>
      )}
    </nav>
  );
}
