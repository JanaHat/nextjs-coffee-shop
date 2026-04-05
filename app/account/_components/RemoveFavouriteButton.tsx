"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RemoveFavouriteButtonProps = {
  productId: string;
};

export function RemoveFavouriteButton({ productId }: RemoveFavouriteButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleRemove = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`/api/favourites/${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      className="app-button-secondary inline-flex rounded-lg px-3 py-2 text-xs font-medium"
      aria-label="Remove from favourites"
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}
