"use client";

import { useState } from "react";

type FiltersDisclosureProps = {
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function FiltersDisclosure({
  defaultOpen = false,
  children,
}: FiltersDisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="app-muted text-sm underline underline-offset-4"
      >
        {isOpen ? "Hide filters and sort" : "Show filters and sort"}
      </button>

      {isOpen ? <div className="space-y-4">{children}</div> : null}
    </section>
  );
}
