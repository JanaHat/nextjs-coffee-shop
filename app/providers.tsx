"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { selectBasketItems } from "@/src/state/selectors/basket-selectors";
import {
  readBasketItemsFromStorage,
  writeBasketItemsToStorage,
} from "@/src/state/persistence/basket-storage";
import { hydrateBasket } from "@/src/state/slices/basket-slice";
import { makeStore } from "@/src/state/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(hydrateBasket(readBasketItemsFromStorage()));

    const unsubscribe = store.subscribe(() => {
      writeBasketItemsToStorage(selectBasketItems(store.getState()));
    });

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
