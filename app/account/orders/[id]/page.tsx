import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

type AccountOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderDetailPage({ params }: AccountOrderDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const { id } = await params;

  const order = await db.order.findFirst({
    where: {
      id,
      userId: session.user.id,
      status: "PAID",
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl space-y-6">
        <Link href="/account" className="app-muted text-sm hover:underline">
          ← Back to account
        </Link>

        <section className="app-surface rounded-2xl p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Order {order.id}</h1>
          <p className="app-muted mt-1 text-sm">{new Date(order.placedAt).toLocaleString()}</p>

          <p className="mt-3 text-sm text-(--app-text)">
            {totalItems} {totalItems === 1 ? "item" : "items"} · {formatPrice(order.totalCents / 100)}
          </p>

          <div className="mt-4 text-sm text-(--app-text)">
            <p className="font-medium">Delivery details</p>
            <p>{order.fullName}</p>
            <p>{order.addressLine1}</p>
            <p>
              {order.city}, {order.postalCode}
            </p>
            <p>{order.country}</p>
          </div>
        </section>

        <section className="app-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Items</h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3">
                <Link href={`/products/${item.productId}`} className="text-sm hover:underline">
                  {item.productName}
                </Link>
                <span className="app-muted text-xs">
                  {item.quantity} × {formatPrice(item.unitPriceCents / 100)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
