"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

const getSearchParam = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get(key);
};

export default function SignInPage() {
  const router = useRouter();
  const [callbackUrl] = useState(() => getSearchParam("callbackUrl") || "/account");
  const [showRegistered] = useState(() => getSearchParam("registered") === "1");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setErrorMessage("Invalid email or password.");
      return;
    }

    router.push(result.url ?? callbackUrl);
  };

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-md">
        <section className="app-surface rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="app-muted mt-1 text-sm">Access your account and past orders.</p>

          {showRegistered ? (
            <p className="mt-4 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700">
              Account created. You can sign in now.
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="app-input w-full"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Password
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="app-input w-full"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="app-button-primary mt-2 inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="app-muted mt-4 text-sm">
            No account yet?{" "}
            <Link href="/auth/sign-up" className="hover:underline">
              Create one
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
