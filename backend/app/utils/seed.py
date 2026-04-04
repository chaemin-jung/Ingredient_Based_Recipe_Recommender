from sqlalchemy.orm import Session

from app.models.ingredient import Ingredient
from app.models.recipe import Recipe, RecipeIngredient

SEED_RECIPES = [
    {
        "name": "Tomato Basil Pasta",
        "cuisine": "Italian",
        "difficulty": "Easy",
        "cook_time": 25,
        "instructions": "\n".join(
            [
                "Boil the pasta until al dente.",
                "Saute garlic in olive oil and add tomatoes.",
                "Stir in basil, toss with pasta, and season to taste.",
            ]
        ),
        "ingredients": {
            "pasta": "200 g",
            "tomato": "2 cups",
            "garlic": "2 cloves",
            "olive oil": "2 tbsp",
            "basil": "1/4 cup",
            "parmesan": "1/4 cup",
        },
    },
    {
        "name": "Veggie Omelette",
        "cuisine": "American",
        "difficulty": "Easy",
        "cook_time": 15,
        "instructions": "\n".join(
            [
                "Whisk eggs with salt and pepper.",
                "Cook onion, spinach, and bell pepper in a skillet.",
                "Pour in the eggs, fold, and finish with cheese.",
            ]
        ),
        "ingredients": {
            "egg": "3",
            "spinach": "1 cup",
            "bell pepper": "1/2 cup",
            "onion": "1/4 cup",
            "cheddar": "1/4 cup",
            "butter": "1 tbsp",
        },
    },
    {
        "name": "Chicken Fried Rice",
        "cuisine": "Asian",
        "difficulty": "Medium",
        "cook_time": 30,
        "instructions": "\n".join(
            [
                "Cook chicken until browned and set aside.",
                "Saute vegetables, then add rice and soy sauce.",
                "Stir in chicken and scrambled egg until hot.",
            ]
        ),
        "ingredients": {
            "chicken": "200 g",
            "rice": "2 cups",
            "soy sauce": "2 tbsp",
            "egg": "2",
            "carrot": "1/2 cup",
            "peas": "1/2 cup",
            "garlic": "2 cloves",
        },
    },
    {
        "name": "Black Bean Tacos",
        "cuisine": "Mexican",
        "difficulty": "Easy",
        "cook_time": 20,
        "instructions": "\n".join(
            [
                "Warm the tortillas in a skillet.",
                "Heat black beans with cumin and garlic.",
                "Assemble tacos with avocado, salsa, and cilantro.",
            ]
        ),
        "ingredients": {
            "tortilla": "6",
            "black beans": "1 can",
            "avocado": "1",
            "salsa": "1/2 cup",
            "cilantro": "1/4 cup",
            "garlic": "1 clove",
            "cumin": "1 tsp",
        },
    },
    {
        "name": "Coconut Lentil Curry",
        "cuisine": "Indian",
        "difficulty": "Medium",
        "cook_time": 35,
        "instructions": "\n".join(
            [
                "Saute onion, garlic, and ginger with curry powder.",
                "Add lentils, tomatoes, and coconut milk.",
                "Simmer until tender and finish with cilantro.",
            ]
        ),
        "ingredients": {
            "lentils": "1 cup",
            "coconut milk": "1 can",
            "tomato": "1 cup",
            "onion": "1/2 cup",
            "garlic": "2 cloves",
            "ginger": "1 tbsp",
            "curry powder": "1 tbsp",
            "cilantro": "1/4 cup",
        },
    },
    {
        "name": "Garlic Butter Salmon",
        "cuisine": "Mediterranean",
        "difficulty": "Medium",
        "cook_time": 25,
        "instructions": "\n".join(
            [
                "Season salmon and sear in a hot pan.",
                "Add butter, garlic, and lemon juice.",
                "Serve with parsley spooned over the top.",
            ]
        ),
        "ingredients": {
            "salmon": "2 fillets",
            "garlic": "3 cloves",
            "butter": "2 tbsp",
            "lemon": "1",
            "parsley": "2 tbsp",
            "olive oil": "1 tbsp",
        },
    },
]


def seed_recipes(db: Session) -> None:
    if db.query(Recipe).count() > 0:
        return

    ingredient_cache: dict[str, Ingredient] = {}

    for recipe_payload in SEED_RECIPES:
        recipe = Recipe(
            name=recipe_payload["name"],
            instructions=recipe_payload["instructions"],
            cuisine=recipe_payload["cuisine"],
            difficulty=recipe_payload["difficulty"],
            cook_time=recipe_payload["cook_time"],
        )
        db.add(recipe)
        db.flush()

        for ingredient_name, quantity in recipe_payload["ingredients"].items():
            normalized_name = ingredient_name.lower()
            ingredient = ingredient_cache.get(normalized_name)
            if ingredient is None:
                ingredient = db.query(Ingredient).filter(Ingredient.name == normalized_name).first()
                if ingredient is None:
                    ingredient = Ingredient(name=normalized_name)
                    db.add(ingredient)
                    db.flush()
                ingredient_cache[normalized_name] = ingredient

            db.add(
                RecipeIngredient(
                    recipe_id=recipe.id,
                    ingredient_id=ingredient.id,
                    quantity=quantity,
                )
            )

    db.commit()
