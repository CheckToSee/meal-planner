from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import stores, mealplan

load_dotenv()
app = FastAPI(title="Meal Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stores.router, prefix="/stores", tags=["stores"])
app.include_router(mealplan.router, prefix="/mealplan", tags=["mealplan"])

@app.get("/health")
def health():
    return {"status": "ok"}
