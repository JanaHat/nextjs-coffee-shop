"use client";

import {
  type ChangeEvent,
  useMemo,
  useRef,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ProductsQuery } from "@/src/types/products-query";

type ProductsFiltersProps = {
  query: ProductsQuery;
  tags: string[];
};

export function ProductsFilters({ query, tags }: ProductsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchDebounceRef = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const baseParams = useMemo(
    () => new URLSearchParams(currentSearchParams.toString()),
    [currentSearchParams],
  );

  const navigateWithUpdates = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(baseParams);

    for (const [key, value] of Object.entries(updates)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => {
      router.replace(url);
    });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextSearch = event.target.value;

    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(() => {
      const trimmedSearch = nextSearch.trim();
      const currentSearch = currentSearchParams.get("q") ?? "";

      if (trimmedSearch === currentSearch) {
        return;
      }

      navigateWithUpdates({
        q: trimmedSearch || undefined,
        page: "1",
      });
    }, 350);
  };

  const handleQuickSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    navigateWithUpdates({
      [name]: value || undefined,
      page: "1",
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    navigateWithUpdates({
      q: String(formData.get("q") ?? "").trim() || undefined,
      minPrice: String(formData.get("minPrice") ?? "").trim() || undefined,
      maxPrice: String(formData.get("maxPrice") ?? "").trim() || undefined,
      page: "1",
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="app-surface flex flex-col gap-4 rounded-2xl p-4 shadow-sm"
    >
      <label className="flex w-full flex-col gap-1 text-sm">
        Search
        <input
          type="search"
          name="q"
          defaultValue={query.q}
          onChange={handleSearchChange}
          placeholder="Name, brand, or tag"
          className="app-input w-full"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          Min price
          <input
            type="number"
            name="minPrice"
            min="0"
            step="0.1"
            defaultValue={query.minPrice ?? ""}
            className="app-input w-full"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Max price
          <input
            type="number"
            name="maxPrice"
            min="0"
            step="0.1"
            defaultValue={query.maxPrice ?? ""}
            className="app-input w-full"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tag
          <select
            name="tag"
            defaultValue={query.tag ?? ""}
            onChange={handleQuickSelectChange}
            className="app-input w-full"
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Sort
          <select
            name="sort"
            defaultValue={query.sort ?? ""}
            onChange={handleQuickSelectChange}
            className="app-input w-full"
          >
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
          </select>
        </label>
      </div>

      <input type="hidden" name="page" value="1" />
      <input type="hidden" name="pageSize" value={String(query.pageSize)} />

      <div className="flex flex-wrap items-end gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="app-button-primary h-10 rounded-lg px-4 text-sm font-medium"
        >
          {isPending ? "Applying..." : "Apply price"}
        </button>
      </div>
    </form>
  );
}
