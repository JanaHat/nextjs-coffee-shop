import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { getProductById } from "@/src/lib/products";

const createFavouriteSchema = z.object({
  productId: z.string().trim().min(1),
});

const isUniqueConstraintError = (error: unknown) => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && (error as { code?: string }).code === "P2002";
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const favourites = await db.favourite.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      productId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    items: favourites.map((favourite) => favourite.productId),
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

  try {
    await db.favourite.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        favourited: true,
        productId,
      },
      { status: 201 },
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({
        ok: true,
        favourited: true,
        productId,
      });
    }

    throw error;
  }
}
