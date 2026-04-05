import type { Product } from "@/src/types/product";

export const FLAVOUR_OPTIONS = [
  "chocolate",
  "citrus",
  "berry",
  "floral",
  "nutty",
  "sweet",
] as const;

export const BREW_METHOD_OPTIONS = ["any", "espresso", "filter", "immersion"] as const;

export const ROAST_PREFERENCE_OPTIONS = ["any", "light", "medium", "dark"] as const;

export const ACIDITY_PREFERENCE_OPTIONS = ["any", "low", "balanced", "bright"] as const;

export const BUDGET_PREFERENCE_OPTIONS = ["any", "value", "mid", "premium"] as const;

export type FlavourOption = (typeof FLAVOUR_OPTIONS)[number];
export type BrewMethodOption = (typeof BREW_METHOD_OPTIONS)[number];
export type RoastPreferenceOption = (typeof ROAST_PREFERENCE_OPTIONS)[number];
export type AcidityPreferenceOption = (typeof ACIDITY_PREFERENCE_OPTIONS)[number];
export type BudgetPreferenceOption = (typeof BUDGET_PREFERENCE_OPTIONS)[number];

export type RecommendationAnswers = {
  preferredFlavours: FlavourOption[];
  avoidFlavours: FlavourOption[];
  brewMethod: BrewMethodOption;
  roastPreference: RoastPreferenceOption;
  acidityPreference: AcidityPreferenceOption;
  budgetPreference: BudgetPreferenceOption;
  intensity: number;
  decafOnly: boolean;
};

export type RecommendationItem = {
  product: Product;
  score: number;
  reasons: string[];
};

export type RecommendationResponse = {
  items: RecommendationItem[];
};
