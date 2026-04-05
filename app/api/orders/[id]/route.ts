import { apiError, apiSuccess } from "@/src/lib/api-responses";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return apiError(401, "Unauthorized");
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
    return apiError(404, "Order not found");
  }

  return apiSuccess({ order });
}
