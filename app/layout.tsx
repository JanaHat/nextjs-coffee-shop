import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { AppNavigation } from "@/app/_components/AppNavigation";
import { Providers } from "@/app/providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Coffee Catalogue",
    template: "%s | Coffee Catalogue",
  },
  description:
    "A simple coffee product catalogue built with Next.js, TypeScript, and Tailwind CSS.",
  applicationName: "Coffee Catalogue",
  category: "shopping",
  keywords: ["coffee", "catalogue", "next.js", "typescript", "specialty coffee"],
  authors: [{ name: "Jana Hatasova" }],
  creator: "Jana Hatasova",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Coffee Catalogue",
    description:
      "Browse, search, and filter specialty coffee products in a fast Next.js catalogue.",
    siteName: "Coffee Catalogue",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: "Coffee Catalogue",
    description:
      "Browse, search, and filter specialty coffee products in a fast Next.js catalogue.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AppNavigation />
          {children}
          <footer className="app-surface border-x-0 border-b-0 px-4 py-3 text-center sm:px-8">
            <p className="app-muted text-xs">
              <Link href="/privacy" className="hover:underline">
                Privacy notice
              </Link>
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
