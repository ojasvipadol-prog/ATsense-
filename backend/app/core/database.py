import sqlite3
import json
from contextlib import contextmanager
from app.core.config import settings
from app.core.security import hash_password

def get_db_connection():
    conn = sqlite3.connect(settings.DATABASE_PATH, timeout=15)
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def get_db():
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initializes tables and seeds default user and initial data."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. users
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 2. resumes
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS resumes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                filename TEXT NOT NULL,
                file_path TEXT,
                extracted_text TEXT NOT NULL,
                parsed_sections TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        """)
        
        # 3. job_descriptions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS job_descriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        """)
        
        # 4. analyses
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                resume_id INTEGER,
                job_title TEXT,
                job_description TEXT,
                overall_score INTEGER NOT NULL,
                scores TEXT NOT NULL,
                skills TEXT NOT NULL,
                keywords TEXT NOT NULL,
                structure TEXT NOT NULL,
                quality_issues TEXT NOT NULL,
                recommendations TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
                FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE SET NULL
            )
        """)
        
        # 5. generated_resumes
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS generated_resumes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT NOT NULL,
                template TEXT NOT NULL DEFAULT 'classic',
                content TEXT NOT NULL,
                score INTEGER DEFAULT 85,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        """)
        
        # 6. resume_versions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS resume_versions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                generated_resume_id INTEGER NOT NULL,
                version_number INTEGER NOT NULL,
                content TEXT NOT NULL,
                score INTEGER NOT NULL,
                change_summary TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (generated_resume_id) REFERENCES generated_resumes (id) ON DELETE CASCADE
            )
        """)
        
        # Seed default demo account if not exists
        cursor.execute("SELECT id FROM users WHERE email = ?", ("demo@atsense.ai",))
        if not cursor.fetchone():
            demo_pass = hash_password("password123")
            cursor.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                ("Alex Morgan", "demo@atsense.ai", demo_pass)
            )
            demo_user_id = cursor.lastrowid
            
            # Seed demo sample resume
            sample_content = {
                "personal": {
                    "fullName": "Alex Morgan",
                    "email": "alex.morgan@example.com",
                    "phone": "+1 (555) 019-2834",
                    "location": "San Francisco, CA",
                    "linkedin": "linkedin.com/in/alexmorgan-ai",
                    "github": "github.com/alexmorgan-dev",
                    "portfolio": "alexmorgan.tech",
                    "summary": "Results-driven Machine Learning Engineer with 2+ years of hands-on experience designing, training, and deploying scalable deep learning models. Proficient in Python, PyTorch, Scikit-learn, and cloud microservices. Passionate about LLM fine-tuning and high-throughput real-time inference systems."
                },
                "education": [
                    {
                        "degree": "B.S. in Computer Science & AI",
                        "college": "School of Engineering",
                        "university": "University of California, Berkeley",
                        "year": "2023",
                        "cgpa": "3.85 / 4.0"
                    }
                ],
                "skills": {
                    "Programming": ["Python", "C++", "SQL", "JavaScript", "TypeScript"],
                    "AI/ML": ["PyTorch", "TensorFlow", "Scikit-Learn", "HuggingFace", "NLP", "Computer Vision"],
                    "Web Development": ["FastAPI", "React", "Node.js", "REST APIs"],
                    "Databases": ["PostgreSQL", "Redis", "MongoDB", "Pinecone"],
                    "Cloud & DevOps": ["AWS (EC2, S3)", "Docker", "Git", "CI/CD"],
                    "Soft Skills": ["Team Leadership", "Agile", "Technical Communication", "Problem Solving"]
                },
                "projects": [
                    {
                        "name": "Neural Vision Defect Detector",
                        "technologies": "PyTorch, FastAPI, Docker, OpenCV",
                        "description": "Developed a real-time surface defect classification pipeline achieving 96.4% precision on industrial inspection datasets.",
                        "responsibilities": "Trained ResNet-50 backbone with custom attention heads and deployed as a Dockerized REST microservice.",
                        "results": "Decreased quality inspection latency by 42% across manufacturing production lines."
                    },
                    {
                        "name": "Semantic Document Search Engine",
                        "technologies": "Python, Sentence-Transformers, Pinecone, Streamlit",
                        "description": "Engineered an enterprise vector search system for instant semantic similarity indexing over 100k+ PDF documents.",
                        "responsibilities": "Implemented dense embeddings pipeline with BM25 hybrid ranking and sub-50ms query retrieval.",
                        "results": "Improved internal knowledge base discovery speed by 3.5x for 500+ daily active users."
                    }
                ],
                "experience": [
                    {
                        "company": "Cognitive AI Labs",
                        "position": "Junior Machine Learning Engineer",
                        "duration": "2023 - Present",
                        "responsibilities": "Spearheaded model retraining workflows and optimized deep learning inference endpoints.",
                        "achievements": "Reduced GPU memory consumption by 35% through 8-bit quantization and model pruning."
                    }
                ],
                "certifications": [
                    "AWS Certified Solutions Architect – Associate",
                    "DeepLearning.AI Machine Learning Specialization"
                ],
                "achievements": [
                    "1st Place Winner at HackCal 2023 with AI healthcare triage system",
                    "Author of open-source vector benchmark repository with 800+ GitHub stars"
                ]
            }
            
            cursor.execute(
                """
                INSERT INTO generated_resumes (user_id, title, template, content, score)
                VALUES (?, ?, ?, ?, ?)
                """,
                (demo_user_id, "Alex Morgan - ML Engineer Resume", "modern", json.dumps(sample_content), 88)
            )
            gen_id = cursor.lastrowid
            
            # Version 1
            cursor.execute(
                """
                INSERT INTO resume_versions (generated_resume_id, version_number, content, score, change_summary)
                VALUES (?, ?, ?, ?, ?)
                """,
                (gen_id, 1, json.dumps(sample_content), 76, "Initial draft from profile information")
            )
            # Version 2 (Improved)
            cursor.execute(
                """
                INSERT INTO resume_versions (generated_resume_id, version_number, content, score, change_summary)
                VALUES (?, ?, ?, ?, ?)
                """,
                (gen_id, 2, json.dumps(sample_content), 88, "Added quantifiable metrics, strengthened action verbs, integrated target keywords")
            )
