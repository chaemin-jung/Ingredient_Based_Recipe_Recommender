import {
  AuthResponse,
  FavoriteRecipe,
  RecommendationRequest,
  RecommendationResult,
  RecipeDetail,
  User,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "Request failed." }));
    throw new Error(payload.detail ?? "Request failed.");
  }
  return response.json() as Promise<T>;
}

export async function fetchRecommendations(
  payload: RecommendationRequest,
): Promise<RecommendationResult[]> {
  const response = await fetch(`${API_URL}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse<RecommendationResult[]>(response);
}

export async function fetchRecipe(id: string): Promise<RecipeDetail> {
  const response = await fetch(`${API_URL}/recipes/${id}`, { cache: "no-store" });
  return handleResponse<RecipeDetail>(response);
}

export async function registerUser(payload: {
  email: string;
  full_name: string;
  password: string;
}): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<User>(response);
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(response);
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return handleResponse<User>(response);
}

export async function saveFavorite(token: string, recipeId: number): Promise<void> {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipe_id: recipeId }),
  });
  await handleResponse(response);
}

export async function fetchFavorites(token: string): Promise<FavoriteRecipe[]> {
  const response = await fetch(`${API_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return handleResponse<FavoriteRecipe[]>(response);
}
