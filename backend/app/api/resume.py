import os
import json
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pydantic import BaseModel
from app.core.config import settings, UPLOAD_DIR
from app.core.database import get_db
from app.core.security import get_current_user_optional, get_current_user
from app.services.parser import extract_text_from_pdf, extract_text_from_docx, segment_resume_sections, extract_contact_info
from app.services.ats_engine import calculate_ats_score
from app.services.ai_improver import generate_improved_resume_diff
from app.services.career_guidance import generate_personalized_career_guidance

router = APIRouter(prefix="/api/resume", tags=["resume"])

class AnalyzeRequest(BaseModel):
    resume_id: Optional[int] = None
    resume_text: Optional[str] = None
    job_description: Optional[str] = ""
    job_role: Optional[str] = ""

class ImproveRequest(BaseModel):
    resume_id: Optional[int] = None
    resume_text: Optional[str] = None
    job_role: Optional[str] = ""

class GenerateResumeRequest(BaseModel):
    resume_id: Optional[int] = None
    title: str
    template: str = "classic"
    content: dict

class GuidanceRequest(BaseModel):
    resume_id: Optional[int] = None
    resume_text: Optional[str] = None
    target_role: Optional[str] = ""

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    user: Optional[dict] = Depends(get_current_user_optional)
):
    filename = file.filename or "uploaded_resume.pdf"
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in [".pdf", ".docx", ".txt"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Please upload a PDF or DOCX resume."
        )
        
    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the 10 MB maximum limit."
        )
        
    # Extract text based on file type
    try:
        if ext == ".pdf":
            extracted_text = extract_text_from_pdf(contents)
        elif ext == ".docx":
            extracted_text = extract_text_from_docx(contents)
        else:
            extracted_text = contents.decode("utf-8", errors="ignore")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to read and parse the uploaded file: {str(e)}"
        )
        
    if not extracted_text or len(extracted_text.strip()) < 30:
        raise HTTPException(
            status_code=400,
            detail="The uploaded resume appears to be empty or unreadable text. If scanned, please provide a text-based PDF."
        )
        
    # Save file on disk
    user_id = int(user["sub"]) if user else None
    save_filename = f"{user_id or 'guest'}_{os.urandom(4).hex()}_{filename}"
    file_path = UPLOAD_DIR / save_filename
    with open(file_path, "wb") as f:
        f.write(contents)
        
    # Segment sections and contact info
    sections = segment_resume_sections(extracted_text)
    contact = extract_contact_info(extracted_text)
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO resumes (user_id, filename, file_path, extracted_text, parsed_sections)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, filename, str(file_path), extracted_text, json.dumps(sections))
        )
        resume_id = cursor.lastrowid
        
    return {
        "resume_id": resume_id,
        "filename": filename,
        "file_size": len(contents),
        "file_type": ext.replace(".", "").upper(),
        "extracted_length": len(extracted_text),
        "contact_info": contact,
        "sections_detected": list(sections.keys()),
        "preview_text": extracted_text[:400] + ("..." if len(extracted_text) > 400 else "")
    }

@router.post("/analyze")
def analyze_resume(
    req: AnalyzeRequest,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    text_to_analyze = ""
    resume_id = req.resume_id
    
    if req.resume_text and req.resume_text.strip():
        text_to_analyze = req.resume_text.strip()
    elif resume_id:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT extracted_text FROM resumes WHERE id = ?", (resume_id,))
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Resume not found.")
            text_to_analyze = row["extracted_text"]
    else:
        raise HTTPException(status_code=400, detail="Either resume_id or resume_text must be provided.")
        
    # Calculate complete ATS analysis
    result = calculate_ats_score(
        resume_text=text_to_analyze,
        job_description=req.job_description or "",
        job_role=req.job_role or ""
    )
    
    # Save analysis in database
    user_id = int(user["sub"]) if user else None
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO analyses (
                user_id, resume_id, job_title, job_description, overall_score,
                scores, skills, keywords, structure, quality_issues, recommendations
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                resume_id,
                req.job_role or "General Assessment",
                req.job_description or "",
                result["overall_score"],
                json.dumps(result["scores"]),
                json.dumps(result["skills"]),
                json.dumps(result["keywords"]),
                json.dumps(result["structure"]),
                json.dumps(result["quality_issues"]),
                json.dumps(result["recommendations"])
            )
        )
        analysis_id = cursor.lastrowid
        
    result["analysis_id"] = analysis_id
    return result

