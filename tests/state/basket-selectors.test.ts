import {
  selectBasketHydrated,
  selectBasketItems,
  selectBasketQuantityById,
  selectBasketTotalItems,
  selectBasketTotalPrice,
} from "@/src/state/selectors/basket-selectors";
import type { RootState } from "@/src/state/store";
import { describe, expect, it } from "vitest";

const state = {
  basket: {
    hydrated: true,
    items: [
      { id: "coffee-001", name: "A", brand: "B", price: 10, quantity: 2 },
      { id: "coffee-002", name: "C", brand: "D", price: 5.5, quantity: 3 },
    ],
  },
} as RootState;

describe("basket selectors", () => {
  it("returns base basket values", () => {
    expect(selectBasketHydrated(state)).toBe(true);
    expect(selectBasketItems(state)).toHaveLength(2);
  });

  it("computes totals", () => {
    expect(selectBasketTotalItems(state)).toBe(5);
    expect(selectBasketTotalPrice(state)).toBe(36.5);
  });

  it("returns quantity by id", () => {
    expect(selectBasketQuantityById(state, "coffee-001")).toBe(2);
    expect(selectBasketQuantityById(state, "missing")).toBe(0);
  });
});
