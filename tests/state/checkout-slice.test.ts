import {
  checkoutFailed,
  checkoutReducer,
  checkoutSucceeded,
  hydrateLastOrder,
  startCheckout,
} from "@/src/state/slices/checkout-slice";
import type { LastOrder } from "@/src/types/order";
import { describe, expect, it } from "vitest";

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

describe("checkout slice", () => {
  it("hydrates last order", () => {
    const state = checkoutReducer(undefined, hydrateLastOrder(orderFixture));

    expect(state.hydrated).toBe(true);
    expect(state.lastOrder?.orderId).toBe("MOCK-123");
  });

  it("tracks submit lifecycle", () => {
    const started = checkoutReducer(undefined, startCheckout());
    expect(started.isSubmitting).toBe(true);

    const failed = checkoutReducer(started, checkoutFailed("Payment failed"));
    expect(failed.isSubmitting).toBe(false);
    expect(failed.errorMessage).toBe("Payment failed");

    const succeeded = checkoutReducer(failed, checkoutSucceeded(orderFixture));
    expect(succeeded.isSubmitting).toBe(false);
    expect(succeeded.errorMessage).toBeNull();
    expect(succeeded.lastOrder?.orderId).toBe("MOCK-123");
  });
});
