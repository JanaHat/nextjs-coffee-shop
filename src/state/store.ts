import { configureStore } from "@reduxjs/toolkit";

import { basketReducer } from "@/src/state/slices/basket-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      basket: basketReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
