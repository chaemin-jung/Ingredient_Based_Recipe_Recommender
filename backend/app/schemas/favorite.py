from pydantic import BaseModel, Field


class FavoriteCreate(BaseModel):
    recipe_id: int = Field(gt=0)


class FavoriteResponse(BaseModel):
    message: str
    recipe_id: int
