from fastapi import APIRouter

router = APIRouter()

@router.get("/breach/{email}")
async def get_breach(email: str):
    return [
        {"name": "LinkedIn Data Breach", "year": 2012, "data_classes": ["Email addresses", "Passwords"], "pwn_count": 164000000},
        {"name": "Adobe Systems", "year": 2013, "data_classes": ["Email addresses", "Passwords", "Password hints", "Usernames"], "pwn_count": 152000000}
    ]
