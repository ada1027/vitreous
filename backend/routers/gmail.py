import os
import time
import httpx
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any

from services.gmail_service import scan_inbox
from services.gemini_service import parse_emails, analyze_services

router = APIRouter()

# Load HIBP key from environment
HIBP_API_KEY = os.getenv("HIBP_API_KEY")

noisy_terms = [
    'gmail', 'google', 'apple', 'microsoft', 'yahoo', 'doubleclick', 'amazonaws', 
    'mailchimp', 'sendgrid', 'constantcontact', 'googlemail', 'mailer', 
    'notification', 'noreply'
]

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
            
        # Step 1: Python noise filter & Aggressive Deduplication
        from datetime import datetime, timezone
        import email.utils
        
        def safe_get_dt(dstr: str) -> datetime:
            try:
                dt = email.utils.parsedate_to_datetime(dstr)
                if getattr(dt, "tzinfo", None) is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                return dt
            except Exception:
                return datetime.now(timezone.utc)

        seen_domains = {}
        for item in parsed:
            domain = item.get("domain", "").lower()
            if not domain or any(noise in domain for noise in noisy_terms):
                continue
                
            if domain not in seen_domains:
                seen_domains[domain] = item
            else:
                dt_new = safe_get_dt(item.get("date", ""))
                dt_old = safe_get_dt(seen_domains[domain].get("date", ""))
                if dt_new < dt_old:
                    seen_domains[domain] = item
                    
        filtered_services = list(seen_domains.values())
        print(f"FILTERED & DEDUPED COUNT: {len(filtered_services)}")

        # Step 2: HIBP check for User Email
        user_email = ""
        user_breaches = []
        
        headers = {
            "hibp-api-key": HIBP_API_KEY or "",
            "user-agent": "vitreous-app"
        }
        
        async with httpx.AsyncClient() as async_client:
            # Get user email
            try:
                profile_resp = await async_client.get(
                    "https://gmail.googleapis.com/gmail/v1/users/me/profile",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if profile_resp.status_code == 200:
                    user_email = profile_resp.json().get("emailAddress", "")
            except Exception as e:
                print(f"Failed to fetch user profile: {e}")
                
            # Get user breaches from HIBP
            if user_email and HIBP_API_KEY:
                try:
                    hibp_url = f"https://haveibeenpwned.com/api/v3/breachedaccount/{user_email}?truncateResponse=false"
                    hibp_resp = await async_client.get(hibp_url, headers=headers)
                    if hibp_resp.status_code == 200:
                        user_breaches = hibp_resp.json()
                except Exception as e:
                    print(f"HIBP user email error: {e}")

        # Map breaches to matching services
        for item in filtered_services:
            domain = item.get("domain", "").lower()
            item["is_breached"] = False
            item["breach_count"] = 0
            item["breaches"] = []
            
            matching_breaches = []
            for b in user_breaches:
                b_domain = b.get("Domain", "").lower()
                if b_domain and (b_domain in domain or domain in b_domain):
                    mapped_b = {
                        "Name": b.get("Name"),
                        "BreachDate": b.get("BreachDate"),
                        "DataClasses": b.get("DataClasses", [])
                    }
                    if mapped_b not in matching_breaches:
                        matching_breaches.append(mapped_b)
                        
            if matching_breaches:
                item["is_breached"] = True
                item["breach_count"] = len(matching_breaches)
                item["breaches"] = matching_breaches
                
        enriched_services = filtered_services

        # Step 3: Gemini analysis
        print("Starting Gemini Analysis...")
        analysis = analyze_services(enriched_services, user_email, user_breaches)
        final_services = analysis.get("services", enriched_services)
        insight = analysis.get("insight", "No insights generated.")
        
        # Ensure fallback for missed risk_level strings
        for s in final_services:
            if "risk_level" not in s:
                s["risk_level"] = "low"

        # Step 4: Return Summary
        total_services = len(final_services)
        breached_count = sum(1 for s in final_services if s.get("is_breached", False))
        high_risk_count = sum(1 for s in final_services if str(s.get("risk_level", "")).lower() == "high")
        
        return {
            "summary": {
                "total_services": total_services,
                "breached_count": breached_count,
                "high_risk_count": high_risk_count
            },
            "insight": insight,
            "services": final_services
        }
        
    except Exception as e:
        print(f"Endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
