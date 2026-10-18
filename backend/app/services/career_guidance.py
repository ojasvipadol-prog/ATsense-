import re
import json
import requests
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.services.nlp_analyzer import extract_skills_from_text, COMMON_SKILLS_TAXONOMY
from app.services.parser import extract_contact_info

ROLE_BENCHMARK_SKILLS = {
    "Machine Learning Engineer": [
        "Python", "PyTorch", "TensorFlow", "Scikit-Learn", "FastAPI", "Docker", "Kubernetes",
        "MLOps", "MLflow", "Vector Databases", "HuggingFace", "NLP", "Computer Vision", "SQL"
    ],
    "Data Scientist": [
        "Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Tableau", "Power BI",
        "Statistics", "A/B Testing", "Machine Learning", "Data Warehousing", "BigQuery"
    ],
    "Full Stack Developer": [
        "JavaScript", "TypeScript", "React", "Node.js", "Next.js", "Tailwind CSS",
        "PostgreSQL", "MongoDB", "Redis", "Docker", "REST API", "Git", "CI/CD"
    ],
    "Frontend Developer": [
        "JavaScript", "TypeScript", "React", "Next.js", "HTML5", "CSS3", "Tailwind CSS",
        "Redux", "REST API", "GraphQL", "Vite", "Performance Optimization", "Jest"
    ],
    "Backend Developer": [
        "Python", "Java", "Node.js", "Go", "FastAPI", "Spring Boot", "Express",
        "PostgreSQL", "Redis", "Docker", "Kubernetes", "Microservices", "Kafka", "SQL"
    ],
    "DevOps / Cloud Engineer": [
        "Linux", "AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD",
        "GitHub Actions", "Ansible", "Prometheus", "Grafana", "Python", "Bash"
    ]
}

def infer_target_role(resume_text: str, extracted_skills: Dict[str, List[str]]) -> str:
    lower_text = resume_text.lower()
    if any(k in lower_text for k in ["machine learning", "deep learning", "pytorch", "tensorflow", "computer vision", "nlp"]):
        return "Machine Learning Engineer"
    if any(k in lower_text for k in ["data science", "data scientist", "pandas", "tableau", "power bi"]):
        return "Data Scientist"
    if any(k in lower_text for k in ["devops", "cloud engineer", "kubernetes", "terraform", "aws cloud"]):
        return "DevOps / Cloud Engineer"
    if any(k in lower_text for k in ["full stack", "fullstack", "react", "node.js"]):
        return "Full Stack Developer"
    if any(k in lower_text for k in ["frontend", "front end", "react", "vue", "tailwind"]):
        return "Frontend Developer"
    if any(k in lower_text for k in ["backend", "back end", "fastapi", "django", "spring boot"]):
        return "Backend Developer"
    return "Software Engineer"

def call_gemini_guidance(prompt: str) -> Optional[Dict[str, Any]]:
    """Calls Google Gemini API (gemini-3.8-flash) with structured JSON generation."""
    api_key = settings.GEMINI_API_KEY.strip()
    if not api_key:
        return None

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1800
            }
        }
        res = requests.post(url, headers=headers, json=payload, timeout=6)
        if res.status_code == 200:
            data = res.json()
            candidates = data.get("candidates", [])
            if candidates and "content" in candidates[0]:
                parts = candidates[0]["content"].get("parts", [])
                if parts:
                    raw_text = parts[0].get("text", "").strip()
                    # Extract JSON substring
                    json_match = re.search(r"\{[\s\S]*\}", raw_text)
                    if json_match:
                        raw_json = json_match.group(0)
                        parsed = json.loads(raw_json)
                        if "timeline" in parsed and isinstance(parsed["timeline"], list):
                            return parsed
    except Exception as e:
        print(f"[Gemini Guidance Notice] Fallback to NLP engine: {e}")
    return None

