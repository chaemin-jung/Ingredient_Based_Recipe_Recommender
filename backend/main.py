from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.favorites import router as favorites_router
from app.api.routes.recipes import router as recipes_router
from app.api.routes.recommendations import router as recommendations_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.utils.seed import seed_recipes

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(recommendations_router)
app.include_router(recipes_router)
app.include_router(favorites_router)


@app.on_event("startup")
def startup_event() -> None:
    with SessionLocal() as db:
        seed_recipes(db)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
