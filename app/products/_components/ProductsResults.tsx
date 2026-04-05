import Link from "next/link";

import { ProductCard } from "@/app/products/_components/ProductCard";
import { ProductsPagination } from "@/app/products/_components/ProductsPagination";
import { buildProductsHref } from "@/app/products/_lib/search-params";
import { auth } from "@/src/lib/auth";
import { listUserFavouriteProductIds } from "@/src/lib/favourites";
import { getProducts } from "@/src/lib/products";
import type { ProductsQuery } from "@/src/types/products-query";

type ProductsResultsProps = {
  query: ProductsQuery;
  searchParamsString: string;
};

const LOAD_MORE_BATCH_SIZE = 12;

export async function ProductsResults({
  query,
  searchParamsString,
}: ProductsResultsProps) {
  const session = await auth();
  const loadedCountTarget = query.page * LOAD_MORE_BATCH_SIZE;
  const result = getProducts({
    ...query,
    page: 1,
    pageSize: loadedCountTarget,
  });

  const hasNext = loadedCountTarget < result.total;
  const hasActiveFilters = Boolean(
    query.q ||
    query.tag ||
    query.sort ||
    typeof query.minPrice === "number" ||
    typeof query.maxPrice === "number",
  );

  const urlSearchParams = new URLSearchParams(searchParamsString);
  const productIds = result.items.map((product) => product.id);

  const favouriteIds = session?.user?.id
    ? new Set(
      await listUserFavouriteProductIds(session.user.id, {
        productIds,
      }),
    )
    : new Set<string>();

  return (
    <>
      <section className="space-y-4">
        <p className="text-sm text-(--app-text)">
          Showing <span className="font-medium">{result.items.length}</span> of{" "}
          <span className="font-medium">{result.total}</span> coffees
        </p>

        {result.items.length === 0 ? (
          <div className="app-surface rounded-2xl border-dashed p-8 text-center app-muted">
            <p>No products found. Try adjusting your filters.</p>
            {hasActiveFilters ? (
              <Link
                href="/products"
                className="app-button-secondary mt-4 inline-flex rounded-lg px-3 py-2 text-sm"
              >
                Clear filters
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                imageLoading={index === 0 ? "eager" : "lazy"}
                isFavourited={favouriteIds.has(product.id)}
              />
            ))}
          </ul>
        )}
      </section>

      <ProductsPagination
        loadedCount={result.items.length}
        total={result.total}
        hasNext={hasNext}
        nextHref={buildProductsHref(urlSearchParams, { page: query.page + 1 })}
      />
    </>
  );
}
