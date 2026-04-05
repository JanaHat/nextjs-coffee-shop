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

const sortByCreatedAtDesc = (items: SavedRecommendationSnapshot[]) => {
  return [...items].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

const deduplicateSnapshots = (items: SavedRecommendationSnapshot[]) => {
  const map = new Map<string, SavedRecommendationSnapshot>();

  for (const item of sortByCreatedAtDesc(items)) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  return [...map.values()];
};

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

export const writeSavedRecommendationSnapshots = (snapshots: SavedRecommendationSnapshot[]) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    RECOMMENDATION_SNAPSHOTS_STORAGE_KEY,
    JSON.stringify(sortByCreatedAtDesc(deduplicateSnapshots(snapshots))),
  );
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
    return null;
  }

  const existing = listSavedRecommendationSnapshots();
  const snapshot = createSnapshot(items);

  writeSavedRecommendationSnapshots([snapshot, ...existing]);

  return snapshot;
};

export const mergeRecommendationSnapshots = (
  localSnapshots: SavedRecommendationSnapshot[],
  remoteSnapshots: SavedRecommendationSnapshot[],
) => {
  return sortByCreatedAtDesc(deduplicateSnapshots([...localSnapshots, ...remoteSnapshots]));
};

const parseSnapshotsFromApiBody = (body: unknown) => {
  if (typeof body !== "object" || body === null || !("items" in body)) {
    return [] as SavedRecommendationSnapshot[];
  }

  return parseSnapshots(JSON.stringify((body as { items: unknown }).items));
};

export const syncSavedRecommendationSnapshotsWithAccount = async () => {
  if (typeof window === "undefined") {
    return [] as SavedRecommendationSnapshot[];
  }

  const localSnapshots = listSavedRecommendationSnapshots();

  try {
    const response = await fetch("/api/recommendation-snapshots", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ snapshots: localSnapshots }),
    });

    if (!response.ok) {
      return localSnapshots;
    }

    const body = (await response.json()) as unknown;
    const syncedSnapshots = parseSnapshotsFromApiBody(body);
    const merged = mergeRecommendationSnapshots(localSnapshots, syncedSnapshots);

    writeSavedRecommendationSnapshots(merged);

    return merged;
  } catch {
    return localSnapshots;
  }
};

export const saveRecommendationSnapshotToAccount = async (
  snapshot: SavedRecommendationSnapshot,
) => {
  if (typeof window === "undefined") {
    return [] as SavedRecommendationSnapshot[];
  }

  try {
    const response = await fetch("/api/recommendation-snapshots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snapshot),
    });

    if (!response.ok) {
      return listSavedRecommendationSnapshots();
    }

    const body = (await response.json()) as unknown;
    const remoteSnapshots = parseSnapshotsFromApiBody(body);
    const merged = mergeRecommendationSnapshots(listSavedRecommendationSnapshots(), remoteSnapshots);

    writeSavedRecommendationSnapshots(merged);

    return merged;
  } catch {
    return listSavedRecommendationSnapshots();
  }
};
