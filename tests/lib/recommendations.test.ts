import { describe, expect, it } from "vitest";

import { recommendProducts } from "@/src/lib/recommendations";
import type { RecommendationAnswers } from "@/src/types/recommendation";

const baseAnswers: RecommendationAnswers = {
  preferredFlavours: ["chocolate", "nutty"],
  avoidFlavours: [],
  brewMethod: "espresso",
  roastPreference: "medium",
  acidityPreference: "balanced",
  budgetPreference: "mid",
  intensity: 4,
  decafOnly: false,
};

describe("recommendProducts", () => {
  it("returns exactly five items for standard preferences", () => {
    const result = recommendProducts(baseAnswers);

    expect(result.items).toHaveLength(5);
  });

  it("returns only decaf coffees when decafOnly is true", () => {
    const result = recommendProducts({
      ...baseAnswers,
      decafOnly: true,
      brewMethod: "any",
      roastPreference: "any",
      acidityPreference: "any",
      budgetPreference: "any",
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((item) => item.product.tags.includes("decaf"))).toBe(true);
  });

  it("is deterministic for the same answers", () => {
    const first = recommendProducts(baseAnswers);
    const second = recommendProducts(baseAnswers);

    expect(second).toEqual(first);
  });
});
