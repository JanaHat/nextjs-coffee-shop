import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders = await db.order.findMany({
    where: {
      userId: session.user.id,
      status: "PAID",
    },
    include: {
      items: {
        select: {
          id: true,
          productId: true,
          productName: true,
          quantity: true,
          unitPriceCents: true,
        },
      },
    },
    orderBy: {
      placedAt: "desc",
    },
  });

  return NextResponse.json({
    items: orders,
  });
}
