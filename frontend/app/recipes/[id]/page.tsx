"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchRecipe } from "@/lib/api";
import { RecipeDetail } from "@/lib/types";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await fetchRecipe(params.id);
        setRecipe(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load recipe.");
      }
    }

    if (params?.id) {
      loadRecipe();
    }
  }, [params]);

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 pb-16">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-spice">{error}</p>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="mx-auto max-w-4xl px-6 pb-16">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">Loading recipe...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 pb-16">
      <article className="rounded-[2.5rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-herb">{recipe.cuisine}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">{recipe.name}</h1>
        <p className="mt-3 text-sm text-ink/70">
          {recipe.cook_time} minutes • {recipe.difficulty}
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] bg-sand/60 p-6">
            <h2 className="text-xl font-bold text-ink">Ingredients</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink/80">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.name} className="flex items-center justify-between gap-4">
                  <span className="font-medium capitalize">{ingredient.name}</span>
                  <span>{ingredient.quantity}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] bg-white p-1">
            <h2 className="px-5 pt-5 text-xl font-bold text-ink">Steps</h2>
            <ol className="mt-4 space-y-4 px-5 pb-5">
              {recipe.instructions.map((step, index) => (
                <li key={step} className="rounded-3xl bg-herb/10 p-4 text-sm leading-6 text-ink">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-herb">
                    Step {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-ink/10 px-5 py-3 text-sm font-semibold text-ink transition hover:border-spice hover:text-spice"
        >
          Back to recommendations
        </Link>
      </article>
    </main>
  );
}
