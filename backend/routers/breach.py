import os
import httpx  # type: ignore
from fastapi import APIRouter, HTTPException, Query  # type: ignore
from typing import Dict, Any

router = APIRouter()

HIBP_API_KEY = os.getenv("HIBP_API_KEY")

@router.get("/check-domain")
async def check_domain(domain: str = Query(..., description="The domain to check against HIBP")) -> Dict[str, Any]:
    if not domain:
        raise HTTPException(status_code=400, detail="Missing domain parameter")
        
    if not HIBP_API_KEY:
        return {"is_breached": False, "breach_count": 0, "breaches": []}
        
    try:
        hibp_url = f"https://haveibeenpwned.com/api/v3/breaches?domain={domain}"
        headers = {
            "hibp-api-key": HIBP_API_KEY,
            "user-agent": "vitreous-app"
        }
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(hibp_url, headers=headers)
            
            if resp.status_code == 200:
                breaches = resp.json()
                if breaches and isinstance(breaches, list):
                    mapped_breaches = []
                    for b in breaches:
                        mapped_breaches.append({
                            "Name": b.get("Name"),
                            "BreachDate": b.get("BreachDate"),
                            "DataClasses": b.get("DataClasses", []),
                            "Description": b.get("Description", "")
                        })
                    return {
                        "is_breached": True,
                        "breach_count": len(mapped_breaches),
                        "breaches": mapped_breaches
                    }
            elif resp.status_code == 404:
                return {"is_breached": False, "breach_count": 0, "breaches": []}
            else:
                print(f"HIBP returned status {resp.status_code} for domain {domain}")
                
    except Exception as e:
        print(f"HIBP lookup error for {domain}: {e}")
        
    return {"is_breached": False, "breach_count": 0, "breaches": []}

@router.get("/{email}")
async def get_breach(email: str):
    return [
        {"name": "LinkedIn Data Breach", "year": 2012, "data_classes": ["Email addresses", "Passwords"], "pwn_count": 164000000},
        {"name": "Adobe Systems", "year": 2013, "data_classes": ["Email addresses", "Passwords", "Password hints", "Usernames"], "pwn_count": 152000000}
    ]
