import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/profile/_components/SignOutButton";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in?callbackUrl=/profile");
  }

  const savedOrders = await db.order.findMany({
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

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl space-y-6">
        <header className="app-surface rounded-2xl p-6">
          <h1 className="text-3xl font-semibold tracking-tight">My profile</h1>
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
          <h2 className="text-lg font-semibold">Saved orders</h2>
          {savedOrders.length === 0 ? (
            <p className="app-muted mt-1 text-sm">
              No saved orders yet. Complete a checkout while signed in.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {savedOrders.map((order) => {
                const totalPrice = order.totalCents / 100;
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <li key={order.id} className="rounded-xl border border-(--app-border) p-4">
                    <p className="text-sm font-medium">Order {order.id}</p>
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
