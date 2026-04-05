import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    auth: vi.fn(),
    deleteMany: vi.fn(),
    getProductById: vi.fn(),
  };
});

vi.mock("@/src/lib/auth", () => ({
  auth: mocks.auth,
}));

vi.mock("@/src/lib/db", () => ({
  db: {
    favourite: {
      deleteMany: mocks.deleteMany,
    },
  },
}));

vi.mock("@/src/lib/products", () => ({
  getProductById: mocks.getProductById,
}));

import { DELETE } from "@/app/api/favourites/[productId]/route";

describe("DELETE /api/favourites/[productId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.getProductById.mockReturnValue({ id: "coffee-001" });
    mocks.deleteMany.mockResolvedValue({ count: 1 });
  });

  it("returns 401 for unauthenticated user", async () => {
    mocks.auth.mockResolvedValueOnce(null);

    const response = await DELETE(new Request("http://localhost:3000"), {
      params: Promise.resolve({ productId: "coffee-001" }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ message: "Unauthorized" });
  });

  it("returns 404 for unknown product id", async () => {
    mocks.getProductById.mockReturnValueOnce(undefined);

    const response = await DELETE(new Request("http://localhost:3000"), {
      params: Promise.resolve({ productId: "missing" }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ message: "Product not found" });
  });

  it("returns 200 and unfavourited state for valid delete", async () => {
    const response = await DELETE(new Request("http://localhost:3000"), {
      params: Promise.resolve({ productId: "coffee-001" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      favourited: false,
      productId: "coffee-001",
    });
    expect(mocks.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        productId: "coffee-001",
      },
    });
  });
});
