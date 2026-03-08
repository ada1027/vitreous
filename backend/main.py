import os
from dotenv import load_dotenv
from pathlib import Path
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)
print('GITHUB_CLIENT_ID loaded:', bool(os.getenv('GITHUB_CLIENT_ID')))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import google, gmail, breach, narrative, github, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(google.router, prefix="/api")
app.include_router(github.router, prefix="/api")
app.include_router(gmail.router, prefix="/api")
app.include_router(breach.router, prefix="/api")
app.include_router(narrative.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
