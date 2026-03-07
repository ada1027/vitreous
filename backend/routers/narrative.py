from fastapi import APIRouter

router = APIRouter()

@router.post("/narrative/generate")
async def generate_narrative():
    return {"narrative": "Based on your data, your LinkedIn account might be at risk from a 2012 breach. We recommend changing your passwords."}
