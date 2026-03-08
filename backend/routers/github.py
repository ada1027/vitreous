import os
import httpx
import asyncio
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from typing import Dict, Any, List

router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@router.get("/github/auth")
async def github_auth():
    from dotenv import load_dotenv
    from pathlib import Path
    load_dotenv(Path(__file__).parent.parent / '.env')
    GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')

    if not GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Missing GITHUB_CLIENT_ID")
    
    # Request repo and read:user scopes to see collaborators and profile
    redirect_uri = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=repo,read:user"
    return RedirectResponse(redirect_uri)

@router.get("/github/callback")
async def github_callback(code: str = Query(None)):
    from dotenv import load_dotenv
    from pathlib import Path
    load_dotenv(Path(__file__).parent.parent / '.env')
    GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')

    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")
    
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Missing GitHub credentials")
        
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to retrieve access token")
            
        token_data = resp.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            error = token_data.get("error_description", "Unknown error")
            raise HTTPException(status_code=400, detail=f"No access token: {error}")
            
    # Redirect back to frontend with the token
    return RedirectResponse(f"{FRONTEND_URL}/dashboard?github_token={access_token}")

@router.get("/github/data")
async def github_data(token: str = Query(..., description="GitHub OAuth access token")):
    if not token:
        raise HTTPException(status_code=400, detail="Missing token parameter")
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    
    async with httpx.AsyncClient() as client:
        # 1. Fetch authorized apps via /user/installations
        installations = []
        try:
            apps_resp = await client.get("https://api.github.com/user/installations", headers=headers)
            if apps_resp.status_code == 200:
                installations = apps_resp.json().get("installations", [])
        except Exception as e:
            print(f"Error fetching GitHub installations: {e}")

        # 2. Fetch all user repos to find collaborators
        repos = []
        try:
            # We fetch up to 100 repositories the user has access to
            repos_resp = await client.get("https://api.github.com/user/repos?per_page=100&sort=updated", headers=headers)
            if repos_resp.status_code == 200:
                repos = repos_resp.json()
        except Exception as e:
            print(f"Error fetching GitHub repos: {e}")
            
        collaborators_data = []
        
        # Concurrency limit for child requests to prevent rate limits
        sem = asyncio.Semaphore(5)
        
        async def fetch_collaborator_details(owner: str, repo_name: str, collabs: List[Dict[str, Any]]):
            tasks = []
            for c in collabs:
                username = c.get("login", "")
                if not username:
                    continue
                permissions = c.get("permissions", {})
                tasks.append(process_collaborator_commit(owner, repo_name, str(username), permissions))
            await asyncio.gather(*tasks)

        async def process_collaborator_commit(owner: str, repo_name: str, username: str, permissions: Dict[str, Any]):
            async with sem:
                commit_url = f"https://api.github.com/repos/{owner}/{repo_name}/commits?author={username}&per_page=1"
                try:
                    commit_resp = await client.get(commit_url, headers=headers)
                    last_commit_date = None
                    if commit_resp.status_code == 200:
                        commits = commit_resp.json()
                        if commits and len(commits) > 0:
                            last_commit_date = commits[0].get("commit", {}).get("author", {}).get("date")
                            
                    collaborators_data.append({
                        "repository": f"{owner}/{repo_name}",
                        "collaborator": username,
                        "permissions": permissions,
                        "last_commit_date": last_commit_date
                    })
                except Exception as e:
                    print(f"Error fetching commit for {username} in {owner}/{repo_name}: {e}")

        async def process_repo(repo: Dict[str, Any]):
            owner = repo.get("owner", {}).get("login", "")
            repo_name = repo.get("name", "")
            
            if not owner or not repo_name:
                return
                
            async with sem:
                collab_url = f"https://api.github.com/repos/{owner}/{repo_name}/collaborators"
                try:
                    collab_resp = await client.get(collab_url, headers=headers)
                    # Note: /collaborators requires push access or admin to the repo
                    if collab_resp.status_code == 200:
                        collabs = collab_resp.json()
                        await fetch_collaborator_details(str(owner), str(repo_name), collabs)
                except Exception as e:
                    print(f"Error fetching collaborators for {owner}/{repo_name}: {e}")
                    
        # Process all repos asynchronously
        await asyncio.gather(*[process_repo(repo) for repo in repos])
            
        return {
            "oauth_apps_installations": installations,
            "collaborators": collaborators_data
        }
