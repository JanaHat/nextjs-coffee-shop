"use client";

import { useAppDispatch, useAppSelector } from "@/src/state/hooks";
import { selectBasketQuantityById } from "@/src/state/selectors/basket-selectors";
import { addItem } from "@/src/state/slices/basket-slice";

type AddToBasketButtonProps = {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
  };
};

export function AddToBasketButton({ product }: AddToBasketButtonProps) {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector((state) => selectBasketQuantityById(state, product.id));

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

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleAdd}
        className="app-button-primary inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
        aria-label={`Add ${product.name} to basket`}
      >
        Add to Basket
      </button>

      {quantity > 0 ? (
        <p className="app-muted text-sm" aria-live="polite">
          In basket: {quantity}
        </p>
      ) : null}
    </div>
  );
}
