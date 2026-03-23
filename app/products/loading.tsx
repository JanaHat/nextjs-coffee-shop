export default function ProductsLoading() {
  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-6xl space-y-6">
        <div className="h-9 w-64 animate-pulse rounded bg-zinc-200" />
        <div className="app-surface grid gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded-lg bg-zinc-200" />
          ))}
        </div>

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
      </main>
    </div>
  );
}
