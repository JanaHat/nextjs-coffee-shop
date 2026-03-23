export function ProductsResultsLoading() {
  return (
    <>
      <section className="space-y-4">
        <div className="h-5 w-52 animate-pulse rounded bg-zinc-200" />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="app-surface space-y-3 rounded-2xl p-4 shadow-sm">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
              <div className="h-9 w-28 animate-pulse rounded bg-zinc-200" />
            </li>
          ))}
        </ul>
      </section>

      <div className="app-surface flex items-center justify-between rounded-2xl p-4">
        <div className="h-8 w-20 animate-pulse rounded bg-zinc-200" />
        <div className="h-5 w-16 animate-pulse rounded bg-zinc-200" />
        <div className="h-8 w-16 animate-pulse rounded bg-zinc-200" />
      </div>
    </>
  );
}
