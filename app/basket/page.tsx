import type { Metadata } from "next";

import { BasketPageClient } from "@/app/basket/_components/BasketPageClient";

export const metadata: Metadata = {
  title: "Basket",
  description: "Review basket items before checkout.",
  alternates: {
    canonical: "/basket",
  },
};

export default function BasketPage() {
  return <BasketPageClient />;
}
