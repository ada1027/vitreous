from fastapi import APIRouter

router = APIRouter()

@router.get("/google/auth")
async def google_auth():
    return {"oauth_url": "https://accounts.google.com/o/oauth2/v2/auth?mock=true"}
