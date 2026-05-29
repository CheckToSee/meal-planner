from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.kroger import find_nearby_stores

router = APIRouter()

class LocationRequest(BaseModel):
    zip_code: str

@router.post("/nearby")
def get_nearby_stores(request: LocationRequest):
    try:
        stores = find_nearby_stores(request.zip_code)
        return {"stores": stores}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
