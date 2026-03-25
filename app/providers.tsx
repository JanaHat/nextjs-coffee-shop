"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { selectBasketItems } from "@/src/state/selectors/basket-selectors";
import { selectLastOrder } from "@/src/state/selectors/checkout-selectors";
import {
  readBasketItemsFromStorage,
  writeBasketItemsToStorage,
} from "@/src/state/persistence/basket-storage";
import {
  readLastOrderFromStorage,
  writeLastOrderToStorage,
} from "@/src/state/persistence/last-order-storage";
import { hydrateBasket } from "@/src/state/slices/basket-slice";
import { hydrateLastOrder } from "@/src/state/slices/checkout-slice";
import { makeStore } from "@/src/state/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(hydrateBasket(readBasketItemsFromStorage()));
    store.dispatch(hydrateLastOrder(readLastOrderFromStorage()));

    let previousBasket = JSON.stringify(selectBasketItems(store.getState()));
    let previousLastOrder = JSON.stringify(selectLastOrder(store.getState()));

    const unsubscribe = store.subscribe(() => {
      const nextBasket = selectBasketItems(store.getState());
      const nextLastOrder = selectLastOrder(store.getState());

      const nextBasketSerialized = JSON.stringify(nextBasket);
      const nextLastOrderSerialized = JSON.stringify(nextLastOrder);

      if (nextBasketSerialized !== previousBasket) {
        previousBasket = nextBasketSerialized;
        writeBasketItemsToStorage(nextBasket);
      }

      if (nextLastOrderSerialized !== previousLastOrder) {
        previousLastOrder = nextLastOrderSerialized;
        writeLastOrderToStorage(nextLastOrder);
      }
    });

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
