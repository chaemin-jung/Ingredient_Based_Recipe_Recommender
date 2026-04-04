from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.favorite import FavoriteRecipe
from app.models.recipe import Recipe
from app.models.user import User
from app.schemas.favorite import FavoriteCreate, FavoriteResponse
from app.schemas.recipe import RecipeSummary
from app.services.recipe_formatter import build_recipe_summary

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=list[RecipeSummary])
def list_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[RecipeSummary]:
    favorites = (
        db.query(FavoriteRecipe)
        .filter(FavoriteRecipe.user_id == current_user.id)
        .order_by(FavoriteRecipe.created_at.desc())
        .all()
    )
    return [build_recipe_summary(favorite.recipe) for favorite in favorites]


@router.post("", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def save_favorite(
    payload: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FavoriteResponse:
    recipe = db.query(Recipe).filter(Recipe.id == payload.recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found.")

    existing = (
        db.query(FavoriteRecipe)
        .filter(
            FavoriteRecipe.user_id == current_user.id,
            FavoriteRecipe.recipe_id == payload.recipe_id,
        )
        .first()
    )
    if existing:
        return FavoriteResponse(message="Recipe already saved.", recipe_id=payload.recipe_id)

    favorite = FavoriteRecipe(user_id=current_user.id, recipe_id=payload.recipe_id)
    db.add(favorite)
    db.commit()
    return FavoriteResponse(message="Recipe saved to favorites.", recipe_id=payload.recipe_id)
