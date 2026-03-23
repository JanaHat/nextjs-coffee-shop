import type { RootState } from "@/src/state/store";

export const selectBasketItems = (state: RootState) => state.basket.items;

export const selectBasketHydrated = (state: RootState) => state.basket.hydrated;

export const selectBasketTotalItems = (state: RootState) => {
  return state.basket.items.reduce((sum, item) => sum + item.quantity, 0);
};

export const selectBasketTotalPrice = (state: RootState) => {
  return state.basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const selectBasketQuantityById = (state: RootState, productId: string) => {
  return state.basket.items.find((item) => item.id === productId)?.quantity ?? 0;
};
