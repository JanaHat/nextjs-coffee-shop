"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BasketItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
};

type BasketProductInput = Omit<BasketItem, "quantity">;

type BasketContextValue = {
  items: BasketItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: BasketProductInput) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
};

const STORAGE_KEY = "coffee-catalogue-basket";

const BasketContext = createContext<BasketContextValue | undefined>(undefined);

const sanitizeItems = (value: unknown): BasketItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is BasketItem => {
      if (typeof item !== "object" || item === null) {
        return false;
      }

      const candidate = item as Partial<BasketItem>;

      return (
        typeof candidate.id === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.brand === "string" &&
        typeof candidate.price === "number" &&
        typeof candidate.quantity === "number" &&
        Number.isFinite(candidate.price) &&
        Number.isFinite(candidate.quantity)
      );
    })
    .map((item) => ({
      ...item,
      quantity: Math.max(1, Math.floor(item.quantity)),
    }));
};

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as unknown;
      return sanitizeItems(parsed);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: BasketProductInput) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (!existing) {
        return [...current, { ...product, quantity: 1 }];
      }

      return current.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.id !== productId);
      }

      return current.map((item) =>
        item.id === productId ? { ...item, quantity: Math.floor(quantity) } : item,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  }, []);

  const clearBasket = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      addItem,
      updateQuantity,
      removeItem,
      clearBasket,
    }),
    [items, totalItems, totalPrice, addItem, updateQuantity, removeItem, clearBasket],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export const useBasket = () => {
  const context = useContext(BasketContext);

  if (!context) {
    throw new Error("useBasket must be used within BasketProvider");
  }

  return context;
};
