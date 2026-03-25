"use client";

import Image from "next/image";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/src/state/hooks";
import {
  selectBasketHydrated,
  selectBasketItems,
  selectBasketTotalItems,
  selectBasketTotalPrice,
} from "@/src/state/selectors/basket-selectors";
import {
  clearBasket,
  removeItem,
  updateQuantity,
} from "@/src/state/slices/basket-slice";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export function BasketPageClient() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectBasketItems);
  const totalItems = useAppSelector(selectBasketTotalItems);
  const totalPrice = useAppSelector(selectBasketTotalPrice);
  const isHydrated = useAppSelector(selectBasketHydrated);

  const displayItems = isHydrated ? items : [];
  const displayTotalItems = isHydrated ? totalItems : 0;
  const displayTotalPrice = isHydrated ? totalPrice : 0;

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Basket</h1>
            <p className="app-muted mt-1 text-sm">
              {displayTotalItems} {displayTotalItems === 1 ? "item" : "items"} in your basket
            </p>
          </div>

          {displayItems.length > 0 ? (
            <button
              type="button"
              onClick={() => dispatch(clearBasket())}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-500"
            >
              Clear basket
            </button>
          ) : null}
        </header>

        {displayItems.length === 0 ? (
          <section className="app-surface rounded-2xl p-8 text-center">
            <p className="app-muted mb-4">Your basket is empty.</p>
            <Link
              href="/products"
              className="app-button-primary inline-flex rounded-lg px-4 py-2 text-sm font-medium"
            >
              Browse products
            </Link>
          </section>
        ) : (
          <>
            <section className="app-surface rounded-2xl p-4 sm:p-6">
              <ul className="divide-y divide-(--app-border)">
                {displayItems.map((item) => {
                  const lineTotal = item.price * item.quantity;

                  return (
                    <li
                      key={item.id}
                      className="grid gap-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/products/${item.id}`}
                          className="app-surface h-20 w-20 overflow-hidden rounded-lg"
                          aria-label={`View details for ${item.name}`}
                        >
                          <Image
                            src={`/${item.id}.webp`}
                            alt={`${item.name} by ${item.brand}`}
                            width={160}
                            height={160}
                            className="h-full w-full object-cover"
                          />
                        </Link>

                        <div>
                          <p className="app-muted text-xs uppercase tracking-wide">
                            {item.brand}
                          </p>
                          <h2 className="text-lg font-semibold">
                            <Link href={`/products/${item.id}`} className="hover:underline">
                              {item.name}
                            </Link>
                          </h2>
                          <p className="app-muted text-sm">{formatPrice(item.price)} each</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.id,
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                          className="app-button-secondary h-9 w-9 rounded-lg"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>

                        <span className="inline-flex min-w-10 justify-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.id,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          className="app-button-secondary h-9 w-9 rounded-lg"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>

                        <button
                          type="button"
                          onClick={() => dispatch(removeItem(item.id))}
                          className="app-button-secondary rounded-lg px-3 py-2 text-sm"
                        >
                          Remove
                        </button>

                        <p className="ml-1 min-w-20 text-right text-sm font-semibold">
                          {formatPrice(lineTotal)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="app-surface rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-2xl font-semibold">{formatPrice(displayTotalPrice)}</p>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/checkout"
                    className="inline-flex rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-300"
                  >
                    Proceed to checkout
                  </Link>

                  <Link
                    href="/products"
                    className="app-button-secondary inline-flex rounded-lg px-4 py-2 text-sm font-medium"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
