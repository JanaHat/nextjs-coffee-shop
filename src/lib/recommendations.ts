import { getAllProducts } from "@/src/lib/products";
import type {
  FlavourOption,
  RecommendationAnswers,
  RecommendationItem,
  RecommendationResponse,
} from "@/src/types/recommendation";

const FLAVOUR_TAGS: Record<FlavourOption, string[]> = {
  chocolate: ["chocolate", "cocoa"],
  citrus: ["citrus", "apple"],
  berry: ["berry", "stone-fruit", "plum"],
  floral: ["floral", "tea-like"],
  nutty: ["nutty"],
  sweet: ["sweet", "caramel", "toffee", "brown-sugar"],
};

const hasAnyTag = (tags: string[], candidates: string[]) =>
  candidates.some((candidate) => tags.includes(candidate));

const getIntensityEstimate = (tags: string[]) => {
  let intensity = tags.includes("light-roast") ? 2 : 3;

  if (tags.includes("medium-roast")) {
    intensity = 3;
  }

  if (tags.includes("dark-roast")) {
    intensity = 4;
  }

  if (tags.includes("espresso")) {
    intensity += 1;
  }

  return Math.max(1, Math.min(5, intensity));
};

const getBudgetTier = (price: number) => {
  if (price <= 13.5) {
    return "value" as const;
  }

  if (price <= 15.5) {
    return "mid" as const;
  }

  return "premium" as const;
};

const scoreProduct = (answers: RecommendationAnswers, product: RecommendationItem["product"]) => {
  const tags = product.tags.map((tag) => tag.toLowerCase());
  const reasons: string[] = [];
  let score = 0;

  if (answers.decafOnly && !tags.includes("decaf")) {
    return {
      score: Number.NEGATIVE_INFINITY,
      reasons: ["Does not match your decaf requirement"],
    };
  }

  if (answers.decafOnly && tags.includes("decaf")) {
    score += 18;
    reasons.push("Matches your decaf preference");
  }

  for (const flavour of answers.preferredFlavours) {
    const flavourTags = FLAVOUR_TAGS[flavour];

    if (hasAnyTag(tags, flavourTags)) {
      score += 12;
      reasons.push(`Includes ${flavour} notes`);
    }
  }

  for (const flavour of answers.avoidFlavours) {
    const flavourTags = FLAVOUR_TAGS[flavour];

    if (hasAnyTag(tags, flavourTags)) {
      score -= 10;
    }
  }

  if (answers.brewMethod === "espresso" && tags.includes("espresso")) {
    score += 8;
    reasons.push("Great for espresso brewing");
  }

  if (answers.brewMethod === "filter" && tags.includes("filter")) {
    score += 8;
    reasons.push("Great for filter brewing");
  }

  if (
    answers.brewMethod === "immersion"
    && (tags.includes("filter") || tags.includes("medium-roast"))
  ) {
    score += 6;
    reasons.push("Suitable for immersion brews");
  }

  if (answers.roastPreference === "light" && tags.includes("light-roast")) {
    score += 7;
    reasons.push("Matches your light roast preference");
  }

  if (answers.roastPreference === "medium" && tags.includes("medium-roast")) {
    score += 7;
    reasons.push("Matches your medium roast preference");
  }

  if (
    answers.roastPreference === "dark"
    && (tags.includes("dark-roast") || tags.includes("chocolate") || tags.includes("daily"))
  ) {
    score += 7;
    reasons.push("Closer to your darker profile preference");
  }

  if (
    answers.acidityPreference === "bright"
    && hasAnyTag(tags, ["citrus", "floral", "berry", "apple", "tea-like", "stone-fruit"])
  ) {
    score += 7;
    reasons.push("Brighter acidity profile");
  }

  if (
    answers.acidityPreference === "low"
    && hasAnyTag(tags, ["chocolate", "nutty", "sweet", "daily"])
  ) {
    score += 7;
    reasons.push("Lower acidity profile");
  }

  if (
    answers.acidityPreference === "balanced"
    && hasAnyTag(tags, ["medium-roast", "sweet", "caramel", "chocolate"])
  ) {
    score += 7;
    reasons.push("Balanced acidity profile");
  }

  if (answers.budgetPreference !== "any" && getBudgetTier(product.price) === answers.budgetPreference) {
    score += 6;
    reasons.push("Fits your budget range");
  }

  const intensityDistance = Math.abs(getIntensityEstimate(tags) - answers.intensity);
  score += Math.max(0, (6 - intensityDistance) * 2);

  if (intensityDistance <= 1) {
    reasons.push("Close to your desired intensity");
  }

  score += product.rating;

  return {
    score,
    reasons: reasons.slice(0, 4),
  };
};

export const recommendProducts = (answers: RecommendationAnswers): RecommendationResponse => {
  const ranked = getAllProducts()
    .map((product) => {
      const result = scoreProduct(answers, product);

      return {
        product,
        score: result.score,
        reasons: result.reasons,
      };
    })
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (b.product.rating !== a.product.rating) {
        return b.product.rating - a.product.rating;
      }

      if (a.product.price !== b.product.price) {
        return a.product.price - b.product.price;
      }

      return a.product.name.localeCompare(b.product.name);
    })
    .slice(0, 5);

  return {
    items: ranked,
  };
};
