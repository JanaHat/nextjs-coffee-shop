import { GET } from "@/app/api/products/route";
import { describe, expect, it } from "vitest";

describe("GET /api/products", () => {
  it("returns 400 for invalid query parameters", async () => {
    const request = new Request("http://localhost:3000/api/products?sort=invalid");

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      message: "Invalid query parameters",
    });
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.errors[0]).toHaveProperty("param", "sort");
  });

  it("returns paginated data for a valid query", async () => {
    const request = new Request(
      "http://localhost:3000/api/products?q=ethiopia&sort=price_asc&page=1&pageSize=5",
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveProperty("items");
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("page", 1);
    expect(body).toHaveProperty("pageSize", 5);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeLessThanOrEqual(5);
  });
});
