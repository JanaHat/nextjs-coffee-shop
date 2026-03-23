import { NextResponse } from "next/server";

import { validateProductsQuery } from "@/src/lib/products-query-validation";
import { getProducts, parseProductsQuery } from "@/src/lib/products";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = validateProductsQuery(searchParams);

  if (!validation.isValid) {
    return NextResponse.json(
      {
        message: "Invalid query parameters",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const query = parseProductsQuery(searchParams);
  const data = getProducts(query);

  return NextResponse.json(data);
}
