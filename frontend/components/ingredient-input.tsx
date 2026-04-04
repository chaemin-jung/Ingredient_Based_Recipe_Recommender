"use client";

import { FormEvent, useState } from "react";

type IngredientInputProps = {
  onSubmit: (ingredients: string[]) => void;
};

export function IngredientInput({ onSubmit }: IngredientInputProps) {
  const [rawInput, setRawInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ingredients = rawInput
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    onSubmit(ingredients);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white/85 p-6 shadow-soft backdrop-blur">
      <label htmlFor="ingredients" className="block text-sm font-semibold uppercase tracking-[0.25em] text-herb">
        Available Ingredients
      </label>
      <textarea
        id="ingredients"
        rows={4}
        value={rawInput}
        onChange={(event) => setRawInput(event.target.value)}
        placeholder="eggs, tomato, spinach, garlic, olive oil"
        className="mt-4 w-full rounded-3xl border border-ink/10 bg-sand/60 px-4 py-3 text-base text-ink placeholder:text-ink/45"
      />
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-ink/65">Separate ingredients with commas for the matching engine.</p>
        <button
          type="submit"
          className="rounded-full bg-spice px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
        >
          Recommend Recipes
        </button>
      </div>
    </form>
  );
}
