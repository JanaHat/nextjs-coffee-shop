import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/profile/_components/SignOutButton";
import { auth } from "@/src/lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in?callbackUrl=/profile");
  }

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-3xl space-y-6">
        <header className="app-surface rounded-2xl p-6">
          <h1 className="text-3xl font-semibold tracking-tight">My profile</h1>
          <p className="app-muted mt-1 text-sm">Signed in as {session.user.email}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href="/products"
              className="app-button-secondary inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
            >
              Continue shopping
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section className="app-surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Saved orders</h2>
          <p className="app-muted mt-1 text-sm">
            Order history is the next step and will be shown here.
          </p>
        </section>
      </main>
    </div>
  );
}
