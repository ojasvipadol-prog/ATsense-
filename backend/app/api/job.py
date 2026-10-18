from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.ats_engine import calculate_ats_score
from app.services.nlp_analyzer import extract_skills_from_text, compare_keywords
from app.core.security import get_current_user_optional

router = APIRouter(prefix="/api/job", tags=["job"])

class MatchJobRequest(BaseModel):
    resume_text: str
    job_description: str
    job_role: Optional[str] = "Target Role"

SAMPLE_JOB_DESCRIPTIONS = [
    {
        "id": "ml-engineer",
        "title": "Machine Learning Engineer",
        "company": "NextGen AI Dynamics",
        "location": "Remote / San Francisco",
        "description": """About the Role:
We are looking for a Machine Learning Engineer to design, build, and deploy production-grade deep learning systems. You will collaborate with engineering and research teams to deliver real-time AI solutions.

Key Responsibilities:
• Train, fine-tune, and evaluate deep learning architectures using PyTorch and HuggingFace.
• Build scalable inference microservices using FastAPI, Docker, and Kubernetes.
• Design data transformation pipelines and integrate vector databases (Pinecone/Milvus) for RAG applications.
• Optimize model latency through quantization, ONNX, and caching with Redis.
• Establish automated CI/CD workflows and monitor production models.

Qualifications:
• Strong programming proficiency in Python, SQL, and C++.
• Hands-on experience with PyTorch or TensorFlow and Scikit-learn.
• Familiarity with AWS (EC2, S3) and Docker containerization.
• Knowledge of Natural Language Processing (NLP), LLMs, and REST APIs.
• Excellent problem-solving skills and bachelor's/master's in Computer Science or related quantitative field."""
    },
    {
        "id": "full-stack",
        "title": "Senior Full Stack Engineer",
        "company": "Vanguard Web Platforms",
        "location": "New York, NY",
        "description": """About the Role:
We are seeking a talented Full Stack Engineer to lead the architecture of our modern cloud-based web applications.

Key Responsibilities:
• Develop responsive, performant client interfaces using React, TypeScript, and Tailwind CSS.
• Design scalable RESTful and GraphQL APIs using Node.js, Express, or FastAPI.
• Architect relational database schemas in PostgreSQL and configure caching in Redis.
• Deploy scalable services to AWS using Docker and CI/CD automation pipelines.
• Collaborate with product designers and mentor junior software engineers.

Requirements:
• 3+ years experience with React, TypeScript, and modern JavaScript.
• Strong backend experience with Node.js, Python, or Go.
• Proficient with PostgreSQL, database indexing, and query optimization.
• Solid grasp of Git, Agile methodologies, unit testing, and microservice architectures."""
    },
    {
        "id": "data-scientist",
        "title": "Data Scientist",
        "company": "Insight Analytics Corp",
        "location": "Austin, TX",
        "description": """About the Role:
We are seeking an inquisitive Data Scientist to turn complex datasets into actionable predictive insights and statistical models.

Key Responsibilities:
• Perform exploratory data analysis (EDA) and feature engineering on massive datasets.
• Develop predictive models using Scikit-Learn, XGBoost, and Pandas.
• Write complex SQL queries for data extraction and build ETL workflows.
• Communicate findings through clear data visualizations using Tableau or Power BI.

Requirements:
• Proficiency in Python, R, and SQL.
• Deep understanding of probability, regression, classification, and A/B testing.
• Experience with Scikit-learn, Pandas, NumPy, and data warehousing."""
    }
]

@router.get("/samples")
def get_sample_job_descriptions():
    return SAMPLE_JOB_DESCRIPTIONS

@router.post("/match")
def match_job(req: MatchJobRequest):
    if not req.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not req.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
        
    analysis = calculate_ats_score(
        resume_text=req.resume_text,
        job_description=req.job_description,
        job_role=req.job_role or "Target Role"
    )
    
    # Career guidance generation based on missing skills and strengths
    missing_skills = [s["name"] for s in analysis["skills"]["missing_skills"]]
    strengths = [s["name"] for s in analysis["skills"]["strong_matches"]]
    
    # Generate contextual career roadmap
    roadmap_steps = []
    if strengths:
        roadmap_steps.append({
            "step": 1,
            "title": "Anchor Core Strengths",
            "desc": f"Solidify hands-on expertise in verified proficiencies: {', '.join(strengths[:3])}."
        })
    if missing_skills:
        roadmap_steps.append({
            "step": len(roadmap_steps) + 1,
            "title": f"Upskill in {missing_skills[0]}",
            "desc": f"Complete hands-on tutorials and build a proof-of-concept incorporating {missing_skills[0]}."
        })
        if len(missing_skills) > 1:
            roadmap_steps.append({
                "step": len(roadmap_steps) + 1,
                "title": f"Master {missing_skills[1]} & Deployment",
                "desc": f"Package application into containerized service and configure CI/CD pipeline."
            })
    roadmap_steps.append({
        "step": len(roadmap_steps) + 1,
        "title": "Deploy Portfolio Project",
        "desc": "Publish an end-to-end open-source project with live demo and clear documentation."
    })
    roadmap_steps.append({
        "step": len(roadmap_steps) + 1,
        "title": "Targeted ATS Applications",
        "desc": "Tailor your resume for each role using ATSense AI and apply to top-match positions."
    })
    
    recommended_certs = [
        "AWS Certified Cloud Practitioner / Solutions Architect",
        "DeepLearning.AI TensorFlow / PyTorch Developer",
        "Meta Front-End / Back-End Developer Professional Certificate"
    ]
    
    return {
        "overall_match": analysis["overall_score"],
        "status": analysis["score_status"],
        "scores": analysis["scores"],
        "strengths": strengths,
        "missing_skills": missing_skills,
        "missing_keywords": [k["keyword"] for k in analysis["keywords"]["missing"][:8]],
        "matched_keywords": [k["keyword"] for k in analysis["keywords"]["matched"][:8]],
        "quality_issues": analysis["quality_issues"],
        "recommendations": analysis["recommendations"],
        "career_guidance": {
            "strengths": strengths,
            "skills_to_develop": missing_skills[:6],
            "recommended_technologies": missing_skills[:4],
            "suggested_projects": [
                f"Build a production-ready application using {', '.join((strengths + missing_skills)[:3])} with live demo.",
                "Containerize your full-stack backend with Docker and configure GitHub Actions automated tests.",
                "Integrate real-time monitoring and quantitative performance benchmarking."
            ],
            "recommended_certifications": recommended_certs,
            "roadmap": roadmap_steps
        }
    }
