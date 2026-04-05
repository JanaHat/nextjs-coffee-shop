import { apiError, apiSuccess } from "@/src/lib/api-responses";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return apiError(401, "Unauthorized");
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

  return apiSuccess({ items: orders });
}
