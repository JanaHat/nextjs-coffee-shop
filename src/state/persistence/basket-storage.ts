import { sanitizeBasketItems, type BasketItem } from "@/src/state/slices/basket-slice";

const STORAGE_KEY = "coffee-catalogue-basket";

export const readBasketItemsFromStorage = (): BasketItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return sanitizeBasketItems(parsed);
  } catch {
    return [];
  }
};

export const writeBasketItemsToStorage = (items: BasketItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};
