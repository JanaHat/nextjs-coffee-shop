import { NextResponse } from "next/server";

import { validateRecommendationAnswers } from "@/src/lib/recommendation-validation";
import { recommendProducts } from "@/src/lib/recommendations";

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  const validation = validateRecommendationAnswers(rawBody);

  if (!validation.isValid) {
    return NextResponse.json(
      {
        message: "Invalid recommendation answers",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const data = recommendProducts(validation.data);

  return NextResponse.json(data);
}
