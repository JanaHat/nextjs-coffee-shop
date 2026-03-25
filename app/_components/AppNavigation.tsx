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
            aria-current={isProducts ? "page" : undefined}
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
            aria-current={isBasket ? "page" : undefined}
            className={[
              "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-black transition",
              "bg-yellow-400 hover:bg-yellow-300",
              isBasket ? "ring-2 ring-yellow-500/50" : "",
            ].join(" ")}
          >
            <span aria-hidden="true" className="mr-1 inline-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 text-black"
              >
                <path d="M4 9h16l-1.2 9.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z" />
                <path d="M8 9 11 4" />
                <path d="m16 9-3-5" />
                <path d="M9 13v3" />
                <path d="M12 13v3" />
                <path d="M15 13v3" />
              </svg>
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
