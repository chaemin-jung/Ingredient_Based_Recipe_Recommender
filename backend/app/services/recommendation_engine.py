from sqlalchemy.orm import Session, joinedload

from app.models.recipe import Recipe, RecipeIngredient
from app.schemas.recommendation import RecommendationRequest, RecommendationResult

MATCH_WEIGHT = 0.7
MISSING_WEIGHT = 0.3


def calculate_recipe_score(
    available_ingredients: set[str],
    recipe_ingredient_names: list[str],
) -> tuple[float, list[str], list[str]]:
    total_ingredients = len(recipe_ingredient_names)
    if total_ingredients == 0:
        return 0.0, [], []

    recipe_ingredients = {name.lower() for name in recipe_ingredient_names}
    matched = sorted(recipe_ingredients.intersection(available_ingredients))
    missing = sorted(recipe_ingredients.difference(available_ingredients))

    matched_count = len(matched)
    missing_count = len(missing)

    score = (matched_count / total_ingredients) * MATCH_WEIGHT + (
        1 - missing_count / total_ingredients
    ) * MISSING_WEIGHT
    return round(score, 4), matched, missing


def recommend_recipes(db: Session, request: RecommendationRequest) -> list[RecommendationResult]:
    query = db.query(Recipe).options(joinedload(Recipe.recipe_ingredients).joinedload(RecipeIngredient.ingredient))

    if request.max_cook_time:
        query = query.filter(Recipe.cook_time <= request.max_cook_time)
    if request.cuisine:
        query = query.filter(Recipe.cuisine.ilike(request.cuisine))
    if request.difficulty:
        query = query.filter(Recipe.difficulty.ilike(request.difficulty))

    available_ingredients = set(request.ingredients)
    recommendations: list[RecommendationResult] = []

    for recipe in query.all():
        ingredient_names = [link.ingredient.name for link in recipe.recipe_ingredients]
        score, matched, missing = calculate_recipe_score(available_ingredients, ingredient_names)
        if not matched:
            continue
        recommendations.append(
            RecommendationResult(
                id=recipe.id,
                name=recipe.name,
                cuisine=recipe.cuisine,
                difficulty=recipe.difficulty,
                cook_time=recipe.cook_time,
                score=score,
                matched_ingredients=matched,
                missing_ingredients=missing,
            )
        )

    recommendations.sort(
        key=lambda item: (
            item.score,
            len(item.matched_ingredients),
            -len(item.missing_ingredients),
            -item.cook_time,
        ),
        reverse=True,
    )
    return recommendations[: request.limit]
