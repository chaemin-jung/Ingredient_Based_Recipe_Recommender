"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";

import { saveFavorite } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { RecommendationResult } from "@/lib/types";

type RecipeCardProps = {
  recipe: RecommendationResult;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [status, setStatus] = useState<string>("");

  async function handleFavorite() {
    const token = getToken();
    if (!token) {
      setStatus("Login to save favorites.");
      return;
    }

    try {
      await saveFavorite(token, recipe.id);
      setStatus("Saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  return (
    <article className="rounded-[2rem] bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-herb">{recipe.cuisine}</p>
          <h3 className="mt-2 text-2xl font-bold text-ink">{recipe.name}</h3>
          <p className="mt-2 text-sm text-ink/70">
            {recipe.cook_time} min • {recipe.difficulty}
          </p>
        </div>
        <div className="rounded-full bg-herb px-4 py-2 text-sm font-bold text-white">
          {(recipe.score * 100).toFixed(0)}%
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-herb/10 p-4">
          <p className="text-sm font-semibold text-herb">Matched ingredients</p>
          <p className="mt-2 text-sm text-ink">{recipe.matched_ingredients.join(", ") || "None"}</p>
        </div>
        <div className="rounded-3xl bg-spice/10 p-4">
          <p className="text-sm font-semibold text-spice">Missing ingredients</p>
          <p className="mt-2 text-sm text-ink">{recipe.missing_ingredients.join(", ") || "None"}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          href={`/recipes/${recipe.id}`}
          className="rounded-full border border-ink/10 px-5 py-3 text-sm font-semibold text-ink transition hover:border-herb hover:text-herb"
        >
          View details
        </Link>
        <button
          type="button"
          onClick={handleFavorite}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-spice"
        >
          <Heart className="h-4 w-4" />
          Save favorite
        </button>
      </div>
      {status ? <p className="mt-3 text-sm text-ink/65">{status}</p> : null}
    </article>
  );
}
