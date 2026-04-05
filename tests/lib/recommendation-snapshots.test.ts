import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getLatestSavedRecommendationSnapshot,
  listSavedRecommendationSnapshots,
  mergeRecommendationSnapshots,
  RECOMMENDATION_SNAPSHOTS_STORAGE_KEY,
  saveRecommendationSnapshot,
  writeSavedRecommendationSnapshots,
} from "@/src/lib/recommendation-snapshots";
import type { RecommendationItem } from "@/src/types/recommendation";

const baseItem: RecommendationItem = {
  product: {
    id: "coffee-001",
    name: "Test Coffee",
    brand: "Test Roasters",
    price: 10,
    description: "desc",
    detailedDescription: "details",
    tags: ["chocolate"],
    rating: 4.5,
  },
  score: 42,
  reasons: ["Fits your profile"],
};

describe("recommendation snapshot storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns empty list when no snapshots are stored", () => {
    expect(listSavedRecommendationSnapshots()).toEqual([]);
    expect(getLatestSavedRecommendationSnapshot()).toBeNull();
  });

  it("saves a recommendation snapshot and returns latest", () => {
    vi.spyOn(globalThis, "crypto", "get").mockReturnValue({
      randomUUID: () => "snapshot-1",
    } as Crypto);

    const snapshot = saveRecommendationSnapshot([baseItem]);

    expect(snapshot).not.toBeNull();
    expect(snapshot?.id).toBe("snapshot-1");
    expect(listSavedRecommendationSnapshots()).toHaveLength(1);
    expect(getLatestSavedRecommendationSnapshot()?.id).toBe("snapshot-1");
  });

  it("falls back to empty list for invalid JSON", () => {
    window.localStorage.setItem(RECOMMENDATION_SNAPSHOTS_STORAGE_KEY, "not-json");

    expect(listSavedRecommendationSnapshots()).toEqual([]);
  });

  it("merges snapshots by id and keeps newest first", () => {
    const older = {
      id: "snapshot-1",
      createdAt: "2026-04-04T10:00:00.000Z",
      items: [baseItem],
    };
    const newer = {
      id: "snapshot-2",
      createdAt: "2026-04-05T10:00:00.000Z",
      items: [baseItem],
    };

    const merged = mergeRecommendationSnapshots([older], [older, newer]);

    expect(merged.map((item) => item.id)).toEqual(["snapshot-2", "snapshot-1"]);
  });

  it("writes snapshots with deduplication", () => {
    writeSavedRecommendationSnapshots([
      {
        id: "snapshot-1",
        createdAt: "2026-04-04T10:00:00.000Z",
        items: [baseItem],
      },
      {
        id: "snapshot-1",
        createdAt: "2026-04-05T10:00:00.000Z",
        items: [baseItem],
      },
    ]);

    const snapshots = listSavedRecommendationSnapshots();

    expect(snapshots).toHaveLength(1);
    expect(snapshots[0]?.id).toBe("snapshot-1");
  });
});
