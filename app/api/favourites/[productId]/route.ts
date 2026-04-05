import { NextResponse } from "next/server";

import { auth } from "@/src/lib/auth";
import { removeUserFavourite } from "@/src/lib/favourites";
import { getProductById } from "@/src/lib/products";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await context.params;

  if (!getProductById(productId)) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const result = await removeUserFavourite(session.user.id, productId);

  if (result === "unavailable") {
    return NextResponse.json(
      { message: "Favourites are temporarily unavailable. Run database migrations." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    favourited: false,
    productId,
  });
}
