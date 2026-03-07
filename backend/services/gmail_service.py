import httpx
from typing import List, Dict, Any

async def scan_inbox(access_token: str) -> List[Dict[str, Any]]:
    query = "unsubscribe"
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {
        "q": query,
        "maxResults": 100
    }
    
    messages_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages"
    
    async with httpx.AsyncClient() as client:
        search_response = await client.get(messages_url, headers=headers, params=params)
        search_response.raise_for_status()
        
        data = search_response.json()
        messages = data.get("messages", [])
        
        results = []
        for msg in messages:
            msg_id = msg["id"]
            
            msg_url = f"{messages_url}/{msg_id}"
            
            # Using a list of tuples to ensure duplicate query keys are formatted correctly
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
                    
            results.append(extracted)
            
        return results
