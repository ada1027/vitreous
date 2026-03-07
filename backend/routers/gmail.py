from fastapi import APIRouter

router = APIRouter()

@router.get("/gmail/scan")
async def gmail_scan():
    return [
        {"service_name": "Netflix", "domain": "netflix.com", "type": "subscription", "amount": "$15.99", "date": "2023-10-01", "is_breached": False},
        {"service_name": "Spotify", "domain": "spotify.com", "type": "subscription", "amount": "$10.99", "date": "2023-10-02", "is_breached": False},
        {"service_name": "Adobe", "domain": "adobe.com", "type": "software", "amount": "$52.99", "date": "2023-10-03", "is_breached": True},
        {"service_name": "LinkedIn", "domain": "linkedin.com", "type": "social", "amount": "$0.00", "date": "2023-10-04", "is_breached": True},
        {"service_name": "Dropbox", "domain": "dropbox.com", "type": "utility", "amount": "$12.00", "date": "2023-10-05", "is_breached": False},
    ]
