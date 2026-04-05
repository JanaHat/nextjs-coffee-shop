import { describe, expect, it, vi } from "vitest";

const { authMock, findFirstMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findFirstMock: vi.fn(),
}));

vi.mock("@/src/lib/auth", () => ({
  auth: authMock,
}));

vi.mock("@/src/lib/db", () => ({
  db: {
    order: {
      findFirst: findFirstMock,
    },
  },
}));

import { GET } from "@/app/api/orders/[id]/route";

describe("GET /api/orders/[id]", () => {
  it("returns 401 when user is not authenticated", async () => {
    authMock.mockResolvedValueOnce(null);

    const response = await GET(new Request("http://localhost/api/orders/order-1"), {
      params: Promise.resolve({ id: "order-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ ok: false, message: "Unauthorized" });
  });

  it("returns 404 when order does not exist for user", async () => {
    authMock.mockResolvedValueOnce({ user: { id: "user-1" } });
    findFirstMock.mockResolvedValueOnce(null);

    const response = await GET(new Request("http://localhost/api/orders/order-1"), {
      params: Promise.resolve({ id: "order-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ ok: false, message: "Order not found" });
  });

  it("returns the order when found", async () => {
    authMock.mockResolvedValueOnce({ user: { id: "user-1" } });
    findFirstMock.mockResolvedValueOnce({
      id: "order-1",
      status: "PAID",
      items: [],
    });

    const response = await GET(new Request("http://localhost/api/orders/order-1"), {
      params: Promise.resolve({ id: "order-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.order).toMatchObject({ id: "order-1" });
  });
});
