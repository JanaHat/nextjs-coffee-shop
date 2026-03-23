import Link from "next/link";

import { buildProductsHref } from "@/app/products/_lib/search-params";
import type { ProductsQuery } from "@/src/types/products-query";

type ActiveFiltersProps = {
  query: ProductsQuery;
  searchParamsString: string;
};

const SORT_LABELS: Record<string, string> = {
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating_desc: "Top Rated",
};

export function ActiveFilters({ query, searchParamsString }: ActiveFiltersProps) {
  const params = new URLSearchParams(searchParamsString);

  const chips: Array<{ key: string; label: string }> = [];

  if (query.q) chips.push({ key: "q", label: `Search: ${query.q}` });
  if (query.tag) chips.push({ key: "tag", label: `Tag: ${query.tag}` });
  if (typeof query.minPrice === "number") {
    chips.push({ key: "minPrice", label: `Min: £${query.minPrice}` });
  }
  if (typeof query.maxPrice === "number") {
    chips.push({ key: "maxPrice", label: `Max: £${query.maxPrice}` });
  }
  if (query.sort) {
    chips.push({ key: "sort", label: `Sort: ${SORT_LABELS[query.sort] ?? query.sort}` });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={buildProductsHref(params, { [chip.key]: undefined, page: 1 })}
          className="app-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
        >
          {chip.label}
          <span aria-hidden="true">×</span>
        </Link>
      ))}

      <Link
        href="/products"
        className="app-button-secondary rounded-full px-3 py-1 text-xs"
      >
        Clear all
      </Link>
    </section>
  );
}
