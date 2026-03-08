import httpx  # type: ignore
import asyncio
from typing import List, Dict, Any, Optional
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
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        messages_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages"
        
        queries = [
            ("unsubscribe", 30),
            ("subject:(receipt OR invoice OR payment)", 20)
        ]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            async def fetch_ids(query: str, max_res: int) -> List[Dict[str, Any]]:
                params = {"q": query, "maxResults": max_res}
                resp = await client.get(messages_url, headers=headers, params=params)
                if resp.status_code == 200:
                    return resp.json().get("messages", [])
                return []
                
            fetch_ids_tasks = [fetch_ids(q, m) for q, m in queries]
            results_lists: List[List[Dict[str, Any]]] = await asyncio.gather(*fetch_ids_tasks)  # type: ignore
            
            unique_message_ids = set()
            messages_to_fetch: List[Dict[str, Any]] = []
            for lst in results_lists:
                if lst:
                    for msg in lst:
                        if len(messages_to_fetch) >= 40:
                            break
                        if msg["id"] not in unique_message_ids:
                            unique_message_ids.add(msg["id"])
                            messages_to_fetch.append(msg)
                    if len(messages_to_fetch) >= 40:
                        break
                        
            extracted_results: List[Dict[str, str]] = []
            sem = asyncio.Semaphore(10)
            
            async def fetch_message_metadata(msg: Dict[str, Any]) -> Optional[Dict[str, str]]:
                msg_id = msg["id"]
                msg_url = f"{messages_url}/{msg_id}"
                
                msg_params = [
                    ("format", "metadata"),
                    ("metadataHeaders", "From"),
                    ("metadataHeaders", "Subject"),
                    ("metadataHeaders", "Date")
                ]
                
                async with sem:
                    msg_response = await client.get(msg_url, headers=headers, params=msg_params)
                
                if msg_response.status_code != 200:
                    return None
                    
                msg_data = msg_response.json()
                payload = msg_data.get("payload", {})
                headers_list = payload.get("headers", [])
                
                extracted: Dict[str, str] = {
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
                
                return extracted
                
            fetch_tasks = [fetch_message_metadata(msg) for msg in messages_to_fetch]
            if fetch_tasks:
                fetched_results: List[Optional[Dict[str, str]]] = await asyncio.gather(*fetch_tasks)  # type: ignore
                extracted_results = [res for res in fetched_results if res is not None]
                        
            # Deduplicate by domain tracking first_seen and last_seen
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

            domain_map: Dict[str, Dict[str, Any]] = {}
            for item in extracted_results:
                domain = _extract_domain(item.get("from_address", ""))
                date_str = item.get("date", "")
                if not domain:
                    continue
                    
                if domain not in domain_map:
                    item_copy: Dict[str, Any] = {}
                    item_copy.update(item)
                    item_copy["first_seen"] = date_str
                    item_copy["last_seen"] = date_str
                    item_copy["is_ghost"] = False
                    domain_map[domain] = item_copy
                else:
                    existing = domain_map[domain]
                    dt_new = safe_get_dt(date_str)
                    dt_first = safe_get_dt(str(existing.get("first_seen", "")))
                    dt_last = safe_get_dt(str(existing.get("last_seen", "")))
                    
                    if dt_new < dt_first:
                        existing["first_seen"] = date_str
                    if dt_new > dt_last:
                        existing["last_seen"] = date_str
                        
                    domain_map[domain] = existing
                    
            # Evaluate is_ghost for all domains
            for k, v in domain_map.items():
                dt_first = safe_get_dt(str(v.get("first_seen", "")))
                dt_last = safe_get_dt(str(v.get("last_seen", "")))
                # If both first and last seen are before 2024
                if dt_first.year < 2024 and dt_last.year < 2024:
                    v["is_ghost"] = True
                        
            # Return up to 150 unique domains based on insertion order
            final_results: List[Dict[str, Any]] = []
            for x in domain_map.values():
                if len(final_results) >= 150:
                    break
                final_results.append(x)
            
            return final_results
    except Exception as e:
        print(f"Error in scan_inbox: {e}")
        return []
        
    return []
