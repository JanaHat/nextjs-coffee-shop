import {
  readBasketItemsFromStorage,
  writeBasketItemsToStorage,
} from "@/src/state/persistence/basket-storage";
import { beforeEach, describe, expect, it } from "vitest";

describe("basket storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns empty array when localStorage key is missing", () => {
    const items = readBasketItemsFromStorage();
    expect(items).toEqual([]);
  });

  it("writes then reads sanitized items", () => {
    writeBasketItemsToStorage([
      {
        id: "coffee-001",
        name: "Coffee",
        brand: "Brand",
        price: 11,
        quantity: 2,
      },
    ]);

    const items = readBasketItemsFromStorage();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: "coffee-001", quantity: 2 });
  });

  it("handles malformed stored JSON safely", () => {
    window.localStorage.setItem("coffee-catalogue-basket", "not-json");

    const items = readBasketItemsFromStorage();
    expect(items).toEqual([]);
  });
});
