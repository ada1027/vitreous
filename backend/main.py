from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import google, gmail, breach, narrative

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(google.router, prefix="/api")
app.include_router(gmail.router, prefix="/api")
app.include_router(breach.router, prefix="/api")
app.include_router(narrative.router, prefix="/api")
