"use client";

import React, { useEffect, useTransition } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppStore, CountryMinimal } from "../../lib/store/useAppStore";
import { cn } from "../../lib/utils/cn";

interface FavoriteButtonProps {
  country: CountryMinimal;
}

export function FavoriteButton({ country }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { favorites, toggleFavorite, fetchProfileAndFavorites } = useAppStore();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (session) {
      fetchProfileAndFavorites();
    }
  }, [session, fetchProfileAndFavorites]);

  const isFavorite = favorites.some((fav) => fav.id === country.id || fav.slug === country.slug);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    startTransition(async () => {
      try {
        await toggleFavorite(country);
      } catch (err) {
        console.error("Erro ao favoritar país:", err);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "inline-flex items-center justify-center p-2.5 rounded-full border transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isFavorite
          ? "bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500/20"
          : "bg-background/80 border-border text-muted-foreground hover:text-foreground hover:bg-muted/80",
        "disabled:opacity-50"
      )}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className={cn("w-5 h-5 transition-transform duration-300", isFavorite && "fill-rose-500 scale-110")} />
    </button>
  );
}
