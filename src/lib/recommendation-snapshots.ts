import type { RecommendationItem } from "@/src/types/recommendation";

export const RECOMMENDATION_SNAPSHOTS_STORAGE_KEY = "coffee-recommendation-snapshots";

export type SavedRecommendationSnapshot = {
  id: string;
  createdAt: string;
  items: RecommendationItem[];
};

const createSnapshot = (items: RecommendationItem[]): SavedRecommendationSnapshot => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
  createdAt: new Date().toISOString(),
  items,
});

const parseSnapshots = (raw: string | null) => {
  if (!raw) {
    return [] as SavedRecommendationSnapshot[];
  }

  try {
    const parsed = JSON.parse(raw) as SavedRecommendationSnapshot[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => {
      return (
        Boolean(item) &&
        typeof item.id === "string" &&
        typeof item.createdAt === "string" &&
        Array.isArray(item.items)
      );
    });
  } catch {
    return [];
  }
};

export const listSavedRecommendationSnapshots = () => {
  if (typeof window === "undefined") {
    return [] as SavedRecommendationSnapshot[];
  }

  const raw = localStorage.getItem(RECOMMENDATION_SNAPSHOTS_STORAGE_KEY);
  return parseSnapshots(raw);
};

export const getLatestSavedRecommendationSnapshot = () => {
  const snapshots = listSavedRecommendationSnapshots();
  return snapshots[0] ?? null;
};

export const saveRecommendationSnapshot = (items: RecommendationItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const existing = listSavedRecommendationSnapshots();
  const snapshot = createSnapshot(items);

  localStorage.setItem(
    RECOMMENDATION_SNAPSHOTS_STORAGE_KEY,
    JSON.stringify([snapshot, ...existing]),
  );
};
