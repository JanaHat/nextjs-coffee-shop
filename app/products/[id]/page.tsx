import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToBasketButton } from "@/app/products/[id]/_components/AddToBasketButton";
import { getProductById } from "@/src/lib/products";

export const revalidate = 300;

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Product not found",
      description: "The requested coffee product was not found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.name;
  const description = product.description;
  const canonicalPath = `/products/${product.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalPath,
      siteName: "Coffee Catalogue",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link href="/products" className="app-muted text-sm hover:underline">
          ← Back to catalogue
        </Link>

        <article className="app-surface rounded-2xl p-6 sm:p-8">
          <p className="app-muted mb-1 text-xs uppercase tracking-wide">
            {product.brand}
          </p>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="app-muted mb-6 text-sm leading-6">{product.description}</p>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="app-surface rounded-xl p-4">
              <p className="app-muted text-xs uppercase tracking-wide">Price</p>
              <p className="mt-1 text-xl font-semibold">{formatPrice(product.price)}</p>
            </div>

            <div className="app-surface rounded-xl p-4">
              <p className="app-muted text-xs uppercase tracking-wide">Rating</p>
              <p className="mt-1 text-xl font-semibold">
                {product.rating.toFixed(1)} / 5
              </p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="app-chip rounded-full px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>

          <AddToBasketButton
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              price: product.price,
            }}
          />
        </article>
      </main>
    </div>
  );
}
