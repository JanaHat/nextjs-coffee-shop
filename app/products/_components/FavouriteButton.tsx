"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { AuthRequiredModal } from "@/app/_components/AuthRequiredModal";

type FavouriteButtonProps = {
  productId: string;
  productName: string;
  initialFavourited?: boolean;
  compact?: boolean;
};

export function FavouriteButton({
  productId,
  productName,
  initialFavourited = false,
  compact = false,
}: FavouriteButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [isFavourited, setIsFavourited] = useState(initialFavourited);
  const [isPending, setIsPending] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setIsFavourited(initialFavourited);
  }, [initialFavourited]);

  const callbackUrl = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const handleToggleFavourite = async () => {
    if (status !== "authenticated") {
      setShowAuthModal(true);
      return;
    }

    if (isPending) {
      return;
    }

    const nextFavourited = !isFavourited;
    setIsFavourited(nextFavourited);
    setIsPending(true);

    try {
      const response = await fetch(
        nextFavourited ? "/api/favourites" : `/api/favourites/${encodeURIComponent(productId)}`,
        {
          method: nextFavourited ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: nextFavourited ? JSON.stringify({ productId }) : undefined,
        },
      );

      if (response.status === 401) {
        setIsFavourited(!nextFavourited);
        setShowAuthModal(true);
        return;
      }

      if (!response.ok) {
        setIsFavourited(!nextFavourited);
      }
    } catch {
      setIsFavourited(!nextFavourited);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggleFavourite}
        disabled={isPending}
        aria-pressed={isFavourited}
        aria-label={isFavourited ? `Remove ${productName} from favourites` : `Add ${productName} to favourites`}
        title={isFavourited ? "Remove from favourites" : "Add to favourites"}
        className={[
          "inline-flex items-center justify-center rounded-lg border transition",
          compact ? "h-9 w-9" : "h-10 w-10",
          isFavourited
            ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-(--app-border) bg-white text-(--app-muted) hover:bg-(--app-chip-bg)",
          isPending ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        ].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill={isFavourited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 21s-6.8-4.4-9.4-8.2A5.8 5.8 0 0 1 12 5a5.8 5.8 0 0 1 9.4 7.8C18.8 16.6 12 21 12 21Z" />
        </svg>
      </button>

      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        callbackUrl={callbackUrl}
      />
    </>
  );
}
