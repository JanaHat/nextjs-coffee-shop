import { apiError, apiSuccess } from "@/src/lib/api-responses";
import { validateRecommendationAnswers } from "@/src/lib/recommendation-validation";
import { recommendProducts } from "@/src/lib/recommendations";

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return apiError(400, "Invalid JSON payload");
  }

  const validation = validateRecommendationAnswers(rawBody);

  if (!validation.isValid) {
    return apiError(400, "Invalid recommendation answers", { errors: validation.errors });
  }

  const data = recommendProducts(validation.data);

  return apiSuccess(data);
}
