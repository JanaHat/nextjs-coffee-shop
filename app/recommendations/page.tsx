import type { Metadata } from "next";

import { RecommendationsPageClient } from "@/app/recommendations/_components/RecommendationsPageClient";

export const metadata: Metadata = {
  title: "Coffee Questionnaire",
  description: "Answer a few preference questions and get your top 5 coffee matches.",
  alternates: {
    canonical: "/recommendations",
  },
};

export default function RecommendationsPage() {
  return <RecommendationsPageClient />;
}
