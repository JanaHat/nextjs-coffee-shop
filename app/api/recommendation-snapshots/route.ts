import { z } from "zod";

import { apiError, apiSuccess } from "@/src/lib/api-responses";
import { auth } from "@/src/lib/auth";
import type { SavedRecommendationSnapshot } from "@/src/lib/recommendation-snapshots";
import {
  createUserRecommendationSnapshot,
  isRecommendationSnapshotTableAvailable,
  listUserRecommendationSnapshots,
  syncUserRecommendationSnapshots,
} from "@/src/lib/recommendation-snapshots-server";

const snapshotSchema = z.object({
  id: z.string().trim().min(1),
  createdAt: z.string().datetime(),
  items: z.array(z.unknown()),
});

const syncSchema = z.object({
  snapshots: z.array(snapshotSchema).max(50),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return apiError(401, "Unauthorized");
  }

  if (!(await isRecommendationSnapshotTableAvailable())) {
    return apiSuccess({ items: [] });
  }

  const items = await listUserRecommendationSnapshots(session.user.id, 20);

  return apiSuccess({ items });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return apiError(401, "Unauthorized");
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return apiError(400, "Invalid JSON payload");
  }

  const parsed = snapshotSchema.safeParse(rawBody);

  if (!parsed.success) {
    return apiError(400, "Invalid recommendation snapshot payload");
  }

  const result = await createUserRecommendationSnapshot(
    session.user.id,
    parsed.data as SavedRecommendationSnapshot,
  );

  if (result === "unavailable") {
    return apiError(503, "Recommendation snapshots are temporarily unavailable.");
  }

  if (result === "invalid") {
    return apiError(400, "Invalid recommendation snapshot payload");
  }

  const items = await listUserRecommendationSnapshots(session.user.id, 20);

  return apiSuccess({ items }, result === "created" ? 201 : 200);
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return apiError(401, "Unauthorized");
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return apiError(400, "Invalid JSON payload");
  }

  const parsed = syncSchema.safeParse(rawBody);

  if (!parsed.success) {
    return apiError(400, "Invalid recommendation snapshot sync payload");
  }

  if (!(await isRecommendationSnapshotTableAvailable())) {
    return apiSuccess({ items: parsed.data.snapshots });
  }

  const items = await syncUserRecommendationSnapshots(
    session.user.id,
    parsed.data.snapshots as SavedRecommendationSnapshot[],
  );

  return apiSuccess({ items });
}
