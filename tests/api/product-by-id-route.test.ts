import { GET } from "@/app/api/products/[id]/route";
import { describe, expect, it } from "vitest";

describe("GET /api/products/[id]", () => {
  it("returns 200 and a product when id exists", async () => {
    const response = await GET(new Request("http://localhost:3000/api/products/coffee-001"), {
      params: Promise.resolve({ id: "coffee-001" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      id: "coffee-001",
      name: expect.any(String),
      brand: expect.any(String),
    });
  });

  it("returns 404 when product is missing", async () => {
    const response = await GET(new Request("http://localhost:3000/api/products/missing"), {
      params: Promise.resolve({ id: "coffee-999" }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ message: "Product not found" });
  });
});