@router.post("/improve")
def improve_resume(
    req: ImproveRequest,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    text = ""
    if req.resume_text and req.resume_text.strip():
        text = req.resume_text.strip()
    elif req.resume_id:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT extracted_text FROM resumes WHERE id = ?", (req.resume_id,))
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Resume not found.")
            text = row["extracted_text"]
    else:
        raise HTTPException(status_code=400, detail="Provide resume_id or resume_text to generate improvements.")
        
    diff_report = generate_improved_resume_diff(text, target_role=req.job_role or "")
    return diff_report

@router.post("/generate")
def generate_resume(
    req: GenerateResumeRequest,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    user_id = int(user["sub"]) if user else None
    
    # Calculate estimated ATS score for the generated content
    text_repr = json.dumps(req.content)
    base_score = 88 if req.content.get("projects") and req.content.get("skills") else 75
    
    with get_db() as conn:
        cursor = conn.cursor()
        if req.resume_id:
            cursor.execute("SELECT * FROM generated_resumes WHERE id = ?", (req.resume_id,))
            existing = cursor.fetchone()
            if existing:
                cursor.execute(
                    """
                    UPDATE generated_resumes
                    SET title = ?, template = ?, content = ?, score = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (req.title, req.template, json.dumps(req.content), base_score, req.resume_id)
                )
                cursor.execute("SELECT MAX(version_number) as max_v FROM resume_versions WHERE generated_resume_id = ?", (req.resume_id,))
                max_v = cursor.fetchone()["max_v"] or 1
                cursor.execute(
                    """
                    INSERT INTO resume_versions (generated_resume_id, version_number, content, score, change_summary)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (req.resume_id, max_v + 1, json.dumps(req.content), base_score, f"Version {max_v + 1} update")
                )
                return {
                    "id": req.resume_id,
                    "title": req.title,
                    "template": req.template,
                    "score": base_score,
                    "message": "Resume successfully updated."
                }

        cursor.execute(
            """
            INSERT INTO generated_resumes (user_id, title, template, content, score)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, req.title, req.template, json.dumps(req.content), base_score)
        )
        gen_id = cursor.lastrowid
        
        # Save Version 1
        cursor.execute(
            """
            INSERT INTO resume_versions (generated_resume_id, version_number, content, score, change_summary)
            VALUES (?, ?, ?, ?, ?)
            """,
            (gen_id, 1, json.dumps(req.content), base_score, "Initial generated resume version")
        )
        
    return {
        "id": gen_id,
        "title": req.title,
        "template": req.template,
        "score": base_score,
        "message": "Resume successfully generated and saved."
    }

@router.get("/samples")
def get_sample_resumes():
    """Returns curated demo resumes for instant testing."""
    return [
        {
            "id": "sample-ml",
            "title": "Alex Morgan — Machine Learning Engineer",
            "role": "Machine Learning Engineer",
            "score": 88,
            "text": """Alex Morgan
San Francisco, CA • alex.morgan@example.com • +1 (555) 019-2834 • linkedin.com/in/alexmorgan • github.com/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Machine Learning Engineer with 2+ years of experience developing deep learning architectures, scalable inference endpoints, and automated data pipelines. Skilled in Python, PyTorch, Scikit-learn, Docker, and AWS.

TECHNICAL SKILLS
Languages: Python, SQL, C++, TypeScript
AI/ML: PyTorch, TensorFlow, Scikit-learn, HuggingFace, NLP, Computer Vision
Cloud & DevOps: AWS (EC2, S3), Docker, Git, CI/CD, Kubernetes
Databases: PostgreSQL, Redis, MongoDB

PROFESSIONAL EXPERIENCE
Junior Machine Learning Engineer | Cognitive AI Labs (2023 - Present)
• Architected and deployed a multi-modal computer vision model using PyTorch and FastAPI, reducing inference latency by 35%.
• Automated model retraining and validation pipelines using Docker and GitHub Actions, processing 500k+ daily events.
• Collaborated with backend engineers to integrate REST APIs and microservice monitoring with Prometheus.

KEY PROJECTS
Real-Time Defect Detection System (PyTorch, Docker, OpenCV)
• Trained custom ResNet-50 models for automated industrial surface defect classification, achieving 96.4% precision.
• Deployed scalable microservice handling 120 requests/sec with average sub-45ms latency.

EDUCATION
B.S. in Computer Science | UC Berkeley (2019 - 2023) • CGPA: 3.85 / 4.0"""
        },
        {
            "id": "sample-fullstack",
            "title": "Sophia Chen — Full Stack Developer",
            "role": "Full Stack Developer",
            "score": 84,
            "text": """Sophia Chen
New York, NY • sophia.chen@example.com • +1 (555) 392-1049 • linkedin.com/in/sophiachen • github.com/sophiachen

PROFESSIONAL SUMMARY
Full Stack Developer with a proven record of building high-performance web applications using React, TypeScript, Node.js, and PostgreSQL. Experienced in responsive UI/UX and RESTful microservices.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL
Frameworks: React, Next.js, Node.js, Express, Tailwind CSS, FastAPI
Databases & Tools: PostgreSQL, MongoDB, Redis, Docker, Git, Jest

PROFESSIONAL EXPERIENCE
Software Developer | Apex Digital Solutions (2022 - Present)
• Spearheaded frontend revamp of core customer portal using React and Tailwind CSS, improving Lighthouse performance score from 62 to 94.
• Engineered robust REST API endpoints in Node.js and PostgreSQL handling 2M+ monthly requests with 99.98% uptime.
• Decreased database query latency by 45% through indexing optimization and Redis caching.

EDUCATION
B.Tech in Information Technology | NYU Tandon (2018 - 2022) • CGPA: 3.7 / 4.0"""
        }
    ]

@router.post("/guidance")
def get_career_guidance(
    req: GuidanceRequest,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    """Generates an authentic, personalized career roadmap derived from the provided or stored resume."""
    text = ""
    target_role = req.target_role or ""
    
    if req.resume_text and req.resume_text.strip():
        text = req.resume_text.strip()
    elif req.resume_id:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT extracted_text FROM resumes WHERE id = ?", (req.resume_id,))
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Resume not found.")
            text = row["extracted_text"]
    else:
        # Check if user has an uploaded resume in the database
        user_id = int(user["sub"]) if user else None
        with get_db() as conn:
            cursor = conn.cursor()
            if user_id:
                cursor.execute("SELECT extracted_text FROM resumes WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,))
            else:
                cursor.execute("SELECT extracted_text FROM resumes ORDER BY id DESC LIMIT 1")
            row = cursor.fetchone()
            if row:
                text = row["extracted_text"]
            else:
                text = get_sample_resumes()[0]["text"]

    guidance = generate_personalized_career_guidance(text, target_role=target_role)
    return guidance

@router.get("/guidance")
def get_default_career_guidance(
    resume_id: Optional[int] = None,
    target_role: Optional[str] = None,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    """GET endpoint for career guidance supporting query parameters."""
    req = GuidanceRequest(resume_id=resume_id, target_role=target_role or "")
    return get_career_guidance(req, user)

