"use client";

type FilterState = {
  maxCookTime: string;
  cuisine: string;
  difficulty: string;
};

type FilterPanelProps = {
  value: FilterState;
  onChange: (value: FilterState) => void;
};

export function FilterPanel({ value, onChange }: FilterPanelProps) {
  return (
    <div className="grid gap-4 rounded-[2rem] bg-white/70 p-6 shadow-soft md:grid-cols-3">
      <label className="text-sm font-medium text-ink">
        Max cook time
        <input
          type="number"
          min="1"
          value={value.maxCookTime}
          onChange={(event) => onChange({ ...value, maxCookTime: event.target.value })}
          placeholder="30"
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-sand/50 px-4 py-3"
        />
      </label>
      <label className="text-sm font-medium text-ink">
        Cuisine
        <select
          value={value.cuisine}
          onChange={(event) => onChange({ ...value, cuisine: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-sand/50 px-4 py-3"
        >
          <option value="">Any cuisine</option>
          <option value="italian">Italian</option>
          <option value="american">American</option>
          <option value="asian">Asian</option>
          <option value="mexican">Mexican</option>
          <option value="indian">Indian</option>
          <option value="mediterranean">Mediterranean</option>
        </select>
      </label>
      <label className="text-sm font-medium text-ink">
        Difficulty
        <select
          value={value.difficulty}
          onChange={(event) => onChange({ ...value, difficulty: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-sand/50 px-4 py-3"
        >
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
    </div>
  );
}
