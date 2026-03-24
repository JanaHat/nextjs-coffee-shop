"use client";

import { useSyncExternalStore } from "react";

import { useAppDispatch, useAppSelector } from "@/src/state/hooks";
import { selectBasketQuantityById } from "@/src/state/selectors/basket-selectors";
import { addItem, removeItem } from "@/src/state/slices/basket-slice";

type BasketProduct = {
  id: string;
  name: string;
  brand: string;
  price: number;
};

type AddToBasketButtonProps = {
  product: BasketProduct;
  compact?: boolean;
};

export function AddToBasketButton({
  product,
  compact = false,
}: AddToBasketButtonProps) {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector((state) => selectBasketQuantityById(state, product.id));
  const isClientHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const showQuantityControls = isClientHydrated && quantity > 0;

  const handleAdd = () => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
      }),
    );
  };

  const handleRemove = () => {
    dispatch(removeItem(product.id));
  };

  return (
    <div className="flex items-center gap-3">
      {!showQuantityControls ? (
        <button
          type="button"
          onClick={handleAdd}
          className={
            compact
              ? "mt-2 inline-flex rounded-lg bg-yellow-400 px-3 py-2 text-sm font-medium text-black transition hover:bg-yellow-300 cursor-pointer"
              : "inline-flex h-10 items-center rounded-lg bg-yellow-400 px-4 text-sm font-medium text-black transition hover:bg-yellow-300 cursor-pointer"
          }
          aria-label={`Add ${product.name} to basket`}
        >
          Add to basket
        </button>
      ) : (
        <div
          className={
            compact
              ? "mt-2 inline-flex items-center rounded-lg border border-yellow-400"
              : "inline-flex items-center rounded-lg border border-yellow-400"
          }
          aria-label={`${quantity} ${quantity === 1 ? "item" : "items"} in basket`}
        >
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex h-10 w-10 items-center justify-center text-base transition hover:bg-(--app-chip-bg)"
            aria-label={`Remove ${product.name} from basket`}
            title="Remove from basket"
          >
            🗑
          </button>

          <span className="inline-flex min-w-10 items-center justify-center px-2 text-sm font-medium">
            {quantity}
          </span>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex h-10 w-10 items-center justify-center text-lg font-semibold transition hover:bg-(--app-chip-bg)"
            aria-label={`Add one more ${product.name} to basket`}
            title="Add one more"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
