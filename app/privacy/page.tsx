import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for the Coffee Catalogue portfolio project.",
};

export default function PrivacyPage() {
  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl space-y-6">
        <header className="app-surface rounded-2xl p-6">
          <h1 className="text-3xl font-semibold tracking-tight">Privacy notice</h1>
          <p className="app-muted mt-2 text-sm">
            This is a portfolio project. It uses only essential authentication/session
            cookies needed for sign-in and account access.
          </p>
        </header>

        <section className="app-surface rounded-2xl p-6 space-y-3 text-sm text-(--app-text)">
          <p>
            <span className="font-medium">What is stored:</span> account details (name,
            email), order history for signed-in users, and basket/last-order data in local
            browser storage for user experience.
          </p>
          <p>
            <span className="font-medium">Why:</span> to provide sign-in, account access,
            checkout, and past-order features.
          </p>
          <p>
            <span className="font-medium">Cookies:</span> only strictly necessary
            authentication/session cookies are used. No analytics or marketing trackers are
            enabled.
          </p>
          <p>
            <span className="font-medium">Data requests:</span> if you need your test data
            removed, contact the project owner.
          </p>
        </section>
      </main>
    </div>
  );
}
