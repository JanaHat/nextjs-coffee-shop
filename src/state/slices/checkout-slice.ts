import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { LastOrder } from "@/src/types/order";

type CheckoutState = {
  lastOrder: LastOrder | null;
  hydrated: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
};

const initialState: CheckoutState = {
  lastOrder: null,
  hydrated: false,
  isSubmitting: false,
  errorMessage: null,
};

export const sanitizeLastOrder = (value: unknown): LastOrder | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const order = value as Partial<LastOrder>;

  if (
    typeof order.orderId !== "string" ||
    typeof order.createdAt !== "string" ||
    order.status !== "paid" ||
    typeof order.totalItems !== "number" ||
    typeof order.totalPrice !== "number" ||
    !Array.isArray(order.items) ||
    typeof order.customer !== "object" ||
    order.customer === null
  ) {
    return null;
  }

  const customer = order.customer as Record<string, unknown>;

  if (
    typeof customer.fullName !== "string" ||
    typeof customer.email !== "string" ||
    typeof customer.addressLine1 !== "string" ||
    typeof customer.city !== "string" ||
    typeof customer.postalCode !== "string" ||
    typeof customer.country !== "string"
  ) {
    return null;
  }

  return order as LastOrder;
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    hydrateLastOrder(state, action: PayloadAction<LastOrder | null>) {
      state.lastOrder = sanitizeLastOrder(action.payload);
      state.hydrated = true;
    },
    startCheckout(state) {
      state.isSubmitting = true;
      state.errorMessage = null;
    },
    checkoutSucceeded(state, action: PayloadAction<LastOrder>) {
      state.isSubmitting = false;
      state.errorMessage = null;
      state.lastOrder = action.payload;
    },
    checkoutFailed(state, action: PayloadAction<string>) {
      state.isSubmitting = false;
      state.errorMessage = action.payload;
    },
    clearCheckoutError(state) {
      state.errorMessage = null;
    },
    clearLastOrder(state) {
      state.lastOrder = null;
    },
  },
});

export const {
  hydrateLastOrder,
  startCheckout,
  checkoutSucceeded,
  checkoutFailed,
  clearCheckoutError,
  clearLastOrder,
} = checkoutSlice.actions;

export const checkoutReducer = checkoutSlice.reducer;
