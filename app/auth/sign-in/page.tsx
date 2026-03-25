import type { Metadata } from "next";

import { SignInPageClient } from "@/app/auth/sign-in/_components/SignInPageClient";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account to view your past orders.",
  alternates: {
    canonical: "/auth/sign-in",
  },
};

export default function SignInPage() {
  return <SignInPageClient />;
}
