from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.claude import generate_meal_plan

router = APIRouter()

class MealPlanRequest(BaseModel):
    store_id: str
    budget: float
    num_people: int
    num_of_kids: int
    kid_friendly: bool
    dietary: list[str] = []
    allergies: list[str] = []
    cuisines: list[str] = []


@router.post("/generate")
def generate(request: MealPlanRequest):
    try:
        preferences = {
            "budget": request.budget,
            "num_people": request.num_people,
            "kid_friendly": request.kid_friendly,
            "dietary": request.dietary,
            "allergies": request.allergies,
            "cuisines": request.cuisines,
            "num_of_kids": request.num_of_kids,
        } 
        meal_plan = generate_meal_plan(request.store_id, preferences)
        return meal_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
