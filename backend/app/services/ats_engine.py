import re
from typing import Dict, Any, List, Tuple
from app.services.parser import segment_resume_sections, extract_contact_info
from app.services.nlp_analyzer import extract_skills_from_text, compare_keywords, ALL_SKILLS_LOOKUP

WEAK_VERBS = [
    "helped with", "worked on", "assisted in", "responsible for", "made", "handled",
    "did", "tried", "participated in", "took care of", "involved in", "looked after"
]

STRONG_ACTION_VERBS = [
    "architected", "engineered", "orchestrated", "developed", "spearheaded",
    "implemented", "accelerated", "optimized", "deployed", "scaled", "streamlined",
    "automated", "designed", "constructed", "pioneered", "reduced", "increased"
]

SKILL_IMPORTANCE_MAP = {
    "python": "Core programming language for backend, AI, and data automation.",
    "sql": "Standard database language for querying structured relational data.",
    "docker": "Containerization standard essential for reproducible deployments.",
    "aws": "Leading cloud infrastructure provider used widely in enterprise environments.",
    "kubernetes": "Container orchestration system critical for microservice scalability.",
    "pytorch": "Dominant deep learning framework for research and model deployment.",
    "react": "Standard front-end library for interactive web user interfaces.",
    "fastapi": "Modern high-performance Python asynchronous web framework.",
    "ci/cd": "Crucial automation practice for building, testing, and continuous delivery.",
    "machine learning": "Core capability for data-driven predictive modeling.",
    "git": "Universal version control system required for collaborative engineering."
}

def analyze_resume_quality(text: str, sections: Dict[str, str]) -> Dict[str, List[Dict[str, Any]]]:
    """Inspects text for weak verbs, missing measurable metrics, repetition, and structure."""
    issues = {
        "critical": [],
        "needs_improvement": [],
        "recommendations": [],
        "good": []
    }
    
    # 1. Check for measurable metrics (numbers, percentages, metrics)
    metrics_matches = re.findall(r"\b(?:\d+[\d,.]*(?:%|x|k|m|ms|s|gb|tb)?|\$\d+[\d,.]*)\b", text, re.IGNORECASE)
    # Filter out years like 2021, 2022, 2023, 2024, 2025, 2026
    actual_metrics = [m for m in metrics_matches if not re.match(r"^20\d\d$", m)]
    if len(actual_metrics) >= 4:
        issues["good"].append({
            "title": "Quantifiable Impact Present",
            "description": f"Found {len(actual_metrics)} performance metrics or numeric achievements demonstrating concrete results."
        })
    elif len(actual_metrics) >= 1:
        issues["needs_improvement"].append({
            "title": "Limited Quantifiable Metrics",
            "description": f"Only detected {len(actual_metrics)} metric(s). Hiring managers and ATS algorithms favor quantified outcomes (e.g., 'improved throughput by 35%')."
        })
    else:
        issues["critical"].append({
            "title": "No Measurable Results Found",
            "description": "Resume lacks quantifiable achievements (%, $, latency, scale, user count). Quantify your project and work impact."
        })
        
    # 2. Check for weak vs strong action verbs
    lower_text = text.lower()
    weak_found = []
    for wv in WEAK_VERBS:
        if wv in lower_text:
            weak_found.append(wv)
            
    strong_found = []
    for sv in STRONG_ACTION_VERBS:
        if sv in lower_text:
            strong_found.append(sv)
            
    if weak_found:
        issues["needs_improvement"].append({
            "title": f"Weak Action Verbs Detected ({', '.join(weak_found[:3])})",
            "description": "Replace passive phrases like 'worked on' or 'helped with' with definitive verbs like 'engineered', 'spearheaded', or 'architected'."
        })
    if len(strong_found) >= 3:
        issues["good"].append({
            "title": "Strong Action Verb Usage",
            "description": f"Found active, high-impact verbs ({', '.join(strong_found[:3])}) establishing clear ownership."
        })
    else:
        issues["recommendations"].append({
            "title": "Incorporate More Dynamic Verbs",
            "description": "Strengthen bullet points by starting with action-oriented leadership verbs."
        })
        
    # 3. Check paragraph length and formatting
    long_paragraphs = [p for p in text.split("\n\n") if len(p.split()) > 75]
    if long_paragraphs:
        issues["needs_improvement"].append({
            "title": "Dense Text Blocks / Long Paragraphs",
            "description": f"Found {len(long_paragraphs)} block(s) with over 75 words. Break long prose into scannable 1-2 line bullet points."
        })
    else:
        issues["good"].append({
            "title": "Concise Scannable Formatting",
            "description": "Content is structured cleanly into concise, digestible statements that ATS parsers extract reliably."
        })
        
    # 4. Check contact details
    contact = extract_contact_info(text)
    if not contact.get("email"):
        issues["critical"].append({
            "title": "Missing or Unparseable Email",
            "description": "A valid professional email address was not clearly detected in the header."
        })
    if not contact.get("phone"):
        issues["recommendations"].append({
            "title": "Missing Phone Number",
            "description": "Include a standard international or local phone number for recruiter outreach."
        })
    if contact.get("linkedin") or contact.get("github"):
        issues["good"].append({
            "title": "Professional Profiles Included",
            "description": "Detected links to professional engineering profiles (LinkedIn/GitHub)."
        })
        
    # 5. Check summary section
    if "summary" in sections and len(sections["summary"].split()) >= 20:
        issues["good"].append({
            "title": "Professional Summary Present",
            "description": "Strong professional summary introduces your core value proposition immediately."
        })
    else:
        issues["recommendations"].append({
            "title": "Add a Tailored Professional Summary",
            "description": "A 2-3 sentence executive summary aligned with your target role boosts ATS keyword relevance."
        })

    return issues

