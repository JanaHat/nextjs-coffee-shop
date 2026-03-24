"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAppSelector } from "@/src/state/hooks";
import {
  selectBasketHydrated,
  selectBasketTotalItems,
} from "@/src/state/selectors/basket-selectors";

export function AppNavigation() {
  const pathname = usePathname();
  const totalItems = useAppSelector(selectBasketTotalItems);
  const isHydrated = useAppSelector(selectBasketHydrated);

  const isProducts = pathname.startsWith("/products");
  const isBasket = pathname.startsWith("/basket");
  const basketCount = isHydrated ? totalItems : 0;

  return (
    <header className="app-surface sticky top-0 z-20 border-0 border-t-0 px-4 py-3 sm:px-8">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className={[
              "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition",
              "bg-transparent",
              isProducts ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4",
            ].join(" ")}
          >
            Products
          </Link>

          <Link
            href="/basket"
            className={[
              "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-black transition",
              "bg-yellow-400 hover:bg-yellow-300",
              isBasket ? "ring-2 ring-yellow-500/50" : "",
            ].join(" ")}
          >
            <span aria-hidden="true" className="mr-1">
              🛒
            </span>
            Basket
            <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-black">
              {basketCount}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
