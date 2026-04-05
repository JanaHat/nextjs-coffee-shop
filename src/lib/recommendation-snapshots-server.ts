import { Prisma } from "@prisma/client";

import { db } from "@/src/lib/db";
import type { SavedRecommendationSnapshot } from "@/src/lib/recommendation-snapshots";

let snapshotTableAvailableCache = false;

const SNAPSHOT_TABLE_SCHEMA = "public";
const SNAPSHOT_TABLE_NAME = "RecommendationSnapshot";

const isPrismaCode = (error: unknown, code: string) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === code;
  }

  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && (error as { code?: string }).code === code;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isSavedSnapshot = (value: unknown): value is SavedRecommendationSnapshot => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string"
    && typeof value.createdAt === "string"
    && Array.isArray(value.items)
  );
};

export const isRecommendationSnapshotTableAvailable = async () => {
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  if (snapshotTableAvailableCache) {
    return true;
  }

  try {
    const result = await db.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = ${SNAPSHOT_TABLE_SCHEMA}
          AND table_name = ${SNAPSHOT_TABLE_NAME}
      ) AS exists
    `;

    snapshotTableAvailableCache = Boolean(result[0]?.exists);
  } catch {
    return false;
  }

  return snapshotTableAvailableCache;
};

export const listUserRecommendationSnapshots = async (userId: string, limit = 20) => {
  if (!(await isRecommendationSnapshotTableAvailable())) {
    return [] as SavedRecommendationSnapshot[];
  }

  try {
    const snapshots = await db.$queryRaw<Array<{
      clientSnapshotId: string;
      createdAt: Date;
      items: Prisma.JsonValue;
    }>>`
      SELECT "clientSnapshotId", "createdAt", "items"
      FROM "RecommendationSnapshot"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
    `;

    return snapshots
      .map((snapshot) => {
        const rawItems = snapshot.items;

        if (!Array.isArray(rawItems)) {
          return null;
        }

        return {
          id: snapshot.clientSnapshotId,
          createdAt: snapshot.createdAt.toISOString(),
          items: rawItems,
        } as SavedRecommendationSnapshot;
      })
      .filter((snapshot): snapshot is SavedRecommendationSnapshot => Boolean(snapshot));
  } catch (error) {
    if (isPrismaCode(error, "P2021")) {
      return [];
    }

    throw error;
  }
};

export const createUserRecommendationSnapshot = async (
  userId: string,
  snapshot: SavedRecommendationSnapshot,
) => {
  if (!(await isRecommendationSnapshotTableAvailable())) {
    return "unavailable" as const;
  }

  if (!isSavedSnapshot(snapshot)) {
    return "invalid" as const;
  }

  const createdAt = new Date(snapshot.createdAt);

  if (Number.isNaN(createdAt.getTime())) {
    return "invalid" as const;
  }

  try {
    const insertedRows = await db.$executeRaw`
      INSERT INTO "RecommendationSnapshot" (
        "id",
        "userId",
        "clientSnapshotId",
        "createdAt",
        "items"
      )
      VALUES (
        ${crypto.randomUUID?.() ?? `${Date.now()}-${snapshot.id}`},
        ${userId},
        ${snapshot.id},
        ${createdAt},
        ${snapshot.items as Prisma.JsonValue}
      )
      ON CONFLICT ("userId", "clientSnapshotId") DO NOTHING
    `;

    if (insertedRows === 0) {
      return "exists" as const;
    }

    return "created" as const;
  } catch (error) {
    if (isPrismaCode(error, "P2021")) {
      return "unavailable" as const;
    }

    if (isPrismaCode(error, "P2002")) {
      return "exists" as const;
    }

    throw error;
  }
};

export const syncUserRecommendationSnapshots = async (
  userId: string,
  snapshots: SavedRecommendationSnapshot[],
) => {
  const sorted = [...snapshots].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  for (const snapshot of sorted) {
    await createUserRecommendationSnapshot(userId, snapshot);
  }

  return listUserRecommendationSnapshots(userId);
};
