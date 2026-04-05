"use client";

import Link from "next/link";

type AuthRequiredModalProps = {
  open: boolean;
  onClose: () => void;
  callbackUrl: string;
};

export function AuthRequiredModal({
  open,
  onClose,
  callbackUrl,
}: AuthRequiredModalProps) {
  if (!open) {
    return null;
  }

  const signInHref = `/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const signUpHref = `/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-required-title"
      onClick={onClose}
    >
      <div
        className="app-surface w-full max-w-md rounded-2xl p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="auth-required-title" className="text-xl font-semibold tracking-tight">
          Sign in required
        </h2>
        <p className="app-muted mt-2 text-sm">
          You need to sign in or create an account to save favourites.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link
            href={signInHref}
            className="app-button-secondary inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium"
          >
            Sign in
          </Link>
          <Link
            href={signUpHref}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-yellow-400 px-4 text-sm font-medium text-black transition hover:bg-yellow-300"
          >
            Create account
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="app-muted mt-4 text-sm underline underline-offset-4"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
