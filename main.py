import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from api.recommendation import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown events."""
    data_dir = "data"
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"✓ Created {data_dir} directory")

    db_path = os.path.join(data_dir, "greenforge.db")
    if os.path.exists(db_path):
        print(f"✓ Database found at {db_path}")
    else:
        print(f"⚠ WARNING: Database not found at {db_path}")

    print("🚀 GreenForge Engine: ONLINE")

    yield

    print("🛑 GreenForge Engine: OFFLINE")


app = FastAPI(
    title="GreenForge Engine",
    description="Cannabis product recommendation API with thermal interface modeling",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the recommendation router
app.include_router(router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "operational",
        "engine": "GreenForge v1.0",
        "endpoints": {
            "recommend": "/api/v1/recommend",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """Detailed health check with database status."""
    db_path = os.path.join("data", "greenforge.db")
    db_exists = os.path.exists(db_path)
    return {
        "status": "healthy" if db_exists else "degraded",
        "database": "connected" if db_exists else "missing",
        "api_version": "v1"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",  # ✅ must match the lowercase filename
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
