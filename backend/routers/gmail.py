from fastapi import APIRouter, HTTPException, Query

from services.gmail_service import scan_inbox

router = APIRouter()

@router.get("/gmail/scan")
async def gmail_scan(token: str = Query(..., description="The Google OAuth access token")):
    if not token:
        raise HTTPException(status_code=400, detail="Missing token query parameter")
        
    try:
        results = await scan_inbox(token)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
