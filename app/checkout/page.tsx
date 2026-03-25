import type { Metadata } from "next";

import { CheckoutPageClient } from "@/app/checkout/_components/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter delivery details and place your coffee order.",
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
