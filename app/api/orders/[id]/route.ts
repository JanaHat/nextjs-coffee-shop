import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

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
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
