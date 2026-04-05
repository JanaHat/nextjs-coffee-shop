"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  listSavedRecommendationSnapshots,
  type SavedRecommendationSnapshot,
} from "@/src/lib/recommendation-snapshots";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export function SavedRecommendationsSection() {
  const [snapshots, setSnapshots] = useState<SavedRecommendationSnapshot[]>([]);

  useEffect(() => {
    setSnapshots(listSavedRecommendationSnapshots());
  }, []);

  return (
    <section className="app-surface rounded-2xl p-6">
      <h2 className="text-lg font-semibold">Saved recommendations</h2>
      {snapshots.length === 0 ? (
        <p className="app-muted mt-1 text-sm">
          Nothing saved yet. Take the <Link href="/recommendations" className="underline">AI quiz</Link> and save your top matches.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {snapshots.slice(0, 3).map((snapshot) => (
            <li key={snapshot.id} className="rounded-xl border border-(--app-border) p-4">
              <p className="app-muted text-xs">Saved {new Date(snapshot.createdAt).toLocaleString()}</p>
              <ul className="mt-3 space-y-2">
                {snapshot.items.slice(0, 5).map((item) => (
                  <li key={`${snapshot.id}-${item.product.id}`} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${item.product.id}`} className="text-sm font-medium hover:underline">
                        {item.product.name}
                      </Link>
                      <p className="app-muted text-xs">{item.product.brand}</p>
                    </div>

                    <span className="app-muted text-xs">
                      {formatPrice(item.product.price)} · {item.score.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
