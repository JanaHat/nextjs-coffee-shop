import { describe, expect, it, vi } from "vitest";

const { authMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
}));

const { createMock, isAvailableMock, listMock, syncMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  isAvailableMock: vi.fn(),
  listMock: vi.fn(),
  syncMock: vi.fn(),
}));

vi.mock("@/src/lib/auth", () => ({
  auth: authMock,
}));

vi.mock("@/src/lib/recommendation-snapshots-server", () => ({
  createUserRecommendationSnapshot: createMock,
  isRecommendationSnapshotTableAvailable: isAvailableMock,
  listUserRecommendationSnapshots: listMock,
  syncUserRecommendationSnapshots: syncMock,
}));

import { GET, POST, PUT } from "@/app/api/recommendation-snapshots/route";

describe("/api/recommendation-snapshots", () => {
  it("GET returns 401 when unauthenticated", async () => {
    authMock.mockResolvedValueOnce(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ ok: false, message: "Unauthorized" });
  });

  it("GET returns empty items when table is unavailable", async () => {
    authMock.mockResolvedValueOnce({ user: { id: "user-1" } });
    isAvailableMock.mockResolvedValueOnce(false);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, items: [] });
  });

  it("POST validates payload", async () => {
    authMock.mockResolvedValueOnce({ user: { id: "user-1" } });

    const response = await POST(
      new Request("http://localhost/api/recommendation-snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wrong: true }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, message: "Invalid recommendation snapshot payload" });
  });

  it("POST saves snapshot and returns items", async () => {
    authMock.mockResolvedValueOnce({ user: { id: "user-1" } });
    createMock.mockResolvedValueOnce("created");
    listMock.mockResolvedValueOnce([
      {
        id: "snapshot-1",
        createdAt: "2026-04-05T10:00:00.000Z",
        items: [],
      },
    ]);

    const response = await POST(
      new Request("http://localhost/api/recommendation-snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "snapshot-1",
          createdAt: "2026-04-05T10:00:00.000Z",
          items: [],
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.items).toHaveLength(1);
  });

  it("PUT syncs snapshots", async () => {
    authMock.mockResolvedValueOnce({ user: { id: "user-1" } });
    isAvailableMock.mockResolvedValueOnce(true);
    syncMock.mockResolvedValueOnce([
      {
        id: "snapshot-2",
        createdAt: "2026-04-05T12:00:00.000Z",
        items: [],
      },
    ]);

    const response = await PUT(
      new Request("http://localhost/api/recommendation-snapshots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          snapshots: [
            {
              id: "snapshot-2",
              createdAt: "2026-04-05T12:00:00.000Z",
              items: [],
            },
          ],
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.items).toHaveLength(1);
  });
});
