import Link from "next/link";

import type { Product } from "@/src/types/product";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <li className="app-surface rounded-2xl p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-zinc-500">{product.brand}</p>
        <h2 className="text-lg font-semibold leading-tight">{product.name}</h2>
        <p className="app-muted text-sm">{product.description}</p>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-semibold">{formatPrice(product.price)}</span>
        <span className="app-muted">Rating {product.rating.toFixed(1)}</span>
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
