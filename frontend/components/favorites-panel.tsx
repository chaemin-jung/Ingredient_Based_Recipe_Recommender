"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchFavorites } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { FavoriteRecipe } from "@/lib/types";

export function FavoritesPanel() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    fetchFavorites(token).then(setFavorites).catch(() => setFavorites([]));
  }, []);

  if (!favorites.length) {
    return null;
  }

  return (
    <section className="rounded-[2rem] bg-white/75 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-spice">Favorites</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Saved recipe lineup</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {favorites.map((favorite) => (
          <Link
            key={favorite.id}
            href={`/recipes/${favorite.id}`}
            className="rounded-3xl border border-ink/10 bg-sand/50 px-4 py-4 transition hover:border-herb"
          >
            <p className="font-semibold text-ink">{favorite.name}</p>
            <p className="mt-1 text-sm text-ink/70">
              {favorite.cuisine} • {favorite.cook_time} min • {favorite.difficulty}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
