import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BasketItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
};

export type BasketProductInput = Omit<BasketItem, "quantity">;

type BasketState = {
  items: BasketItem[];
  hydrated: boolean;
};

const initialState: BasketState = {
  items: [],
  hydrated: false,
};

export const sanitizeBasketItems = (value: unknown): BasketItem[] => {
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

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    hydrateBasket(state, action: PayloadAction<BasketItem[]>) {
      state.items = sanitizeBasketItems(action.payload);
      state.hydrated = true;
    },
    addItem(state, action: PayloadAction<BasketProductInput>) {
      const existing = state.items.find((item) => item.id === action.payload.id);

      if (!existing) {
        state.items.push({ ...action.payload, quantity: 1 });
        return;
      }

      existing.quantity += 1;
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== productId);
        return;
      }

      const existing = state.items.find((item) => item.id === productId);

      if (!existing) {
        return;
      }

      existing.quantity = Math.max(1, Math.floor(quantity));
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearBasket(state) {
      state.items = [];
    },
  },
});

export const { hydrateBasket, addItem, updateQuantity, removeItem, clearBasket } =
  basketSlice.actions;

export const basketReducer = basketSlice.reducer;
