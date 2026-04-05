import { describe, expect, it, vi } from "vitest";

const { authMock, findManyMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findManyMock: vi.fn(),
}));

vi.mock("@/src/lib/auth", () => ({
  auth: authMock,
}));

vi.mock("@/src/lib/db", () => ({
  db: {
    order: {
      findMany: findManyMock,
    },
  },
}));

import { GET } from "@/app/api/orders/route";

describe("GET /api/orders", () => {
  it("returns 401 when user is not authenticated", async () => {
    authMock.mockResolvedValueOnce(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ ok: false, message: "Unauthorized" });
  });

  it("returns paid orders for current user", async () => {
    authMock.mockResolvedValueOnce({ user: { id: "user-1" } });
    findManyMock.mockResolvedValueOnce([
      {
        id: "order-1",
        items: [{ id: "item-1", quantity: 1, productId: "coffee-001", productName: "House", unitPriceCents: 1200 }],
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items).toHaveLength(1);
    expect(findManyMock).toHaveBeenCalledTimes(1);
  });
});
