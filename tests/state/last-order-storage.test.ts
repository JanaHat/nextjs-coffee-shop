import {
  readLastOrderFromStorage,
  writeLastOrderToStorage,
} from "@/src/state/persistence/last-order-storage";
import type { LastOrder } from "@/src/types/order";
import { beforeEach, describe, expect, it } from "vitest";

const orderFixture: LastOrder = {
  orderId: "MOCK-123",
  createdAt: new Date().toISOString(),
  status: "paid",
  customer: {
    fullName: "Jane Doe",
    email: "jane@example.com",
    addressLine1: "1 Main Street",
    city: "London",
    postalCode: "E1 1AA",
    country: "United Kingdom",
  },
  items: [
    {
      id: "coffee-001",
      name: "Coffee",
      brand: "Brand",
      imageUrl: "/coffee-001.webp",
      price: 10,
      quantity: 2,
      lineTotal: 20,
    },
  ],
  totalItems: 2,
  totalPrice: 20,
};

describe("last order storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when missing", () => {
    expect(readLastOrderFromStorage()).toBeNull();
  });

  it("writes and reads last order", () => {
    writeLastOrderToStorage(orderFixture);
    const saved = readLastOrderFromStorage();

    expect(saved?.orderId).toBe("MOCK-123");
    expect(saved?.totalPrice).toBe(20);
  });

  it("clears key when writing null", () => {
    writeLastOrderToStorage(orderFixture);
    writeLastOrderToStorage(null);

    expect(readLastOrderFromStorage()).toBeNull();
  });
});
