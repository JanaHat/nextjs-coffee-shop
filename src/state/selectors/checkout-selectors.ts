import type { RootState } from "@/src/state/store";

export const selectCheckoutHydrated = (state: RootState) => state.checkout.hydrated;

export const selectLastOrder = (state: RootState) => state.checkout.lastOrder;

export const selectCheckoutSubmitting = (state: RootState) => state.checkout.isSubmitting;

export const selectCheckoutErrorMessage = (state: RootState) => state.checkout.errorMessage;
