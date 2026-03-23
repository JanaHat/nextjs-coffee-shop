"use client";

import { useMemo } from "react";

import { useBasket } from "@/src/state/basket-context";

type AddToBasketButtonProps = {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
  };
};

export function AddToBasketButton({ product }: AddToBasketButtonProps) {
  const { addItem, items } = useBasket();

  const quantity = useMemo(() => {
    return items.find((item) => item.id === product.id)?.quantity ?? 0;
  }, [items, product.id]);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
    });
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
