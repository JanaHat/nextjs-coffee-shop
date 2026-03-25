"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setErrorMessage(data?.message ?? "Could not create account.");
      return;
    }

    router.push("/auth/sign-in?registered=1");
  };

  return (
    <div className="app-page px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-md">
        <section className="app-surface rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="app-muted mt-1 text-sm">Sign up to save and view your orders.</p>

          {errorMessage ? (
            <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              Full name
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="app-input w-full"
              />
            </label>

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
                autoComplete="new-password"
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
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="app-muted mt-4 text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