def build_nlp_fallback_guidance(
    resume_text: str,
    target_role: str,
    extracted_skills: Dict[str, List[str]],
    contact_info: Dict[str, Any]
) -> Dict[str, Any]:
    """Generates an authentic resume-tailored career roadmap using local NLP rule analysis."""
    all_flat_skills = []
    for cat_skills in extracted_skills.values():
        all_flat_skills.extend(cat_skills)

    benchmark = ROLE_BENCHMARK_SKILLS.get(target_role, ROLE_BENCHMARK_SKILLS["Full Stack Developer"])
    
    # Identify strengths that exist in resume
    flat_lower = {s.lower(): s for s in all_flat_skills}
    strengths = [s for s in benchmark if s.lower() in flat_lower]
    if not strengths and all_flat_skills:
        strengths = all_flat_skills[:5]

    # Identify missing skills
    missing = [s for s in benchmark if s.lower() not in flat_lower]
    if not missing:
        missing = ["Cloud Architecture (AWS)", "Kubernetes Cluster Management", "System Design & Low Latency Caching", "Automated CI/CD Pipelines"]

    # Detect candidate name
    candidate_name = contact_info.get("name") or "Candidate"
    if candidate_name == "Candidate":
        first_lines = [l.strip() for l in resume_text.split("\n") if l.strip()][:3]
        for line in first_lines:
            if 2 <= len(line.split()) <= 4 and not any(ch in line for ch in "@/:"):
                candidate_name = line
                break

    # Determine experience level
    exp_matches = re.findall(r"\b(\d+)\+?\s*(?:years?|yrs?)\b", resume_text, re.IGNORECASE)
    years = max([int(y) for y in exp_matches]) if exp_matches else 0
    if years >= 4:
        level = f"Mid-Level Professional ({years}+ years experience)"
    elif years >= 1:
        level = f"Junior Specialist ({years}+ years experience)"
    else:
        level = "Aspiring Fresher / Early Career"

    primary_stack = ", ".join(strengths[:3]) if strengths else "Core Programming & Data Structures"
    primary_gap_1 = missing[0] if missing else "Cloud Microservices"
    primary_gap_2 = missing[1] if len(missing) > 1 else "CI/CD Deployment"
    primary_gap_3 = missing[2] if len(missing) > 2 else "System Design"

    timeline = [
        {
            "step": "01",
            "title": f"Mastery of {strengths[0] if strengths else 'Core Engineering'}",
            "status": "Completed",
            "desc": f"Your resume already demonstrates proven hands-on capability in {primary_stack}.",
            "skills_covered": strengths[:3] if strengths else ["Programming", "Algorithms"],
            "color": "emerald"
        },
        {
            "step": "02",
            "title": f"Consolidate {strengths[1] if len(strengths) > 1 else 'Modern Frameworks'}",
            "status": "In Progress",
            "desc": f"Solidify intermediate tooling and practical testing workflows around {strengths[1] if len(strengths) > 1 else 'backend services'}.",
            "skills_covered": strengths[1:4] if len(strengths) > 1 else ["REST APIs", "Git"],
            "color": "blue"
        },
        {
            "step": "03",
            "title": f"Bridge Priority Skill Gap: {primary_gap_1}",
            "status": "Next Priority",
            "desc": f"Target the #1 missing keyword on your resume for {target_role}. Build end-to-end modules utilizing {primary_gap_1}.",
            "skills_covered": [primary_gap_1],
            "color": "indigo"
        },
        {
            "step": "04",
            "title": f"Deepen Cloud & Infrastructure: {primary_gap_2}",
            "status": "Upcoming",
            "desc": f"Enhance containerization, automated build workflows, and deployment infrastructure with {primary_gap_2}.",
            "skills_covered": [primary_gap_2],
            "color": "violet"
        },
        {
            "step": "05",
            "title": f"Architect Portfolio Capstone for {target_role}",
            "status": "Upcoming",
            "desc": f"Develop an open-source, benchmarked application integrating {primary_stack} and {primary_gap_1} with live URL.",
            "skills_covered": ["System Design", "Benchmarking", "Clean Architecture"],
            "color": "purple"
        },
        {
            "step": "06",
            "title": "Targeted ATS Applications & System Interviews",
            "status": "Upcoming",
            "desc": f"Target high-compatibility (85%+) job postings using tailored ATSense AI applications for {target_role}.",
            "skills_covered": ["ATS Optimization", "Technical Interviews"],
            "color": "pink"
        }
    ]

    suggested_projects = [
        {
            "title": f"High-Throughput {target_role} Microservice",
            "stack": f"{strengths[0] if strengths else 'Python'}, {primary_gap_1}, Docker",
            "difficulty": "Intermediate",
            "why_for_you": f"Directly demonstrates {primary_gap_1} alongside your verified skills in {strengths[0] if strengths else 'code'}.",
            "metric": "Sub-50ms response latency with 99.9% uptime on simulated benchmark traffic."
        },
        {
            "title": f"Enterprise Data & {primary_gap_2} Automation Engine",
            "stack": f"{primary_gap_1}, {primary_gap_2}, Redis, PostgreSQL",
            "difficulty": "Advanced",
            "why_for_you": f"Fills the critical architectural gap of {primary_gap_2} missing on your current resume.",
            "metric": "Automates event processing across 50,000+ records with zero-downtime CI/CD."
        },
        {
            "title": f"Production-Grade {target_role} Dashboard & API",
            "stack": f"React, TypeScript, {strengths[0] if strengths else 'Python'}, {primary_gap_1}",
            "difficulty": "Intermediate",
            "why_for_you": f"Provides a tangible, live-demoable portfolio URL for recruiters reviewing your resume.",
            "metric": "Achieves 95+ Google Lighthouse score and seamless responsive interactions."
        }
    ]

    certifications = [
        {
            "name": f"AWS Certified Solutions Architect – Associate",
            "issuer": "Amazon Web Services",
            "priority": "High",
            "why_for_you": f"Validates cloud infrastructure skills ({primary_gap_1}) that recruiters in {target_role} actively filter for."
        },
        {
            "name": f"{target_role} Professional Specialization",
            "issuer": "Coursera / DeepLearning.AI / Google",
            "priority": "High",
            "why_for_you": f"Certifies structured theoretical and hands-on competence in {primary_gap_2}."
        },
        {
            "name": "Docker & Kubernetes Certified Practitioner (CKA / DCA)",
            "issuer": "Cloud Native Computing Foundation",
            "priority": "Medium",
            "why_for_you": "Elevates your container deployment skills from basic Docker to enterprise clustering."
        }
    ]

    interview_topics = [
        f"Real-world trade-offs in {primary_gap_1} vs legacy architectures",
        f"Concurrency and asynchronous design patterns in {strengths[0] if strengths else 'Python'}",
        "Database indexing, caching strategies, and latency minimization",
        f"End-to-end System Design for scalable {target_role} platforms"
    ]

    return {
        "candidate_name": candidate_name,
        "current_level": level,
        "target_role": target_role,
        "career_summary": f"Your resume highlights solid foundations in {primary_stack}. To advance competitively toward top-tier {target_role} roles, prioritize acquiring hands-on mastery in {primary_gap_1} and {primary_gap_2}.",
        "identified_strengths": strengths[:6],
        "critical_skill_gaps": missing[:6],
        "timeline": timeline,
        "suggested_projects": suggested_projects,
        "recommended_certifications": certifications,
        "interview_topics": interview_topics,
        "engine_used": "ATSense NLP Intelligence Engine"
    }

