"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/products" })}
      className="app-button-secondary inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
    >
      Sign out
    </button>
  );
}
