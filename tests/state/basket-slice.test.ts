import {
  addItem,
  basketReducer,
  clearBasket,
  hydrateBasket,
  removeItem,
  sanitizeBasketItems,
  updateQuantity,
} from "@/src/state/slices/basket-slice";
import { describe, expect, it } from "vitest";

describe("basket slice", () => {
  it("hydrates and sanitizes basket items", () => {
    const state = basketReducer(
      undefined,
      hydrateBasket([
        {
          id: "coffee-001",
          name: "Coffee 1",
          brand: "Brand",
          price: 10,
          quantity: 2.9,
        },
        {
          id: "coffee-002",
          name: "Coffee 2",
          brand: "Brand",
          price: Number.NaN,
          quantity: 1,
        },
      ]),
    );

    expect(state.hydrated).toBe(true);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(2);
  });

  it("adds a new item and increments existing quantity", () => {
    const first = basketReducer(
      undefined,
      addItem({ id: "coffee-001", name: "Coffee 1", brand: "Brand", price: 10 }),
    );

    const second = basketReducer(
      first,
      addItem({ id: "coffee-001", name: "Coffee 1", brand: "Brand", price: 10 }),
    );

    expect(first.items[0]?.quantity).toBe(1);
    expect(second.items[0]?.quantity).toBe(2);
  });

  it("updates quantity and removes item when quantity <= 0", () => {
    const stateWithItem = basketReducer(
      undefined,
      addItem({ id: "coffee-001", name: "Coffee 1", brand: "Brand", price: 10 }),
    );

    const updated = basketReducer(
      stateWithItem,
      updateQuantity({ productId: "coffee-001", quantity: 5.2 }),
    );
    expect(updated.items[0]?.quantity).toBe(5);

    const removed = basketReducer(
      updated,
      updateQuantity({ productId: "coffee-001", quantity: 0 }),
    );
    expect(removed.items).toHaveLength(0);
  });

  it("removes item and clears basket", () => {
    const withItems = basketReducer(
      basketReducer(
        undefined,
        addItem({ id: "coffee-001", name: "Coffee 1", brand: "Brand", price: 10 }),
      ),
      addItem({ id: "coffee-002", name: "Coffee 2", brand: "Brand", price: 12 }),
    );

    const afterRemove = basketReducer(withItems, removeItem("coffee-001"));
    expect(afterRemove.items).toHaveLength(1);
    expect(afterRemove.items[0]?.id).toBe("coffee-002");

    const afterClear = basketReducer(afterRemove, clearBasket());
    expect(afterClear.items).toHaveLength(0);
  });

  it("sanitizeBasketItems rejects malformed entries", () => {
    const result = sanitizeBasketItems([
      null,
      { id: "x", name: "x", brand: "x", price: 1, quantity: 1 },
      { id: "bad", name: "bad", brand: "bad", price: "10", quantity: 1 },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("x");
  });
});
