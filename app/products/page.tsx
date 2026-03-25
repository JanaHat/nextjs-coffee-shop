import type { Metadata } from "next";
import { Suspense } from "react";

import { ActiveFilters } from "@/app/products/_components/ActiveFilters";
import { ProductsFilters } from "@/app/products/_components/ProductsFilters";
import { ProductsResults } from "@/app/products/_components/ProductsResults";
import { ProductsResultsLoading } from "@/app/products/_components/ProductsResultsLoading";
import { getTagOptions, toSearchParams } from "@/app/products/_lib/search-params";
import { parseProductsQuery } from "@/src/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Products",
  description: "Browse, search, and filter specialty coffee products.",
  alternates: {
    canonical: "/products",
  },
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = toSearchParams(resolvedSearchParams);
  const searchParamsString = urlSearchParams.toString();

  const query = parseProductsQuery(urlSearchParams);

  const tags = getTagOptions();

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Coffee Catalogue</h1>
          <p className="app-muted text-sm">
            Browse, search, and filter specialty coffees.
          </p>
        </header>

        <ProductsFilters query={query} tags={tags} />
        <ActiveFilters query={query} searchParamsString={searchParamsString} />

        <Suspense key={searchParamsString} fallback={<ProductsResultsLoading />}>
          <ProductsResults query={query} searchParamsString={searchParamsString} />
        </Suspense>
      </main>
    </div>
  );
}
