from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import init_db
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.export import router as export_router
from app.api.job import router as job_router
from app.api.history import router as history_router

# Initialize database tables and demo seed
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ATSense AI — High-Performance AI Resume Analyzer, Optimizer & Builder Backend"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler to provide graceful, structured JSON responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc) if not isinstance(exc, AssertionError) else "An unexpected error occurred. Please try again."
        }
    )

# Include API Routers
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(export_router)
app.include_router(job_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "status": "online",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
