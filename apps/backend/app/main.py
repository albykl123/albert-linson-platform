"""Main FastAPI Application Entrypoint for ATSForge AI."""

from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import settings
from app.db.session import init_db
from app.routers import (
    resumes,
    analysis,
    jobs,
    optimize,
    export,
    settings_router,
    pipeline,
)

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup
    init_db()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Resume Intelligence, ATS Analysis and Career Optimisation Platform",
    lifespan=lifespan,
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(resumes.router)
app.include_router(analysis.router)
app.include_router(jobs.router)
app.include_router(optimize.router)
app.include_router(export.router)
app.include_router(settings_router.router)
app.include_router(pipeline.router)

# Mount Static Files for Web App
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "mode": "local-first",
        "active_ai_provider": settings.AI_PROVIDER,
    }


@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """Serve frontend single-page application for all non-API routes."""
    index_file = STATIC_DIR / "index.html"
    if (STATIC_DIR / full_path).is_file():
        return FileResponse(STATIC_DIR / full_path)
    if index_file.is_file():
        return FileResponse(index_file)
    return {
        "app": settings.APP_NAME,
        "status": "online",
        "message": "Backend API is ready. Mount frontend assets to static/index.html",
        "api_docs": "/docs",
    }
