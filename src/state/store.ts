import { configureStore } from "@reduxjs/toolkit";

import { basketReducer } from "@/src/state/slices/basket-slice";
import { checkoutReducer } from "@/src/state/slices/checkout-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      basket: basketReducer,
      checkout: checkoutReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
