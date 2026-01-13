"""
GreenForge - Main API Server

PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED
Copyright (c) 2025-2026 Joshua Johosky

This software contains proprietary algorithms and trade secrets.
Unauthorized use is PROHIBITED. See LICENSE file for terms.
"""
import uvicorn
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import sys

from api.recommendation import router
from config import APIConfig, DATA_DIR, DB_PATH, LoggingConfig
from auth import check_authorization, AuthorizationError

# Configure logging
logging.basicConfig(
    level=getattr(logging, LoggingConfig.DEFAULT_LEVEL),
    format=LoggingConfig.LOG_FORMAT,
    datefmt=LoggingConfig.DATE_FORMAT
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown events."""
    # AUTHORIZATION CHECK - Required before starting API
    logger.info("Checking GreenForge authorization...")
    try:
        check_authorization()
        logger.info("✓ Authorization validated")
    except AuthorizationError as e:
        logger.critical("=" * 70)
        logger.critical("AUTHORIZATION FAILED")
        logger.critical("=" * 70)
        logger.critical(str(e))
        logger.critical("=" * 70)
        logger.critical("GreenForge cannot start without valid authorization.")
        logger.critical("This software is proprietary and protected by law.")
        logger.critical("=" * 70)
        sys.exit(1)

    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        logger.info(f"Created {DATA_DIR} directory")

    if os.path.exists(DB_PATH):
        logger.info(f"Database found at {DB_PATH}")
    else:
        logger.warning(f"Database not found at {DB_PATH}")

    logger.info("🚀 GreenForge Engine: ONLINE (Authorized)")

    yield

    logger.info("🛑 GreenForge Engine: OFFLINE")


app = FastAPI(
    title=APIConfig.TITLE,
    description=APIConfig.DESCRIPTION,
    version=APIConfig.VERSION,
    lifespan=lifespan,
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=APIConfig.ALLOW_ORIGINS,  # Restrict in production
    allow_credentials=APIConfig.ALLOW_CREDENTIALS,
    allow_methods=APIConfig.ALLOW_METHODS,
    allow_headers=APIConfig.ALLOW_HEADERS,
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
    db_exists = os.path.exists(DB_PATH)
    return {
        "status": "healthy" if db_exists else "degraded",
        "database": "connected" if db_exists else "missing",
        "api_version": "v1"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",  # ✅ must match the lowercase filename
        host=APIConfig.HOST,
        port=APIConfig.PORT,
        reload=APIConfig.RELOAD,
        log_level=APIConfig.LOG_LEVEL,
    )
