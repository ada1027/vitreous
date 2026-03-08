import os
import time
import httpx
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List

from services.gmail_service import scan_inbox
from services.gemini_service import parse_emails

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
        import asyncio
        async def execute_scan():
            import time
            start_total = time.time()
            
            print("[DEBUG] Initiating scan_inbox...")
            t0 = time.time()
            raw_emails = await scan_inbox(token)
            t1 = time.time()
            print(f"[DEBUG] scan_inbox completed in {t1 - t0:.2f} seconds. RAW COUNT: {len(raw_emails)}")
            
            try:
                print(f"[DEBUG] Initiating parse_emails with {len(raw_emails)} items...")
                parsed = await parse_emails(raw_emails)
                t2 = time.time()
                print(f"[DEBUG] parse_emails completed in {t2 - t1:.2f} seconds. PARSED COUNT: {len(parsed)}")
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
                        
            filtered_services: List[Dict[str, Any]] = [v for v in seen_domains.values()]
            print(f"FILTERED & DEDUPED COUNT: {len(filtered_services)}")

            # Ensure items have default breach keys
            for item in filtered_services:
                item["is_breached"] = False
                item["breach_count"] = 0
                item["breaches"] = []
                
            enriched_services = filtered_services

            # Step 3: Format Return Values
            final_services = enriched_services
            insight = "Scan complete. Review your connected services below."
            
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

        try:
            return await asyncio.wait_for(execute_scan(), timeout=58.0)
        except asyncio.TimeoutError:
            print("Scan hit overall 58 second timeout wrapper.")
            return {
                "summary": {
                    "total_services": 0,
                    "breached_count": 0,
                    "high_risk_count": 0
                },
                "insight": "Scan timed out after 58 seconds.",
                "services": []
            }
            
    except Exception as e:
        print(f"Endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
