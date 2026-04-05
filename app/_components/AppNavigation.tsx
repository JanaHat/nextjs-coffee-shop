"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { useAppSelector } from "@/src/state/hooks";
import {
  selectBasketHydrated,
  selectBasketTotalItems,
} from "@/src/state/selectors/basket-selectors";

export function AppNavigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useAppSelector(selectBasketTotalItems);
  const isHydrated = useAppSelector(selectBasketHydrated);

  const isProducts = pathname.startsWith("/products");
  const isRecommendations = pathname.startsWith("/recommendations");
  const isBasket = pathname.startsWith("/basket");
  const isAccount = pathname.startsWith("/account") || pathname.startsWith("/profile");
  const isSignIn = pathname.startsWith("/auth/sign-in");
  const isSignUp = pathname.startsWith("/auth/sign-up");
  const isSignedIn = status === "authenticated" && Boolean(session?.user);
  const basketCount = isHydrated ? totalItems : 0;

  const accountIcon = (
    <span aria-hidden="true" className="inline-flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </svg>
    </span>
  );

  return (
    <header className="app-surface sticky top-0 z-20 border-0 border-t-0 px-4 py-3 sm:px-8">
      <nav className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-2 md:hidden">
          <Link
            href="/account"
            aria-current={isAccount ? "page" : undefined}
            aria-label="Account"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
          >
            {accountIcon}
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/basket"
              aria-current={isBasket ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={[
                "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-black transition",
                "bg-yellow-400 hover:bg-yellow-300",
                isBasket ? "ring-2 ring-yellow-500/50" : "",
              ].join(" ")}
            >
              Basket
              <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-black">
                {basketCount}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="app-button-secondary inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium"
            >
              Menu
            </button>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-3 grid gap-2 md:hidden">
            <Link
              href="/products"
              aria-current={isProducts ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className="app-button-secondary inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium"
            >
              Products
            </Link>

            <Link
              href="/recommendations"
              aria-current={isRecommendations ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className="app-button-secondary inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium"
            >
              Coffee Matcher
            </Link>

            {!isSignedIn ? (
              <>
                <Link
                  href="/auth/sign-in"
                  aria-current={isSignIn ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="app-button-secondary inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium"
                >
                  Sign in
                </Link>

                <Link
                  href="/auth/sign-up"
                  aria-current={isSignUp ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="app-button-secondary inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut({ callbackUrl: "/products" });
                }}
                className="app-button-secondary inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium"
              >
                Sign out
              </button>
            )}
          </div>
        ) : null}

        <div className="hidden items-center justify-end gap-2 md:flex">
          <Link
            href="/account"
            aria-current={isAccount ? "page" : undefined}
            aria-label="Account"
            className={[
              "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition",
              "bg-transparent",
              isAccount ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4",
            ].join(" ")}
          >
            {accountIcon}
          </Link>

          {isSignedIn ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/products" })}
              className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition hover:underline hover:underline-offset-4"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                aria-current={isSignIn ? "page" : undefined}
                className={[
                  "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition",
                  "bg-transparent",
                  isSignIn ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4",
                ].join(" ")}
              >
                Sign in
              </Link>

              <Link
                href="/auth/sign-up"
                aria-current={isSignUp ? "page" : undefined}
                className={[
                  "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition",
                  "bg-transparent",
                  isSignUp ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4",
                ].join(" ")}
              >
                Sign up
              </Link>
            </>
          )}

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
            href="/recommendations"
            aria-current={isRecommendations ? "page" : undefined}
            className={[
              "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition",
              "bg-transparent",
              isRecommendations
                ? "underline underline-offset-4"
                : "hover:underline hover:underline-offset-4",
            ].join(" ")}
          >
            Coffee Matcher
          </Link>

          <Link
            href="/basket"
            aria-current={isBasket ? "page" : undefined}
            className={[
              "inline-flex h-9 items-center rounded-lg bg-yellow-400 px-3 text-sm font-medium text-black transition hover:bg-yellow-300",
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
