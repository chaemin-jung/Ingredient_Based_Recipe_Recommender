from pydantic import BaseModel, ConfigDict


class RecipeIngredientItem(BaseModel):
    name: str
    quantity: str


class RecipeSummary(BaseModel):
    id: int
    name: str
    cuisine: str
    difficulty: str
    cook_time: int

    model_config = ConfigDict(from_attributes=True)


class RecipeDetail(RecipeSummary):
    instructions: list[str]
    ingredients: list[RecipeIngredientItem]
