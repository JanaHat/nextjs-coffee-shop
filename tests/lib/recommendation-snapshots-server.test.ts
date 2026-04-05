import { describe, expect, it, vi } from "vitest";

const { queryRawMock, executeRawMock } = vi.hoisted(() => ({
  queryRawMock: vi.fn(),
  executeRawMock: vi.fn(),
}));

vi.mock("@/src/lib/db", () => ({
  db: {
    $queryRaw: queryRawMock,
    $executeRaw: executeRawMock,
  },
}));

import {
  createUserRecommendationSnapshot,
  listUserRecommendationSnapshots,
} from "@/src/lib/recommendation-snapshots-server";

describe("recommendation-snapshots-server", () => {
  it("lists snapshots for a user", async () => {
    queryRawMock.mockResolvedValueOnce([
      {
        clientSnapshotId: "snapshot-1",
        createdAt: new Date("2026-04-05T10:00:00.000Z"),
        items: [],
      },
    ]);

    const items = await listUserRecommendationSnapshots("user-1");

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: "snapshot-1" });
  });

  it("returns invalid for malformed snapshot", async () => {
    const result = await createUserRecommendationSnapshot("user-1", {
      id: "snapshot-1",
      createdAt: "not-date",
      items: [],
    });

    expect(result).toBe("invalid");
  });

  it("returns exists when insert conflicts", async () => {
    executeRawMock.mockResolvedValueOnce(0);

    const result = await createUserRecommendationSnapshot("user-1", {
      id: "snapshot-1",
      createdAt: "2026-04-05T10:00:00.000Z",
      items: [],
    });

    expect(result).toBe("exists");
  });
});
