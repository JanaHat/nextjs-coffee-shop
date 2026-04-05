"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import {
  listSavedRecommendationSnapshots,
  syncSavedRecommendationSnapshotsWithAccount,
  type SavedRecommendationSnapshot,
} from "@/src/lib/recommendation-snapshots";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export function SavedRecommendationsSection() {
  const { status } = useSession();
  const [snapshots, setSnapshots] = useState<SavedRecommendationSnapshot[]>([]);
  const latestSnapshot = snapshots[0] ?? null;

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    const loadSnapshots = async () => {
      if (status === "authenticated") {
        const synced = await syncSavedRecommendationSnapshotsWithAccount();
        setSnapshots(synced);
        return;
      }

      setSnapshots(listSavedRecommendationSnapshots());
    };

    void loadSnapshots();
  }, [status]);

  return (
    <section className="app-surface rounded-2xl p-6">
      <h2 className="text-lg font-semibold">Saved recommendations</h2>
      {!latestSnapshot ? (
        <p className="app-muted mt-1 text-sm">
          Nothing saved yet. Try <Link href="/recommendations" className="underline">Coffee Matcher</Link> and save your top matches.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          <li key={latestSnapshot.id} className="rounded-xl border border-(--app-border) p-4">
            <p className="app-muted text-xs">Saved {new Date(latestSnapshot.createdAt).toLocaleString()}</p>
            <ul className="mt-3 space-y-2">
              {latestSnapshot.items.slice(0, 5).map((item) => (
                <li key={`${latestSnapshot.id}-${item.product.id}`} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="app-surface h-14 w-14 shrink-0 overflow-hidden rounded-lg"
                      aria-label={`View details for ${item.product.name}`}
                    >
                      <Image
                        src={item.product.imageUrl ?? `/${item.product.id}.webp`}
                        alt={`${item.product.name} by ${item.product.brand}`}
                        width={112}
                        height={112}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0">
                      <Link href={`/products/${item.product.id}`} className="text-sm font-medium hover:underline">
                        {item.product.name}
                      </Link>
                      <p className="app-muted text-xs">{item.product.brand}</p>
                    </div>
                  </div>

                  <span className="app-muted text-xs">
                    {formatPrice(item.product.price)} · {item.score.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      )}
    </section>
  );
}
