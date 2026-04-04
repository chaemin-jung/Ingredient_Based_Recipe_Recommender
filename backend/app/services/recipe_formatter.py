from app.models.recipe import Recipe
from app.schemas.recipe import RecipeDetail, RecipeIngredientItem, RecipeSummary


def build_recipe_summary(recipe: Recipe) -> RecipeSummary:
    return RecipeSummary.model_validate(recipe)


def build_recipe_detail(recipe: Recipe) -> RecipeDetail:
    ingredients = [
        RecipeIngredientItem(name=item.ingredient.name, quantity=item.quantity)
        for item in sorted(recipe.recipe_ingredients, key=lambda link: link.ingredient.name)
    ]
    steps = [step.strip() for step in recipe.instructions.split("\n") if step.strip()]
    return RecipeDetail(
        id=recipe.id,
        name=recipe.name,
        cuisine=recipe.cuisine,
        difficulty=recipe.difficulty,
        cook_time=recipe.cook_time,
        instructions=steps,
        ingredients=ingredients,
    )
