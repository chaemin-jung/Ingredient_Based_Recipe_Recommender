from pydantic import BaseModel, Field, field_validator


class RecommendationRequest(BaseModel):
    ingredients: list[str] = Field(min_length=1)
    max_cook_time: int | None = Field(default=None, gt=0)
    cuisine: str | None = None
    difficulty: str | None = None
    limit: int = Field(default=10, ge=1, le=30)

    @field_validator("ingredients")
    @classmethod
    def normalize_ingredients(cls, ingredients: list[str]) -> list[str]:
        normalized = []
        seen = set()
        for ingredient in ingredients:
            value = ingredient.strip().lower()
            if value and value not in seen:
                normalized.append(value)
                seen.add(value)
        if not normalized:
            raise ValueError("At least one valid ingredient is required.")
        return normalized

    @field_validator("cuisine", "difficulty")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        return value.strip().lower() if value else value


class RecommendationResult(BaseModel):
    id: int
    name: str
    cuisine: str
    difficulty: str
    cook_time: int
    score: float
    matched_ingredients: list[str]
    missing_ingredients: list[str]
