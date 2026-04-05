import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/account/_components/SignOutButton";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { listUserFavouriteProductIds } from "@/src/lib/favourites";
import { getProductById } from "@/src/lib/products";
import type { Product } from "@/src/types/product";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account and review past orders.",
  alternates: {
    canonical: "/account",
  },
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const pastOrders = await db.order.findMany({
    where: {
      userId: session.user.id,
      status: "PAID",
    },
    include: {
      items: true,
    },
    orderBy: {
      placedAt: "desc",
    },
    take: 20,
  });

  const favouriteProductIds = await listUserFavouriteProductIds(session.user.id, {
    limit: 24,
  });

  const favouriteProducts = favouriteProductIds
    .map((productId) => getProductById(productId))
    .filter((product): product is Product => Boolean(product));

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl space-y-6">
        <header className="app-surface rounded-2xl p-6">
          <h1 className="text-3xl font-semibold tracking-tight">My account</h1>
          <p className="app-muted mt-1 text-sm">Signed in as {session.user.email}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href="/products"
              className="app-button-secondary inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
            >
              Continue shopping
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section className="app-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Favourites</h2>
          {favouriteProducts.length === 0 ? (
            <p className="app-muted mt-1 text-sm">
              No favourites yet. Tap the heart icon on any product to save it.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {favouriteProducts.map((product) => {
                return (
                  <li key={product.id} className="flex items-center justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="app-muted text-xs">{product.brand}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="app-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Past orders</h2>
          {pastOrders.length === 0 ? (
            <p className="app-muted mt-1 text-sm">
              No past orders yet. Complete a checkout while signed in.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {pastOrders.map((order) => {
                const totalPrice = order.totalCents / 100;
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <li key={order.id} className="rounded-xl border border-(--app-border) p-4">
                    <p className="text-sm font-medium">
                      <Link href={`/account/orders/${order.id}`} className="hover:underline">
                        Order {order.id}
                      </Link>
                    </p>
                    <p className="app-muted mt-1 text-xs">
                      {new Date(order.placedAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm">
                      {totalItems} {totalItems === 1 ? "item" : "items"} ·{" "}
                      {formatPrice(totalPrice)}
                    </p>

                    <ul className="mt-3 space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-3">
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-sm hover:underline"
                          >
                            {item.productName}
                          </Link>
                          <span className="app-muted text-xs">
                            {item.quantity} × {formatPrice(item.unitPriceCents / 100)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="app-button-secondary inline-flex rounded-lg px-3 py-2 text-xs font-medium"
                      >
                        View order details
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
