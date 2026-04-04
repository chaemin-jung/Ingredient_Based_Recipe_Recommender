"use client";

import { useState } from "react";

import { FavoritesPanel } from "@/components/favorites-panel";
import { FilterPanel } from "@/components/filter-panel";
import { IngredientInput } from "@/components/ingredient-input";
import { RecipeCard } from "@/components/recipe-card";
import { fetchRecommendations } from "@/lib/api";
import { RecommendationResult } from "@/lib/types";

type Filters = {
  maxCookTime: string;
  cuisine: string;
  difficulty: string;
};

const initialFilters: Filters = {
  maxCookTime: "",
  cuisine: "",
  difficulty: "",
};

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [recipes, setRecipes] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastIngredients, setLastIngredients] = useState<string[]>([]);

  async function handleRecommend(ingredients: string[]) {
    setLoading(true);
    setError("");
    setLastIngredients(ingredients);

    try {
      const data = await fetchRecommendations({
        ingredients,
        max_cook_time: filters.maxCookTime ? Number(filters.maxCookTime) : undefined,
        cuisine: filters.cuisine || undefined,
        difficulty: filters.difficulty || undefined,
        limit: 12,
      });
      setRecipes(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to fetch recipes.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-14">
      <section className="grid gap-6 rounded-[2.5rem] bg-hero p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-spice">Custom matching engine</p>
          <h2 className="mt-4 max-w-xl text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Turn your pantry into ranked recipe recommendations.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/75">
            Search with ingredients you already have, apply cook-time and cuisine filters, and inspect the
            missing items before you commit to a recipe.
          </p>
        </div>
        <IngredientInput onSubmit={handleRecommend} />
      </section>

      <FilterPanel value={filters} onChange={setFilters} />
      <FavoritesPanel />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-herb">Results</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Ranked recipe matches</h2>
          </div>
          {lastIngredients.length ? (
            <p className="text-sm text-ink/70">Using: {lastIngredients.join(", ")}</p>
          ) : null}
        </div>

        {loading ? <p className="rounded-3xl bg-white/70 p-6 shadow-soft">Calculating recipe scores...</p> : null}
        {error ? <p className="rounded-3xl bg-white/70 p-6 text-spice shadow-soft">{error}</p> : null}
        {!loading && !error && !recipes.length ? (
          <p className="rounded-3xl bg-white/70 p-6 shadow-soft">
            Add ingredients and run the recommender to see ranked recipes.
          </p>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-2">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </main>
  );
}
