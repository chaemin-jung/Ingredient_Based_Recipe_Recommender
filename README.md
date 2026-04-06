# Ingredient-Based Recipe Recommender

## Project Structure

```text
Playground/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py
│   │   │   └── routes/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

## Project Overview

Ingredient-Based Recipe Recommender is a full-stack web application that ranks recipes based on the ingredients a user already has. Instead of delegating recommendation quality to an external recipe API, the backend implements a custom weighted matching algorithm and returns scored, filterable results with missing ingredient visibility.

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: SQLite for development, PostgreSQL-ready via `DATABASE_URL`
- Auth: JWT-based authentication

## Architecture

### Backend

- `app/api/routes`: HTTP endpoints for auth, recommendations, recipes, and favorites
- `app/models`: Relational SQLAlchemy models for users, recipes, ingredients, and favorites
- `app/schemas`: Pydantic request and response contracts
- `app/services/recommendation_engine.py`: Custom scoring and ranking logic
- `app/utils/seed.py`: Development seed data for recipes and ingredients

### Frontend

- `app/page.tsx`: Main ingredient search, filters, and ranked recommendation results
- `app/recipes/[id]/page.tsx`: Recipe detail experience
- `app/auth/*`: Login and registration pages
- `components/*`: Reusable UI pieces for forms, result cards, favorites, and layout
- `lib/api.ts`: Typed backend API client

## Recommendation Algorithm

The backend ranks recipes using this required weighted formula:

```text
score = (matched_ingredients / total_ingredients) * 0.7
      + (1 - missing_ingredients / total_ingredients) * 0.3
```

Implementation notes:

- Ingredient matching is normalized to lowercase
- Duplicate user ingredients are removed before scoring
- Recipes with zero matched ingredients are excluded from recommendations
- Final sorting uses score first, then matched count and recipe practicality as tie-breakers

## Database Schema

### Core tables

- `recipes (id, name, instructions, cuisine, difficulty, cook_time)`
- `ingredients (id, name)`
- `recipe_ingredients (recipe_id, ingredient_id, quantity)`
- `users (id, email, full_name, hashed_password)`
- `favorite_recipes (id, user_id, recipe_id, created_at)`

### Relationship model

- One recipe has many recipe ingredients
- One ingredient can belong to many recipes
- One user can save many favorite recipes

## API Endpoints

- `POST /recommend`: Ranked recipe recommendations with score, matches, and missing ingredients
- `GET /recipes/{id}`: Detailed recipe information
- `POST /auth/register`: Create a new user
- `POST /auth/login`: Authenticate and receive a JWT
- `GET /auth/me`: Retrieve the current authenticated user
- `POST /favorites`: Save a recipe to favorites
- `GET /favorites`: Retrieve a user's saved recipes
- `GET /health`: Service health check

## How To Run Locally

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

The backend starts at [http://localhost:8000](http://localhost:8000). On startup it creates the SQLite database and seeds sample recipe data.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend starts at [http://localhost:3000](http://localhost:3000).

## Production Notes

- Replace SQLite with PostgreSQL by setting `DATABASE_URL`
- Replace `SECRET_KEY` with a long production secret
- Add Alembic migrations before shipping to production
- Tighten CORS origins and auth/session policies per deployment environment

## Example Recommendation Flow

1. User enters ingredients such as `egg, spinach, onion, butter`
2. Frontend sends a typed request to `POST /recommend`
3. Backend filters recipes, computes weighted scores, and returns ranked results
4. UI shows match score, matched ingredients, and missing ingredients
5. Authenticated users can save recipes to favorites

## Link
https://ingredient-based-recipe-recommender.vercel.app/