import os
import httpx
from fastapi import APIRouter, Header, HTTPException
from jose import jwt, JWTError

router = APIRouter()

HANKO_API_URL = os.getenv("HANKO_API_URL")
JWKS_CACHE = None

@router.get("/auth/config")
async def auth_config():
    return {"hanko_api_url": HANKO_API_URL}

async def get_jwks():
    global JWKS_CACHE
    if not JWKS_CACHE and HANKO_API_URL:
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"{HANKO_API_URL}/.well-known/jwks.json")
                if resp.status_code == 200:
                    JWKS_CACHE = resp.json()
            except Exception as e:
                print(f"Error fetching JWKS from Hanko: {e}")
    return JWKS_CACHE

@router.get("/auth/status")
async def auth_status(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
        
    token = authorization.split(" ")[1]
    
    jwks = await get_jwks()
    if not jwks:
        raise HTTPException(status_code=500, detail="Cannot validate token: JWKS unavailable")
        
    try:
        payload = jwt.decode(
            token, 
            jwks, 
            algorithms=["RS256"], 
            options={"verify_aud": False}
        )
        return {"status": "authenticated", "user": payload}
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
