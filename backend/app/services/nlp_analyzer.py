import re
from typing import List, Dict, Set, Tuple, Any
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Curated high-impact technical and domain skills dictionary
COMMON_SKILLS_TAXONOMY = {
    "Programming": [
        "python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "golang",
        "rust", "ruby", "php", "swift", "kotlin", "sql", "html", "css", "r", "scala", "shell", "bash"
    ],
    "AI / Machine Learning": [
        "machine learning", "deep learning", "neural networks", "pytorch", "tensorflow", "keras",
        "scikit-learn", "nlp", "natural language processing", "computer vision", "llm", "large language models",
        "transformers", "huggingface", "opencv", "generative ai", "langchain", "llama", "reinforcement learning",
        "bert", "diffusion models", "embeddings", "vector database", "fine-tuning", "rag"
    ],
    "Cloud & DevOps": [
        "aws", "amazon web services", "azure", "google cloud", "gcp", "docker", "kubernetes",
        "ci/cd", "terraform", "jenkins", "linux", "git", "github actions", "ansible", "prometheus",
        "grafana", "helm", "serverless", "microservices", "nginx", "cloudformation"
    ],
    "Web & App Development": [
        "react", "react.js", "next.js", "vue", "angular", "node.js", "express", "fastapi",
        "django", "flask", "spring boot", "tailwind", "tailwind css", "rest api", "graphql",
        "redux", "websockets", "vite", "bootstrap", "material ui"
    ],
    "Data & Databases": [
        "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch", "sqlite",
        "cassandra", "dynamodb", "snowflake", "bigquery", "pandas", "numpy", "spark", "apache spark",
        "kafka", "data modeling", "etl", "data warehouse", "tableau", "power bi"
    ],
    "Software Practices & Soft Skills": [
        "agile", "scrum", "unit testing", "tdd", "system design", "code review", "problem solving",
        "leadership", "communication", "collaboration", "cross-functional", "project management",
        "debugging", "performance optimization", "clean code", "analytical skills"
    ]
}

# Flattened list for quick matching
ALL_SKILLS_LOOKUP = {}
for category, skills in COMMON_SKILLS_TAXONOMY.items():
    for s in skills:
        ALL_SKILLS_LOOKUP[s] = category

STOPWORDS = {
    "and", "the", "to", "of", "in", "for", "with", "a", "an", "as", "at", "by", "from",
    "on", "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does",
    "did", "will", "would", "shall", "should", "may", "might", "must", "can", "could",
    "that", "which", "who", "whom", "this", "these", "those", "we", "our", "you", "your",
    "they", "their", "it", "its", "or", "but", "not", "if", "into", "up", "down", "out",
    "about", "over", "under", "again", "further", "then", "once", "here", "there", "when",
    "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other",
    "some", "such", "no", "nor", "only", "own", "same", "so", "than", "too", "very", "s", "t"
}

def extract_skills_from_text(text: str) -> Dict[str, List[str]]:
    """Extracts known taxonomy skills found in the text."""
    lower_text = " " + re.sub(r"[^\w\s\+\#\./-]", " ", text.lower()) + " "
    found_skills: Dict[str, Set[str]] = {cat: set() for cat in COMMON_SKILLS_TAXONOMY}
    
    # Sort skills by length descending to match multi-word phrases first
    sorted_skills = sorted(ALL_SKILLS_LOOKUP.keys(), key=lambda x: len(x), reverse=True)
    
    for skill in sorted_skills:
        # Match as discrete word or bounded symbol
        pattern = r"(?:^|[\s,;:\(\)\[\]])" + re.escape(skill) + r"(?:$|[\s,;:\(\)\[\]])"
        if re.search(pattern, lower_text):
            category = ALL_SKILLS_LOOKUP[skill]
            # Standardize capitalization
            display_skill = skill.title()
            if skill in ["aws", "gcp", "nlp", "llm", "rag", "sql", "api", "rest api", "ci/cd", "etl"]:
                display_skill = skill.upper()
            elif skill in ["react.js", "node.js", "next.js", "vue", "docker", "pytorch", "fastapi"]:
                display_skill = skill.capitalize()
            found_skills[category].add(display_skill)
            
    return {k: sorted(list(v)) for k, v in found_skills.items() if v}

def extract_keywords_tfidf(text: str, top_n: int = 25) -> List[Dict[str, Any]]:
    """Extracts top significant keywords and n-grams using TF-IDF."""
    if not text.strip():
        return []
        
    try:
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words="english",
            max_features=50,
            token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z0-9\+\#\.-]{1,}\b"
        )
        tfidf_matrix = vectorizer.fit_transform([text])
        feature_names = vectorizer.get_feature_names_out()
        scores = tfidf_matrix.toarray()[0]
        
        keyword_scores = []
        for name, score in zip(feature_names, scores):
            cleaned = name.strip().lower()
            if len(cleaned) < 3 or cleaned in STOPWORDS:
                continue
            keyword_scores.append((cleaned, float(score)))
            
        keyword_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Calculate occurrence frequencies in raw text
        result = []
        lower_raw = text.lower()
        for kw, score in keyword_scores[:top_n]:
            freq = len(re.findall(r"\b" + re.escape(kw) + r"\b", lower_raw))
            result.append({
                "keyword": kw,
                "relevance": round(score * 100, 1),
                "frequency": max(1, freq)
            })
        return result
    except Exception:
        # Fallback to word counter
        words = [w.lower() for w in re.findall(r"\b[a-zA-Z]{3,}\b", text) if w.lower() not in STOPWORDS]
        counts = Counter(words).most_common(top_n)
        return [{"keyword": w, "relevance": round(c * 10, 1), "frequency": c} for w, c in counts]

def compare_keywords(resume_text: str, jd_text: str) -> Dict[str, Any]:
    """Compares keywords between resume and job description."""
    jd_keywords = extract_keywords_tfidf(jd_text, top_n=30)
    resume_lower = resume_text.lower()
    
    matched = []
    missing = []
    important = []
    
    for item in jd_keywords:
        kw = item["keyword"]
        freq_in_resume = len(re.findall(r"\b" + re.escape(kw) + r"\b", resume_lower))
        entry = {
            "keyword": kw,
            "relevance": item["relevance"],
            "jd_frequency": item["frequency"],
            "resume_frequency": freq_in_resume,
            "found": freq_in_resume > 0,
            "suggested_placement": "Experience or Skills section" if item["relevance"] > 25 else "Projects or Summary"
        }
        if freq_in_resume > 0:
            matched.append(entry)
        else:
            missing.append(entry)
            
        if item["relevance"] >= 20:
            important.append(entry)
            
    return {
        "matched": matched,
        "missing": missing,
        "important": important,
        "match_ratio": round((len(matched) / max(1, len(jd_keywords))) * 100, 1)
    }
