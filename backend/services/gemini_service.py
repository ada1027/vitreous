import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY is not set.")

import asyncio

async def parse_emails(emails: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    if not emails or not GEMINI_API_KEY:
        return []
        
    prompt = (
        "Extract structured data from these emails. For each email return a JSON array "
        "with objects containing: service_name (the company name), domain (sender domain only, e.g. canva.com), "
        "type (signup, payment, newsletter, or other), date. Return only valid JSON array, "
        "no explanation, no markdown."
    )
    
    import time
    import itertools
    model = genai.GenerativeModel("gemini-2.5-flash")
    all_results = []
    
    async def process_batch(batch: List[Dict[str, str]], index: int) -> List[Dict[str, Any]]:
        batch_text = json.dumps(batch, indent=2)
        full_prompt = f"{prompt}\n\nEmails data:\n{batch_text}"
        bt0 = time.time()
        try:
            # Enforce strict 45s timeout on the Gemini call itself
            import asyncio
            response = await asyncio.wait_for(model.generate_content_async(full_prompt), timeout=45.0)
            print(f"[DEBUG] Gemini generated response for batch {index} in {time.time() - bt0:.2f}s")
            response_text = response.text.replace("```json", "").replace("```", "").strip()
            parsed_batch = json.loads(response_text)
            if isinstance(parsed_batch, list):
                return parsed_batch
            return []
        except asyncio.TimeoutError:
            print(f"Gemini generation strictly timed out for batch {index} after 45s!")
            return []
        except json.JSONDecodeError as e:
            print(f"Failed to parse Gemini JSON response for batch {index}: {e}")
            return []
        except Exception as e:
            print(f"Error calling Gemini for batch {index}: {e}")
            return []

    # Process in batches of 10
    batch_size = 10
    tasks = []
    for i in range(0, len(emails), batch_size):
        batch = emails[i:i + batch_size]
        tasks.append(process_batch(batch, i // batch_size))
        
    if tasks:
        results = await asyncio.gather(*tasks)
        for r in results:
            all_results.extend(r)
            
    return all_results

from typing import List, Dict, Any, Optional

async def analyze_services(services: List[Dict[str, Any]], user_email: str = "", user_breaches: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    if not services or not GEMINI_API_KEY:
        return {"insight": "No services found or Gemini API key missing.", "services": services}
        
    user_breaches = user_breaches or []
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    async def process_batch(batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        prompt = (
            "You are a security analyst reviewing a user's digital footprint. "
            f"The user's primary email address is {user_email}. "
            f"Here is their full raw Have I Been Pwned breach history across all accounts: {json.dumps(user_breaches)}.\n"
            "Given this list of services including breach data, evaluate risk and return exactly these fields:\n\n"
            "1. Use exactly these seven categories: 'work_productivity', 'finance', 'shopping', 'social', 'education', 'developer_tools', 'other'.\n\n"
            "2. Assess risk_level using this framework:\n"
            "- COMPANY RELIABILITY: Well-known companies have HIGH reliability (lower risk). Small obscure services have LOW reliability (higher risk).\n"
            "- DATA SENSITIVITY: Financial/Payment/Login credentials = very sensitive. Professional/Personal info = moderate. Just email = low.\n"
            "- RISK COMBINATIONS: Any breached service = HIGH. Developer tools = HIGH. Small unknown + payment/email = HIGH/MEDIUM.\n"
            "3. For priority_action: be specific to the actual service. "
            "Preserve all existing fields including is_ghost, first_seen, last_seen. "
            "Return only a valid JSON array of objects with exactly the fields: category, risk_level, priority_action, display_name, plus the existing fields. No explanation, no markdown, no extra text."
        )
        
        services_text = json.dumps(batch, indent=2)
        full_prompt = f"{prompt}\n\nServices data:\n{services_text}"
        
        try:
            response = await model.generate_content_async(full_prompt)
            response_text = response.text.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(response_text)
            if isinstance(parsed, list):
                return parsed
            return batch
        except Exception as e:
            print(f"Error calling Gemini for analysis batch: {e}")
            return batch

    # Process in batches of 40
    batch_size = 40
    tasks = []
    for i in range(0, len(services), batch_size):
        batch = services[i:i + batch_size]
        tasks.append(process_batch(batch))
        
    all_analyzed_services = []
    if tasks:
        results = await asyncio.gather(*tasks)
        for r in results:
            all_analyzed_services.extend(r)
            
    # Then get the insight
    insight_prompt = (
        "You are a security analyst. Given these categorized services and breach data, give a 3-sentence insight. "
        "Sentence 1: single most urgent action right now. "
        "Sentence 2: most important pattern across their accounts. "
        "Sentence 3: one specific thing they probably did not know about their own footprint. "
        "Return ONLY the string of the insight. No prefix, no markdown."
    )
    
    try:
        # Pass a subset of the fields to avoid massive tokens just for insight
        simplified_services = [{"name": s.get("display_name", s.get("domain")), "risk": s.get("risk_level"), "breached": s.get("is_breached")} for s in all_analyzed_services]
        insight_response = await model.generate_content_async(f"{insight_prompt}\n\nServices:\n{json.dumps(simplified_services, indent=2)}")
        insight = insight_response.text.strip()
    except Exception as e:
        print(f"Error getting insight: {e}")
        insight = "Analysis complete, please review your services below."
        
    all_analyzed_services.sort(key=lambda x: str(x.get("risk_level", "low")).lower() == "high", reverse=True)
        
    return {"insight": insight, "services": all_analyzed_services}
