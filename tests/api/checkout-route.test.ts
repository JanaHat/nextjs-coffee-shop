import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/lib/auth", () => ({
  auth: vi.fn(async () => null),
}));

vi.mock("@/src/lib/db", () => ({
  db: {
    order: {
      create: vi.fn(),
    },
  },
}));

import { POST } from "@/app/api/checkout/route";

describe("POST /api/checkout", () => {
  it("returns 400 for invalid payload", async () => {
    const request = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [] }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      code: "VALIDATION_ERROR",
    });
  });

  it("returns 402 when forced failure is requested", async () => {
    const request = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "coffee-001", quantity: 1 }],
        customer: {
          fullName: "Jane Doe",
          email: "jane@example.com",
          addressLine1: "1 Main Street",
          city: "London",
          postalCode: "E1 1AA",
          country: "United Kingdom",
        },
        forceResult: "failure",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(402);
    expect(body).toMatchObject({
      ok: false,
      code: "PAYMENT_FAILED",
    });
  });

  it("returns paid order when forced success is requested", async () => {
    const request = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "coffee-001", quantity: 2 }],
        customer: {
          fullName: "Jane Doe",
          email: "jane@example.com",
          addressLine1: "1 Main Street",
          city: "London",
          postalCode: "E1 1AA",
          country: "United Kingdom",
        },
        forceResult: "success",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.order).toHaveProperty("orderId");
    expect(body.order).toHaveProperty("status", "paid");
    expect(body.order.totalItems).toBe(2);
    expect(body.order.totalPrice).toBeGreaterThan(0);
  });
});
