import Image from "next/image";

import type { BasketItem } from "@/src/state/slices/basket-slice";

type CheckoutOrderSummaryProps = {
  items: BasketItem[];
  totalItems: number;
  totalPrice: number;
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export function CheckoutOrderSummary({
  items,
  totalItems,
  totalPrice,
}: CheckoutOrderSummaryProps) {
  return (
    <aside className="app-surface rounded-2xl p-5 sm:p-6">
      <h2 className="mb-4 text-xl font-semibold">Order summary</h2>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="app-surface h-14 w-14 overflow-hidden rounded-lg">
              <Image
                src={`/${item.id}.webp`}
                alt={`${item.name} by ${item.brand}`}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="app-muted text-xs">
                Qty {item.quantity} · {formatPrice(item.price)} each
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-(--app-border) pt-4">
        <p className="app-muted text-sm">Items: {totalItems}</p>
        <p className="text-xl font-semibold">Total: {formatPrice(totalPrice)}</p>
      </div>
    </aside>
  );
}
