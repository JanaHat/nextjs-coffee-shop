"use client";

import Link from "next/link";

import { useAppSelector } from "@/src/state/hooks";
import { selectLastOrder } from "@/src/state/selectors/checkout-selectors";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export default function CheckoutSuccessPage() {
  const lastOrder = useAppSelector(selectLastOrder);

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl space-y-6">
        <section className="app-surface rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Payment successful</h1>
          <p className="app-muted mt-2 text-sm">
            Your order was placed using mock checkout.
          </p>

          {lastOrder ? (
            <div className="mt-5 rounded-xl border border-(--app-border) p-4 text-left">
              <p className="text-sm font-semibold">Order: {lastOrder.orderId}</p>
              <p className="app-muted text-sm">
                {new Date(lastOrder.createdAt).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-(--app-text)">
                {lastOrder.totalItems} items · {formatPrice(lastOrder.totalPrice)}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="app-button-primary inline-flex rounded-lg px-4 py-2 text-sm font-medium"
            >
              Continue shopping
            </Link>
            <Link
              href="/basket"
              className="app-button-secondary inline-flex rounded-lg px-4 py-2 text-sm font-medium"
            >
              Go to basket
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
