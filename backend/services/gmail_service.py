import httpx
import asyncio
from typing import List, Dict, Any
from datetime import datetime

def _extract_domain(from_header: str) -> str:
    # Basic extraction: grab anything between @ and > or to the end of the string
    if "@" in from_header:
        parts = from_header.split("@")
        if len(parts) > 1:
            domain_part = parts[-1].split(">")[0].strip()
            return domain_part.lower()
    return from_header.lower()

def _parse_date(date_str: str) -> datetime:
    # Try parsing common email date formats to allow sorting
    import email.utils
    parsed = email.utils.parsedate_to_datetime(date_str)
    if parsed:
        return parsed
    # Fallback to current time if unparseable
    return datetime.now()

async def scan_inbox(access_token: str) -> List[Dict[str, Any]]:
    headers = {"Authorization": f"Bearer {access_token}"}
    messages_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages"
    
    queries = [
        "subject:(welcome OR \"thanks for signing up\" OR \"verify your email\" OR \"activate your account\")",
        "subject:(receipt OR invoice OR \"payment confirmation\" OR \"subscription renewed\" OR \"billing\")",
        "unsubscribe before:2020/01/01",
        "subject:(account OR login OR \"sign in\" OR security)",
        "unsubscribe after:2020/01/01 before:2022/06/01",
        "unsubscribe after:2022/06/01 before:2024/01/01"
    ]
    
    async with httpx.AsyncClient() as client:
        async def fetch_ids(query):
            params = {"q": query, "maxResults": 50}
            resp = await client.get(messages_url, headers=headers, params=params)
            if resp.status_code == 200:
                return resp.json().get("messages", [])
            return []
            
        results_lists = await asyncio.gather(*[fetch_ids(q) for q in queries])
        
        unique_message_ids = set()
        messages_to_fetch = []
        for lst in results_lists:
            if lst:
                for msg in lst:
                    if msg["id"] not in unique_message_ids:
                        unique_message_ids.add(msg["id"])
                        messages_to_fetch.append(msg)
                        
        extracted_results = []
        for msg in messages_to_fetch:
            msg_id = msg["id"]
            msg_url = f"{messages_url}/{msg_id}"
            
            msg_params = [
                ("format", "metadata"),
                ("metadataHeaders", "From"),
                ("metadataHeaders", "Subject"),
                ("metadataHeaders", "Date")
            ]
            
            msg_response = await client.get(msg_url, headers=headers, params=msg_params)
            if msg_response.status_code != 200:
                continue
                
            msg_data = msg_response.json()
            payload = msg_data.get("payload", {})
            headers_list = payload.get("headers", [])
            
            extracted = {
                "from_address": "",
                "subject": "",
                "date": ""
            }
            
            for h in headers_list:
                name = h.get("name", "")
                value = h.get("value", "")
                if name.lower() == "from":
                    extracted["from_address"] = value
                elif name.lower() == "subject":
                    extracted["subject"] = value
                elif name.lower() == "date":
                    extracted["date"] = value
                    
            extracted_results.append(extracted)
            
        # Deduplicate by domain keeping the first occurrence
        domain_map = {}
        for item in extracted_results:
            domain = _extract_domain(item["from_address"])
            
            if domain not in domain_map:
                domain_map[domain] = item
                    
        # Return up to 150 unique domains based on insertion order (first match)
        final_results = []
        for x in domain_map.values():
            if len(final_results) >= 150:
                break
            if isinstance(x, dict):
                final_results.append(x)
        
        return final_results
