import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToBasketButton } from "@/app/products/_components/AddToBasketButton";
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

const getStarRating = (rating: number) => {
  const fullStars = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) => (index < fullStars ? "★" : "☆")).join(
    "",
  );
};

const getDetailedParagraphs = (product: ReturnType<typeof getProductById>) => {
  if (!product) {
    return ["", ""];
  }

  const firstParagraph = product.detailedDescreption || product.description;
  const tagsPreview = product.tags.slice(0, 3).join(", ");
  const secondParagraph = `${product.name} from ${product.brand} is rated ${product.rating.toFixed(1)} out of 5 and is a great choice if you enjoy ${tagsPreview}. It works especially well when brewed with care and pairs nicely with both black coffee drinkers and those who prefer adding milk, depending on your taste.`;

  return [firstParagraph, secondParagraph];
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
  const description = product.detailedDescreption || product.description;
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

  const [descriptionPrimary, descriptionSecondary] = getDetailedParagraphs(product);

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link href="/products" className="app-muted text-sm hover:underline">
          ← Back to catalogue
        </Link>

        <article className="app-surface rounded-2xl p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="app-surface overflow-hidden rounded-xl">
              <Image
                src={product.imageUrl ?? `/${product.id}.webp`}
                alt={`${product.name} by ${product.brand}`}
                width={900}
                height={900}
                className="h-full min-h-80 w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="app-muted text-xs uppercase tracking-wide">{product.brand}</p>
              <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
              <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
              <p
                className="text-2xl tracking-wide text-green-600"
                aria-label={`${product.rating.toFixed(1)} out of 5 stars`}
                title={`${product.rating.toFixed(1)} / 5`}
              >
                {getStarRating(product.rating)}
              </p>

              <div className="pt-1">
                <AddToBasketButton
                  product={{
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm leading-6 text-(--app-text)">{descriptionPrimary}</p>
            <p className="mt-4 text-sm leading-6 text-(--app-text)">{descriptionSecondary}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="app-chip rounded-full px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
