import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/recommendations/route";

describe("POST /api/recommendations", () => {
  it("returns 400 for invalid JSON payload", async () => {
    const request = new Request("http://localhost:3000/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, message: "Invalid JSON payload" });
  });

  it("returns 400 for invalid recommendation answers", async () => {
    const request = new Request("http://localhost:3000/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferredFlavours: [],
        intensity: 8,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      message: "Invalid recommendation answers",
    });
    expect(Array.isArray(body.errors)).toBe(true);
  });

  it("returns top five recommendations for valid answers", async () => {
    const request = new Request("http://localhost:3000/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferredFlavours: ["chocolate", "nutty"],
        avoidFlavours: ["floral"],
        brewMethod: "espresso",
        roastPreference: "medium",
        acidityPreference: "balanced",
        budgetPreference: "mid",
        intensity: 4,
        decafOnly: false,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items).toHaveLength(5);
    expect(body.items[0]).toHaveProperty("product");
    expect(body.items[0]).toHaveProperty("score");
    expect(body.items[0]).toHaveProperty("reasons");
  });
});
