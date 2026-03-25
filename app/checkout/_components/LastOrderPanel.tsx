import type { LastOrder } from "@/src/types/order";

type LastOrderPanelProps = {
  order: LastOrder;
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export function LastOrderPanel({ order }: LastOrderPanelProps) {
  return (
    <section className="app-surface rounded-2xl p-5">
      <h2 className="text-lg font-semibold">Last order</h2>
      <p className="app-muted mt-1 text-sm">
        {order.orderId} · {new Date(order.createdAt).toLocaleString()}
      </p>
      <p className="mt-2 text-sm text-(--app-text)">
        {order.totalItems} items · {formatPrice(order.totalPrice)}
      </p>
    </section>
  );
}
