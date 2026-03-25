import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
  description: "Coffee catalogue home route redirect.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  redirect("/products");
}
