import { sanitizeLastOrder } from "@/src/state/slices/checkout-slice";
import type { LastOrder } from "@/src/types/order";

const STORAGE_KEY = "coffee-catalogue-last-order";

export const readLastOrderFromStorage = (): LastOrder | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return sanitizeLastOrder(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
};

export const writeLastOrderToStorage = (lastOrder: LastOrder | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!lastOrder) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lastOrder));
};
