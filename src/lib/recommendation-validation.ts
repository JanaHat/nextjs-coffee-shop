import { z } from "zod";

import {
  ACIDITY_PREFERENCE_OPTIONS,
  BREW_METHOD_OPTIONS,
  BUDGET_PREFERENCE_OPTIONS,
  FLAVOUR_OPTIONS,
  ROAST_PREFERENCE_OPTIONS,
  type RecommendationAnswers,
} from "@/src/types/recommendation";

const answersSchema = z
  .object({
    preferredFlavours: z
      .array(z.enum(FLAVOUR_OPTIONS))
      .min(1, "Select at least one flavour")
      .max(4, "Select up to four flavours"),
    avoidFlavours: z.array(z.enum(FLAVOUR_OPTIONS)).max(4).default([]),
    brewMethod: z.enum(BREW_METHOD_OPTIONS),
    roastPreference: z.enum(ROAST_PREFERENCE_OPTIONS),
    acidityPreference: z.enum(ACIDITY_PREFERENCE_OPTIONS),
    budgetPreference: z.enum(BUDGET_PREFERENCE_OPTIONS),
    intensity: z.number().int().min(1).max(5),
    decafOnly: z.boolean().default(false),
  })
  .superRefine((value, context) => {
    const overlap = value.preferredFlavours.filter((flavour) =>
      value.avoidFlavours.includes(flavour),
    );

    if (overlap.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The same flavour cannot be both preferred and avoided",
        path: ["avoidFlavours"],
      });
    }
  });

export type RecommendationValidationResult =
  | {
    isValid: true;
    data: RecommendationAnswers;
  }
  | {
    isValid: false;
    errors: Array<{ path: string; message: string }>;
  };

const unique = <T>(items: T[]) => Array.from(new Set(items));

const normalizeAnswers = (raw: RecommendationAnswers): RecommendationAnswers => ({
  ...raw,
  preferredFlavours: unique(raw.preferredFlavours),
  avoidFlavours: unique(raw.avoidFlavours),
});

export const validateRecommendationAnswers = (
  payload: unknown,
): RecommendationValidationResult => {
  const parsed = answersSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      isValid: false,
      errors: parsed.error.issues.map((issue) => ({
        path: issue.path.join(".") || "root",
        message: issue.message,
      })),
    };
  }

  return {
    isValid: true,
    data: normalizeAnswers(parsed.data),
  };
};
