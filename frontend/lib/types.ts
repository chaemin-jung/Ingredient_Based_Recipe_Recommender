export type RecommendationRequest = {
  ingredients: string[];
  max_cook_time?: number;
  cuisine?: string;
  difficulty?: string;
  limit?: number;
};

export type RecommendationResult = {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  cook_time: number;
  score: number;
  matched_ingredients: string[];
  missing_ingredients: string[];
};

export type RecipeDetail = {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  cook_time: number;
  instructions: string[];
  ingredients: Array<{
    name: string;
    quantity: string;
  }>;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type User = {
  id: number;
  email: string;
  full_name: string;
};

export type FavoriteRecipe = {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  cook_time: number;
};
