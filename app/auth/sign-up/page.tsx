import type { Metadata } from "next";

import { SignUpPageClient } from "@/app/auth/sign-up/_components/SignUpPageClient";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an account to save your orders.",
  alternates: {
    canonical: "/auth/sign-up",
  },
};

export default function SignUpPage() {
  return <SignUpPageClient />;
}
