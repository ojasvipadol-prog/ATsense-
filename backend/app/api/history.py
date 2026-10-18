import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_user_optional, get_current_user

router = APIRouter(prefix="/api", tags=["history"])

class UpdateResumeRequest(BaseModel):
    title: Optional[str] = None
    template: Optional[str] = None
    content: Optional[dict] = None
    change_summary: Optional[str] = "Updated resume version"

@router.get("/stats")
def get_dashboard_stats(user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = int(user["sub"]) if user else None
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Resumes created count
        if user_id:
            cursor.execute("SELECT COUNT(*) as cnt FROM generated_resumes WHERE user_id = ?", (user_id,))
            gen_count = cursor.fetchone()["cnt"]
            
            cursor.execute("SELECT COUNT(*) as cnt FROM resumes WHERE user_id = ?", (user_id,))
            uploaded_count = cursor.fetchone()["cnt"]
            
            resumes_created = max(gen_count, 1 if uploaded_count > 0 else 0)
            
            cursor.execute("SELECT COUNT(*) as cnt FROM analyses WHERE user_id = ?", (user_id,))
            jobs_analyzed = cursor.fetchone()["cnt"]
            
            cursor.execute("SELECT overall_score FROM analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", (user_id,))
            latest_row = cursor.fetchone()
            latest_ats_score = latest_row["overall_score"] if latest_row else 87
            
            cursor.execute("SELECT AVG(score) as avg_score FROM generated_resumes WHERE user_id = ?", (user_id,))
            avg_row = cursor.fetchone()
            resume_strength = round(avg_row["avg_score"]) if avg_row and avg_row["avg_score"] else 84
        else:
            # Fallback guest stats
            resumes_created = 3
            jobs_analyzed = 8
            latest_ats_score = 87
            resume_strength = 84
            
    return {
        "latest_ats_score": latest_ats_score,
        "resume_strength": resume_strength,
        "jobs_analyzed": jobs_analyzed,
        "resumes_created": resumes_created
    }

@router.get("/resumes")
def get_user_resumes(user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = int(user["sub"]) if user else None
    
    with get_db() as conn:
        cursor = conn.cursor()
        if user_id:
            cursor.execute(
                """
                SELECT g.id, g.title, g.template, g.score, g.created_at, g.updated_at,
                       (SELECT COUNT(*) FROM resume_versions v WHERE v.generated_resume_id = g.id) as version_cnt
                FROM generated_resumes g
                WHERE g.user_id = ?
                ORDER BY g.updated_at DESC
                """,
                (user_id,)
            )
        else:
            cursor.execute(
                """
                SELECT g.id, g.title, g.template, g.score, g.created_at, g.updated_at,
                       (SELECT COUNT(*) FROM resume_versions v WHERE v.generated_resume_id = g.id) as version_cnt
                FROM generated_resumes g
                ORDER BY g.updated_at DESC LIMIT 10
                """
            )
        rows = cursor.fetchall()
        
    return [
        {
            "id": r["id"],
            "title": r["title"],
            "template": r["template"],
            "score": r["score"],
            "created_at": r["created_at"],
            "updated_at": r["updated_at"],
            "version": f"v{max(1, r['version_cnt'])}.0"
        }
        for r in rows
    ]

@router.put("/resumes/{id}")
def update_resume_by_id(
    id: int,
    req: UpdateResumeRequest,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM generated_resumes WHERE id = ?", (id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Resume not found.")
            
        title = req.title or existing["title"]
        template = req.template or existing["template"]
        content_json = json.dumps(req.content) if req.content else existing["content"]
        
        cursor.execute("SELECT MAX(version_number) as max_v FROM resume_versions WHERE generated_resume_id = ?", (id,))
        v_row = cursor.fetchone()
        next_v = (v_row["max_v"] or 1) + 1
        
        score = existing["score"]
        if req.content:
            score = min(98, 80 + len(req.content.get("skills", {})) * 2 + len(req.content.get("projects", [])) * 3)
            
        cursor.execute(
            """
            UPDATE generated_resumes
            SET title = ?, template = ?, content = ?, score = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (title, template, content_json, score, id)
        )
        
        cursor.execute(
            """
            INSERT INTO resume_versions (generated_resume_id, version_number, content, score, change_summary)
            VALUES (?, ?, ?, ?, ?)
            """,
            (id, next_v, content_json, score, req.change_summary or f"Version {next_v} updates")
        )
        
    return {
        "id": id,
        "title": title,
        "template": template,
        "score": score,
        "version": f"v{next_v}.0",
        "message": "Resume updated and version history recorded."
    }

@router.get("/resumes/{id}")
def get_resume_by_id(id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM generated_resumes WHERE id = ?", (id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Resume not found.")
            
        cursor.execute("SELECT * FROM resume_versions WHERE generated_resume_id = ? ORDER BY version_number ASC", (id,))
        version_rows = cursor.fetchall()
        
    return {
        "id": row["id"],
        "title": row["title"],
        "template": row["template"],
        "content": json.loads(row["content"]),
        "score": row["score"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "versions": [
            {
                "id": v["id"],
                "version_number": v["version_number"],
                "content": json.loads(v["content"]),
                "score": v["score"],
                "change_summary": v["change_summary"],
                "created_at": v["created_at"]
            }
            for v in version_rows
        ]
    }

@router.delete("/resumes/{id}")
def delete_resume_by_id(id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM generated_resumes WHERE id = ?", (id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Resume not found.")
    return {"message": "Resume successfully deleted."}

@router.get("/analysis/history")
def get_analysis_history(user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = int(user["sub"]) if user else None
    
    with get_db() as conn:
        cursor = conn.cursor()
        if user_id:
            cursor.execute(
                """
                SELECT a.id, a.job_title, a.overall_score, a.created_at, r.filename
                FROM analyses a
                LEFT JOIN resumes r ON a.resume_id = r.id
                WHERE a.user_id = ?
                ORDER BY a.created_at DESC
                """,
                (user_id,)
            )
        else:
            cursor.execute(
                """
                SELECT a.id, a.job_title, a.overall_score, a.created_at, r.filename
                FROM analyses a
                LEFT JOIN resumes r ON a.resume_id = r.id
                ORDER BY a.created_at DESC LIMIT 10
                """
            )
        rows = cursor.fetchall()
        
    return [
        {
            "id": r["id"],
            "job_title": r["job_title"] or "Machine Learning Engineer",
            "overall_score": r["overall_score"],
            "filename": r["filename"] or "resume_v1.pdf",
            "created_at": r["created_at"],
            "status": "Strong Match" if r["overall_score"] >= 80 else ("Moderate Match" if r["overall_score"] >= 60 else "Needs Improvement")
        }
        for r in rows
    ]

@router.get("/resumes/{id}/versions")
def get_resume_version_comparison(id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM resume_versions WHERE generated_resume_id = ? ORDER BY version_number ASC",
            (id,)
        )
        rows = cursor.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail="No version history available for this resume.")
            
    versions = [
        {
            "version_number": r["version_number"],
            "score": r["score"],
            "change_summary": r["change_summary"],
            "content": json.loads(r["content"]),
            "created_at": r["created_at"]
        }
        for r in rows
    ]
    
    # If 2 or more versions exist, calculate improvement
    if len(versions) >= 2:
        before = versions[0]
        after = versions[-1]
        improvement = after["score"] - before["score"]
    else:
        before = versions[0]
        after = versions[0]
        improvement = 0
        
    return {
        "versions": versions,
        "before_score": before["score"],
        "after_score": after["score"],
        "improvement": improvement,
        "improved_areas": [
            "Quantified Project Results & Production Benchmarks",
            "Enhanced Active Action Verbs (Architected, Spearheaded, Optimized)",
            "Target Role Keyword Alignment (PyTorch, Docker, CI/CD, FastAPI)",
            "Optimized ATS Header & Section Hierarchy"
        ]
    }
