from io import BytesIO
from typing import Optional
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.exporter import generate_pdf_resume, generate_docx_resume
from app.core.database import get_db
from app.core.security import get_current_user_optional
from fastapi import Depends
import json

router = APIRouter(prefix="/api/resume/export", tags=["export"])

class ExportRequest(BaseModel):
    content: dict
    template: str = "classic"
    filename: Optional[str] = None

@router.post("/pdf")
def export_pdf(
    req: ExportRequest,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    try:
        user_id = int(user["sub"]) if user else None
        if user_id:
            try:
                name = req.content.get("personal", {}).get("fullName", "Resume")
                title = f"{name} - {req.template.capitalize()} Resume"
                with get_db() as conn:
                    cursor = conn.cursor()
                    cursor.execute(
                        """
                        INSERT INTO generated_resumes (user_id, title, template, content, score)
                        VALUES (?, ?, ?, ?, ?)
                        """,
                        (user_id, title, req.template, json.dumps(req.content), 88)
                    )
                    gen_id = cursor.lastrowid
                    cursor.execute(
                        """
                        INSERT INTO resume_versions (generated_resume_id, version_number, content, score, change_summary)
                        VALUES (?, 1, ?, 88, 'Exported PDF copy')
                        """,
                        (gen_id, json.dumps(req.content))
                    )
            except Exception as save_err:
                print(f"Notice: Failed to auto-save exported PDF resume: {save_err}")

        pdf_bytes = generate_pdf_resume(req.content, template=req.template)
        name = req.content.get("personal", {}).get("fullName", "Resume").replace(" ", "_")
        filename = req.filename or f"{name}_Resume.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF resume: {str(e)}")

@router.post("/docx")
def export_docx(
    req: ExportRequest,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    try:
        user_id = int(user["sub"]) if user else None
        if user_id:
            try:
                name = req.content.get("personal", {}).get("fullName", "Resume")
                title = f"{name} - {req.template.capitalize()} Resume"
                with get_db() as conn:
                    cursor = conn.cursor()
                    cursor.execute(
                        """
                        INSERT INTO generated_resumes (user_id, title, template, content, score)
                        VALUES (?, ?, ?, ?, ?)
                        """,
                        (user_id, title, req.template, json.dumps(req.content), 88)
                    )
                    gen_id = cursor.lastrowid
                    cursor.execute(
                        """
                        INSERT INTO resume_versions (generated_resume_id, version_number, content, score, change_summary)
                        VALUES (?, 1, ?, 88, 'Exported DOCX copy')
                        """,
                        (gen_id, json.dumps(req.content))
                    )
            except Exception as save_err:
                print(f"Notice: Failed to auto-save exported DOCX resume: {save_err}")

        docx_bytes = generate_docx_resume(req.content, template=req.template)
        name = req.content.get("personal", {}).get("fullName", "Resume").replace(" ", "_")
        filename = req.filename or f"{name}_Resume.docx"
        
        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate DOCX resume: {str(e)}")
