import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/src/lib/auth";
import { addUserFavourite, listUserFavouriteProductIds } from "@/src/lib/favourites";
import { getProductById } from "@/src/lib/products";

const createFavouriteSchema = z.object({
  productId: z.string().trim().min(1),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const items = await listUserFavouriteProductIds(session.user.id);

  return NextResponse.json({
    items,
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = createFavouriteSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid favourite payload" }, { status: 400 });
  }

  const productId = parsed.data.productId;

  if (!getProductById(productId)) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const result = await addUserFavourite(session.user.id, productId);

  if (result === "unavailable") {
    return NextResponse.json(
      { message: "Favourites are temporarily unavailable. Run database migrations." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      favourited: true,
      productId,
    },
    { status: result === "created" ? 201 : 200 },
  );
}