def analyze_resume_structure(sections: Dict[str, str], text: str) -> Dict[str, Any]:
    """Evaluates the structural integrity and presence of expected resume sections."""
    expected_sections = [
        ("Contact Information", bool(extract_contact_info(text).get("email"))),
        ("Professional Summary", "summary" in sections),
        ("Education", "education" in sections),
        ("Skills", "skills" in sections),
        ("Projects", "projects" in sections),
        ("Experience", "experience" in sections),
        ("Certifications", "certifications" in sections),
        ("Achievements", "achievements" in sections),
        ("Languages", "languages" in sections)
    ]
    
    found = [name for name, exists in expected_sections if exists]
    missing = [name for name, exists in expected_sections if not exists]
    
    # Core sections weighted highest
    core_missing = [s for s in ["Education", "Skills", "Projects"] if s in missing]
    
    score = 100 - (len(core_missing) * 20) - (len(missing) * 5)
    score = max(40, min(100, score))
    
    return {
        "score": score,
        "sections_found": found,
        "sections_missing": missing,
        "is_ats_compliant": len(core_missing) == 0
    }

def calculate_ats_score(
    resume_text: str,
    job_description: str,
    job_role: str = ""
) -> Dict[str, Any]:
    """
    Computes real ATS compatibility scores:
    Skills Match (30%), Keyword Match (20%), Project Relevance (15%),
    Experience Relevance (15%), Education (10%), Formatting/Structure (10%).
    """
    sections = segment_resume_sections(resume_text)
    structure_eval = analyze_resume_structure(sections, resume_text)
    quality_issues = analyze_resume_quality(resume_text, sections)
    
    resume_skills_by_cat = extract_skills_from_text(resume_text)
    resume_skills_flat = set()
    for s_list in resume_skills_by_cat.values():
        resume_skills_flat.update([s.lower() for s in s_list])
        
    has_jd = bool(job_description and len(job_description.strip()) > 20)
    
    if has_jd:
        jd_skills_by_cat = extract_skills_from_text(job_description)
        jd_skills_flat = set()
        for s_list in jd_skills_by_cat.values():
            jd_skills_flat.update([s.lower() for s in s_list])
            
        kw_comp = compare_keywords(resume_text, job_description)
    else:
        # If no specific JD provided, evaluate general profile strength
        jd_skills_flat = {"python", "sql", "git", "rest api", "docker", "agile", "data modeling"}
        kw_comp = {
            "matched": [{"keyword": s, "relevance": 50, "jd_frequency": 2, "resume_frequency": 2, "found": True} 
                        for s in list(resume_skills_flat)[:8]],
            "missing": [{"keyword": "ci/cd", "relevance": 40, "jd_frequency": 2, "resume_frequency": 0, "found": False}],
            "important": [],
            "match_ratio": 75.0
        }
        
    # 1. Skills Match (30%)
    if jd_skills_flat:
        matched_skills_set = resume_skills_flat.intersection(jd_skills_flat)
        skills_match_score = round((len(matched_skills_set) / max(1, len(jd_skills_flat))) * 100)
        skills_match_score = min(100, max(20, skills_match_score))
    else:
        matched_skills_set = resume_skills_flat
        skills_match_score = min(100, max(40, len(resume_skills_flat) * 8))
        
    # 2. Keyword Match (20%)
    keyword_match_score = min(100, max(25, int(kw_comp.get("match_ratio", 50))))
    
    # 3. Project Relevance (15%)
    project_text = sections.get("projects", "") + " " + resume_text
    project_lower = project_text.lower()
    proj_skills_count = sum(1 for s in jd_skills_flat if s in project_lower)
    has_project_metrics = len(re.findall(r"\d+%", project_text)) > 0
    proj_score = (
        (60 if "projects" in sections else 20) +
        min(30, proj_skills_count * 6) +
        (10 if has_project_metrics else 0)
    )
    project_relevance_score = min(100, max(20, proj_score))
    
    # 4. Experience Relevance (15%)
    exp_text = sections.get("experience", "")
    if exp_text:
        exp_lower = exp_text.lower()
        exp_skills_count = sum(1 for s in jd_skills_flat if s in exp_lower)
        exp_score = 65 + min(30, exp_skills_count * 7)
    else:
        # If fresher/no exp section, baseline project strength can partially substitute
        exp_score = 55 if "projects" in sections else 30
    experience_relevance_score = min(100, max(20, exp_score))
    
    # 5. Education (10%)
    edu_text = sections.get("education", "")
    if edu_text:
        edu_score = 90 if any(deg in edu_text.lower() for deg in ["b.tech", "b.s", "m.s", "bachelor", "master", "ph.d", "bca", "mca"]) else 75
    else:
        edu_score = 40
    education_score = edu_score
    
    # 6. Formatting & Structure (10%)
    formatting_score = structure_eval["score"]
    
    # Weighted calculation
    overall_score = round(
        (skills_match_score * 0.30) +
        (keyword_match_score * 0.20) +
        (project_relevance_score * 0.15) +
        (experience_relevance_score * 0.15) +
        (education_score * 0.10) +
        (formatting_score * 0.10)
    )
    overall_score = max(10, min(98, overall_score))
    
    # Determine Status Level
    if overall_score >= 80:
        score_status = "Strong Match"
        score_color = "emerald"
    elif overall_score >= 60:
        score_status = "Moderate Match"
        score_color = "blue"
    elif overall_score >= 40:
        score_status = "Needs Improvement"
        score_color = "amber"
    else:
        score_status = "Weak Match"
        score_color = "rose"
        
    # Detail Skills Cards
    strong_matches = []
    missing_skills = []
    
    # For every skill in JD or resume
    all_target_skills = list(jd_skills_flat) if jd_skills_flat else list(resume_skills_flat)
    for skill_name in sorted(all_target_skills):
        is_found = skill_name in resume_skills_flat
        importance_desc = SKILL_IMPORTANCE_MAP.get(
            skill_name,
            f"Frequently expected competency in modern {job_role or 'technical'} roles."
        )
        
        # Check where it appears in JD
        jd_context = "Mentioned in core requirements and responsibilities." if (has_jd and skill_name in job_description.lower()) else "General role standard competency."
        
        entry = {
            "name": skill_name.title() if len(skill_name) > 3 else skill_name.upper(),
            "found": is_found,
            "why_it_matters": importance_desc,
            "jd_context": jd_context,
            "how_to_improve": (
                "Verified in resume." if is_found else
                f"If you have hands-on experience with {skill_name.title()}, incorporate it into your relevant project or work descriptions. Never falsely claim a skill you have not practiced."
            )
        }
        if is_found:
            strong_matches.append(entry)
        else:
            missing_skills.append(entry)
            
    # Recommendations Generation
    recommendations = []
    rec_counter = 1
    
    # Critical missing skills recommendation
    if missing_skills:
        top_missing = [s["name"] for s in missing_skills[:3]]
        recommendations.append({
            "id": f"rec-{rec_counter}",
            "section": "Skills",
            "problem": f"Target job explicitly seeks competencies in: {', '.join(top_missing)}.",
            "why_it_matters": "ATS keyword algorithms filter out candidates missing mandatory technical qualifications.",
            "original_text": "Skills section lacks target role keywords.",
            "suggested_text": f"Add verified skills: {', '.join(top_missing)} alongside existing competencies.",
            "status": "pending"
        })
        rec_counter += 1
        
    # Weak verb recommendation
    for wv in WEAK_VERBS:
        if wv in resume_text.lower():
            # Find snippet
            lines = [l for l in resume_text.split("\n") if wv in l.lower()]
            original_snippet = lines[0].strip() if lines else f"I {wv} the project."
            # Suggest improved version
            improved_snippet = original_snippet
            for bad, good in [
                ("helped with", "co-engineered and optimized"),
                ("worked on", "architected and deployed"),
                ("made", "developed high-performance"),
                ("responsible for", "spearheaded the design and execution of")
            ]:
                improved_snippet = re.sub(re.escape(bad), good, improved_snippet, flags=re.IGNORECASE)
                
            recommendations.append({
                "id": f"rec-{rec_counter}",
                "section": "Experience",
                "problem": f"Detected passive phrasing '{wv}' which weakens perceived ownership.",
                "why_it_matters": "Active voice and powerful action verbs capture recruiter attention and demonstrate direct impact.",
                "original_text": original_snippet,
                "suggested_text": improved_snippet + " resulting in a 25% efficiency gain.",
                "status": "pending"
            })
            rec_counter += 1
            break
            
    # Quantifiable metrics recommendation
    actual_metrics = [m for m in re.findall(r"\b(?:\d+[\d,.]*(?:%|x|k|m|ms|s|gb|tb)?|\$\d+[\d,.]*)\b", resume_text, re.IGNORECASE) if not re.match(r"^20\d\d$", m)]
    if len(actual_metrics) < 3:
        recommendations.append({
            "id": f"rec-{rec_counter}",
            "section": "Projects & Experience",
            "problem": "Descriptions state responsibilities rather than quantifiable achievements.",
            "why_it_matters": "Recruiters and hiring managers spend 6-7 seconds scanning for concrete numbers and proven results.",
            "original_text": "Built machine learning pipelines and optimized model response time.",
            "suggested_text": "Engineered automated machine learning pipelines with Python and Docker, reducing inference latency by 38% for 10k+ daily queries.",
            "status": "pending"
        })
        rec_counter += 1
        
    return {
        "overall_score": overall_score,
        "score_status": score_status,
        "score_color": score_color,
        "disclaimer": "This is an estimated resume-to-job compatibility score and is not a guarantee or actual probability of selection. ATSense AI estimates resume-to-job compatibility. Actual hiring decisions depend on employers, ATS configurations, recruiters, interviews, and other candidates.",
        "scores": {
            "skills_match": skills_match_score,
            "keyword_match": keyword_match_score,
            "project_relevance": project_relevance_score,
            "experience_relevance": experience_relevance_score,
            "education": education_score,
            "formatting": formatting_score
        },
        "skills": {
            "strong_matches": strong_matches,
            "missing_skills": missing_skills,
            "total_matched": len(strong_matches),
            "total_missing": len(missing_skills)
        },
        "keywords": kw_comp,
        "structure": structure_eval,
        "quality_issues": quality_issues,
        "recommendations": recommendations
    }
