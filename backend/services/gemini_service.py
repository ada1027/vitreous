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
