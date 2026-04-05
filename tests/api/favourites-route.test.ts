import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    auth: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    getProductById: vi.fn(),
  };
});

vi.mock("@/src/lib/auth", () => ({
  auth: mocks.auth,
}));

vi.mock("@/src/lib/db", () => ({
  db: {
    favourite: {
      findMany: mocks.findMany,
      create: mocks.create,
    },
  },
}));

vi.mock("@/src/lib/products", () => ({
  getProductById: mocks.getProductById,
}));

import { GET, POST } from "@/app/api/favourites/route";

describe("/api/favourites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.getProductById.mockReturnValue({ id: "coffee-001" });
  });

  it("returns 401 for unauthenticated GET", async () => {
    mocks.auth.mockResolvedValueOnce(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ message: "Unauthorized" });
  });

  it("returns favourite product ids for authenticated GET", async () => {
    mocks.findMany.mockResolvedValueOnce([
      { productId: "coffee-001" },
      { productId: "coffee-002" },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ items: ["coffee-001", "coffee-002"] });
    expect(mocks.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      select: { productId: true },
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns 401 for unauthenticated POST", async () => {
    mocks.auth.mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "coffee-001" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ message: "Unauthorized" });
  });

  it("returns 400 for invalid JSON payload", async () => {
    const request = new Request("http://localhost:3000/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ message: "Invalid JSON payload" });
  });

  it("returns 400 for invalid payload", async () => {
    const request = new Request("http://localhost:3000/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ message: "Invalid favourite payload" });
  });

  it("returns 404 when product does not exist", async () => {
    mocks.getProductById.mockReturnValueOnce(undefined);

    const request = new Request("http://localhost:3000/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "coffee-missing" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ message: "Product not found" });
  });

  it("returns 201 when favourite is created", async () => {
    mocks.create.mockResolvedValueOnce({ id: "fav-1" });

    const request = new Request("http://localhost:3000/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "coffee-001" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      ok: true,
      favourited: true,
      productId: "coffee-001",
    });
  });

  it("returns 200 when favourite already exists", async () => {
    mocks.create.mockRejectedValueOnce({ code: "P2002" });

    const request = new Request("http://localhost:3000/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "coffee-001" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      favourited: true,
      productId: "coffee-001",
    });
  });
});
