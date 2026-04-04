"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { clearToken, getToken } from "@/lib/auth";
import { fetchCurrentUser } from "@/lib/api";
import { User } from "@/lib/types";

export function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    fetchCurrentUser(token).then(setUser).catch(() => clearToken());
  }, []);

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-8">
      <Link href="/" className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-herb">Pantry Precision</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">
          Ingredient-Based Recipe Recommender
        </h1>
      </Link>

      <nav className="flex items-center gap-3 text-sm font-medium">
        {user ? (
          <>
            <span className="hidden rounded-full bg-white/80 px-3 py-2 text-ink shadow-soft sm:inline-flex">
              {user.full_name}
            </span>
            <button
              type="button"
              onClick={() => {
                clearToken();
                window.location.reload();
              }}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-ink transition hover:border-spice hover:text-spice"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="rounded-full px-4 py-2 text-ink transition hover:text-spice">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-ink px-4 py-2 text-white transition hover:bg-spice"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