def generate_personalized_career_guidance(
    resume_text: str,
    target_role: Optional[str] = None
) -> Dict[str, Any]:
    """
    Produces a 100% personalized Career Roadmap derived from the candidate's actual resume.
    Uses Google Gemini 3.8 Flash if available, with a resilient NLP fallback engine.
    """
    extracted_skills = extract_skills_from_text(resume_text)
    contact_info = extract_contact_info(resume_text)
    
    if not target_role or not target_role.strip():
        target_role = infer_target_role(resume_text, extracted_skills)

    all_flat_skills = []
    for cat_skills in extracted_skills.values():
        all_flat_skills.extend(cat_skills)

    # 1. Try Gemini 3.8 Flash AI with precise JSON instructions
    if settings.GEMINI_API_KEY.strip():
        prompt = f"""You are an elite Tech Career Strategist and ATS hiring expert.
Analyze the following candidate's ACTUAL RESUME.

Target Career Goal: {target_role}

CANDIDATE'S ACTUAL RESUME TEXT:
\"\"\"
{resume_text}
\"\"\"

EXTRACTED VERIFIED SKILLS FROM RESUME:
{json.dumps(extracted_skills)}

INSTRUCTIONS:
1. Base EVERY recommendation on the candidate's ACTUAL resume. DO NOT make up generic advice.
2. In the timeline, Step 01 MUST celebrate and state the skills they ALREADY have on their resume as 'Completed'.
3. Step 02 MUST highlight their current active focus ('In Progress').
4. Step 03 MUST target the single most critical missing skill gap for {target_role} ('Next Priority').
5. Steps 04, 05, and 06 must guide them through advanced architecture, capstone project, and ATS application strategy ('Upcoming').
6. Suggested projects MUST use technologies related to their stack and target role, with realistic measurable metrics.
7. Certifications MUST bridge their exact missing skill gaps.

Return ONLY a valid JSON object matching this schema:
{{
  "candidate_name": "string",
  "current_level": "string (e.g. Fresher, Junior 1-2 yrs, Mid-Level)",
  "target_role": "{target_role}",
  "career_summary": "string (2-3 sentences assessing their resume strengths and exact gap for {target_role})",
  "identified_strengths": ["string", "string"],
  "critical_skill_gaps": ["string", "string"],
  "timeline": [
    {{
      "step": "01",
      "title": "string",
      "status": "Completed",
      "desc": "string referencing their actual resume skills",
      "skills_covered": ["string"],
      "color": "emerald"
    }},
    {{
      "step": "02",
      "title": "string",
      "status": "In Progress",
      "desc": "string",
      "skills_covered": ["string"],
      "color": "blue"
    }},
    {{
      "step": "03",
      "title": "string",
      "status": "Next Priority",
      "desc": "string targeting their top gap",
      "skills_covered": ["string"],
      "color": "indigo"
    }},
    {{
      "step": "04",
      "title": "string",
      "status": "Upcoming",
      "desc": "string",
      "skills_covered": ["string"],
      "color": "violet"
    }},
    {{
      "step": "05",
      "title": "string",
      "status": "Upcoming",
      "desc": "string",
      "skills_covered": ["string"],
      "color": "purple"
    }},
    {{
      "step": "06",
      "title": "string",
      "status": "Upcoming",
      "desc": "string",
      "skills_covered": ["string"],
      "color": "pink"
    }}
  ],
  "suggested_projects": [
    {{
      "title": "string",
      "stack": "string",
      "difficulty": "Intermediate" | "Advanced",
      "why_for_you": "string explaining how it builds on their specific resume",
      "metric": "string"
    }}
  ],
  "recommended_certifications": [
    {{
      "name": "string",
      "issuer": "string",
      "priority": "High" | "Medium",
      "why_for_you": "string"
    }}
  ],
  "interview_topics": ["string", "string", "string"]
}}"""
        gemini_result = call_gemini_guidance(prompt)
        if gemini_result:
            gemini_result["engine_used"] = "Google Gemini 3.8 Flash AI"
            return gemini_result

    # 2. Resilient NLP fallback engine
    return build_nlp_fallback_guidance(resume_text, target_role, extracted_skills, contact_info)
