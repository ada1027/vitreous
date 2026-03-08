from fastapi import APIRouter, HTTPException, Query

from services.gmail_service import scan_inbox
from services.gemini_service import parse_emails

router = APIRouter()

@router.get("/gmail/scan")
async def gmail_scan(token: str = Query(..., description="The Google OAuth access token")):
    if not token:
        raise HTTPException(status_code=400, detail="Missing token query parameter")
        
    try:
        raw_emails = await scan_inbox(token)
        print(f"RAW COUNT: {len(raw_emails)}")
        
        try:
            parsed = parse_emails(raw_emails)
            print(f"PARSED COUNT: {len(parsed)}")
            print(f"FIRST ITEM: {parsed[0] if parsed else None}")
        except Exception as e:
            print(f"Error parsing emails with Gemini: {e}")
            raise HTTPException(status_code=500, detail=f"Gemini parsing failed: {e}")
            
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
