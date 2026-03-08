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

def parse_emails(emails: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    if not emails or not GEMINI_API_KEY:
        return []
        
    prompt = (
        "Extract structured data from these emails. For each email return a JSON array "
        "with objects containing: service_name (the company name), domain (sender domain only, e.g. canva.com), "
        "type (signup, payment, newsletter, or other), date. Return only valid JSON array, "
        "no explanation, no markdown."
    )
    
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    all_results = []
    
    # Process in batches of 50
    batch_size = 50
    for i in range(0, len(emails), batch_size):
        batch = emails[i:i + batch_size]
        
        # Prepare the data for the model
        batch_text = json.dumps(batch, indent=2)
        full_prompt = f"{prompt}\n\nEmails data:\n{batch_text}"
        
        try:
            response = model.generate_content(full_prompt)
            # Remove possible markdown fences from response if model still wraps it
            response_text = response.text.replace("```json", "").replace("```", "").strip()
            
            parsed_batch = json.loads(response_text)
            if isinstance(parsed_batch, list):
                all_results.extend(parsed_batch)
        except json.JSONDecodeError as e:
            print(f"Failed to parse Gemini JSON response for batch {i // batch_size}: {e}")
        except Exception as e:
            print(f"Error calling Gemini for batch {i // batch_size}: {e}")
            
    return all_results

from typing import List, Dict, Any, Optional

def analyze_services(services: List[Dict[str, Any]], user_email: str = "", user_breaches: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    if not services or not GEMINI_API_KEY:
        return {"insight": "No services found or Gemini API key missing.", "services": services}
        
    user_breaches = user_breaches or []
        
    prompt = (
        "You are a security analyst reviewing a user's digital footprint. "
        f"The user's primary email address is {user_email}. "
        f"Here is their full raw Have I Been Pwned breach history across all accounts: {json.dumps(user_breaches)}.\n"
        "Given this list of services including breach data, evaluate risk and return exactly these fields:\n\n"
        "1. Use exactly these seven categories: 'work_productivity', 'finance', 'shopping', 'social', 'education', 'developer_tools', 'other'.\n\n"
        "2. Assess risk_level using this framework — risk is determined by DATA SENSITIVITY multiplied by COMPANY RELIABILITY, not category alone:\n"
        "- COMPANY RELIABILITY: Well-known companies with dedicated security teams, regulatory compliance, and established breach response (major banks, Google, Amazon, GitHub, big social platforms) have HIGH reliability meaning lower risk from company failure. Small obscure services, unknown startups, one-time checkout processors, local businesses with no visible security posture have LOW reliability meaning higher risk — if they get breached you will never find out.\n"
        "- DATA SENSITIVITY: Financial data and payment methods = very sensitive. Login credentials that unlock other accounts = very sensitive. Professional identity and private communications = sensitive. Personal info like name, address, DOB = moderate. Just an email address = low.\n"
        "- RISK COMBINATIONS:\n"
        "  * Small unknown service + any payment data = HIGH.\n"
        "  * Small unknown service + just email = MEDIUM.\n"
        "  * Well-known company + payment data = MEDIUM (they will protect it and notify you).\n"
        "  * Well-known company + just email = LOW.\n"
        "  * Any service where is_breached is true = always HIGH.\n"
        "  * Developer tools like GitHub, Vercel, MongoDB, ngrok = HIGH because they hold API keys, code, and credentials regardless of company size.\n\n"
        "3. For priority_action: be specific to the actual service and the actual risk reason. Do not give generic 2FA advice for everything. "
        "For small unknown payment processors say 'Check if this charge is still recurring and consider removing your card — this service has no visible security posture.' "
        "For ghost accounts say 'This account has been inactive since {last_seen} — log in and delete it to shrink your attack surface.' "
        "For breached services say exactly what leaked and what to do about it specifically.\n\n"
        "4. For insight: sentence 1 = single most urgent action right now. Sentence 2 = the most important pattern across their accounts — look for things like many small payment processors, lots of old forgotten accounts, or a cluster of breached services from the same era. Sentence 3 = one specific thing they probably did not know about their own footprint.\n\n"
        "Preserve all existing fields including is_ghost, first_seen, last_seen. Sort by risk_level high first. "
        "Return only a valid JSON object with exactly two keys: insight (string) and services (array of objects with exactly the fields: category, risk_level, priority_action, display_name, plus the existing fields). No explanation, no markdown, no extra text."
    )
    
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    services_text = json.dumps(services, indent=2)
    full_prompt = f"{prompt}\n\nServices data:\n{services_text}"
    
    try:
        response = model.generate_content(full_prompt)
        print(f"GEMINI RAW RESPONSE: {response.text[:500]}...")
        response_text = response.text.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(response_text)
        return parsed
    except Exception as e:
        print(f"Error calling Gemini for analysis: {e}")
        return {"insight": f"Analysis failed: {str(e)}", "services": services}
