import Image from "next/image";
import Link from "next/link";

import { AddToBasketButton } from "@/app/products/_components/AddToBasketButton";
import type { Product } from "@/src/types/product";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

type ProductCardProps = {
  product: Product;
  imageLoading?: "lazy" | "eager";
};

const getStarRating = (rating: number) => {
  const fullStars = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) => (index < fullStars ? "★" : "☆")).join(
    "",
  );
};

export function ProductCard({ product, imageLoading = "lazy" }: ProductCardProps) {
  return (
    <li className="app-surface rounded-2xl p-4 shadow-sm transition hover:shadow-md">
      <div className="flex mb-4 justify-between overflow-hidden">
        <Image
          src={product.imageUrl ?? `/${product.id}.webp`}
          alt={`${product.name} by ${product.brand}`}
          width={640}
          height={640}
          loading={imageLoading}
          fetchPriority={imageLoading === "eager" ? "high" : "auto"}
          className="h-48 w-[50%] object-scale-down"
        />

        <div className="mb-4 flex w-[50%] flex-col items-center justify-center text-sm">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <span
            className="text-base tracking-wide text-green-600"
            aria-label={`${product.rating.toFixed(1)} out of 5 stars`}
            title={`${product.rating.toFixed(1)} / 5`}
          >
            {getStarRating(product.rating)}
          </span>
          <AddToBasketButton
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              price: product.price,
            }}
            compact
          />
        </div>
      </div>

      <div className="mb-3 space-y-1">
        <p className="app-muted text-xs uppercase tracking-wide">{product.brand}</p>
        <h2 className="text-lg font-semibold leading-tight">{product.name}</h2>
        <p className="text-sm text-(--app-text)">{product.description}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {product.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="app-chip rounded-full px-2 py-1 text-xs">
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/products/${product.id}`}
        className="app-button-secondary inline-flex rounded-lg px-3 py-2 text-sm font-medium"
      >
        View details
      </Link>
    </li>
  );
}
