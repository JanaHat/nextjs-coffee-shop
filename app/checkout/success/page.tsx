import type { Metadata } from "next";

import { CheckoutSuccessPageClient } from "@/app/checkout/success/_components/CheckoutSuccessPageClient";

export const metadata: Metadata = {
  title: "Checkout success",
  description: "Your order has been placed successfully.",
  alternates: {
    canonical: "/checkout/success",
  },
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessPageClient />;
}
