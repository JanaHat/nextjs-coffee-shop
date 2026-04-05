"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { saveRecommendationSnapshot } from "@/src/lib/recommendation-snapshots";
import type { RecommendationItem } from "@/src/types/recommendation";

type RecommendationResultsProps = {
  items: RecommendationItem[];
  onSaved?: () => void;
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

const saveRecommendations = (items: RecommendationItem[]) => {
  saveRecommendationSnapshot(items);
};

export function RecommendationResults({ items, onSaved }: RecommendationResultsProps) {
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  const handleSave = () => {
    try {
      saveRecommendations(items);
      setSaveState("saved");
      onSaved?.();
    } catch {
      setSaveState("error");
    }
  };

  if (items.length === 0) {
    return (
      <section className="app-surface rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Top matches</h2>
        <p className="app-muted mt-2 text-sm">
          We could not find a strong match. Try broadening your preferences.
        </p>
      </section>
    );
  }

  return (
    <section className="app-surface rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Top 5 matches for you</h2>
        <button
          type="button"
          onClick={handleSave}
          className="app-button-secondary inline-flex rounded-lg px-3 py-2 text-sm font-medium"
        >
          Save recommendations
        </button>
      </div>

      {saveState === "saved" ? <p className="mt-2 text-sm text-green-700">Saved to this browser.</p> : null}
      {saveState === "error" ? (
        <p className="mt-2 text-sm text-red-600">Could not save recommendations. Please try again.</p>
      ) : null}

      <ul className="mt-4 space-y-4">
        {items.map((item, index) => (
          <li key={item.product.id} className="rounded-xl border border-(--app-border) p-4">
            <div className="flex items-start gap-4">
              <Link
                href={`/products/${item.product.id}`}
                className="app-surface h-20 w-20 shrink-0 overflow-hidden rounded-lg"
                aria-label={`View details for ${item.product.name}`}
              >
                <Image
                  src={item.product.imageUrl ?? `/${item.product.id}.webp`}
                  alt={`${item.product.name} by ${item.product.brand}`}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-wrap items-start justify-between gap-3">
                <p className="app-muted text-xs uppercase tracking-wide">#{index + 1} match</p>
                <div className="min-w-0">
                  <p className="text-base font-semibold">{item.product.name}</p>
                  <p className="app-muted text-sm">{item.product.brand}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(item.product.price)}</p>
                  <p className="app-muted text-xs">Score {item.score.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {item.reasons.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-(--app-text)">
                {item.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : null}

            <div className="mt-4">
              <Link
                href={`/products/${item.product.id}`}
                className="app-button-secondary inline-flex rounded-lg px-3 py-2 text-sm font-medium"
              >
                View product
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
