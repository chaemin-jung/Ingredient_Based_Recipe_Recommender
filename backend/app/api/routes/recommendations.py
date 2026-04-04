from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.recommendation import RecommendationRequest, RecommendationResult
from app.services.recommendation_engine import recommend_recipes

router = APIRouter(tags=["recommendations"])


@router.post("/recommend", response_model=list[RecommendationResult])
def recommend(payload: RecommendationRequest, db: Session = Depends(get_db)) -> list[RecommendationResult]:
    return recommend_recipes(db=db, request=payload)
