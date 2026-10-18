# ATSense AI

> **Analyze. Optimize. Get Hired.**

**ATSense AI** is an AI-powered resume and career intelligence platform engineered for students, freshers, and job seekers. It provides real-time ATS compatibility diagnostics, evaluates technical skill gaps, analyzes keyword density, provides concrete actionable recommendations with quantified bullet rewrites, and enables multi-template professional resume generation with authentic PDF and DOCX exports.

---

## 🚀 Core Features

- **ATS Resume Analyzer**: Real neural extraction and parsing of PDF and DOCX files. Evaluates syntax, standard section headings, and machine readability across Workday, Taleo, and Greenhouse criteria.
- **Configurable 6-Factor ATS Scoring Engine**:
  - Skills Match — 30%
  - Keyword Match (TF-IDF) — 20%
  - Project Relevance & Scale — 15%
  - Experience Depth — 15%
  - Education & Credentials — 10%
  - Formatting & Structure — 10%
- **Interactive Skill Gap Diagnostics**:
  - Categorizes verified strengths vs missing competencies.
  - Interactive drill-down modal showing **Why It Matters**, **Job Description Context**, and **How to Improve Ethically** (never recommending dishonest resume padding).
- **TF-IDF Keyword Relevance & Suggested Placement**: Identifies mandatory unigrams and bigrams, presence frequency, and algorithmic section placement strategy.
- **Resume Quality & Phrasing Audit**: Classifies issues into **🔴 Critical**, **🟠 Needs Improvement**, **🟡 Recommendation**, and **🟢 Good**.
- **Interactive AI Resume Guidance**: Before-and-after bullet rewrites replacing passive phrases (*"worked on"*, *"helped with"*) with active verbs (*"architected"*, *"orchestrated"*, *"spearheaded"*) and quantified impact benchmarks. Supports **Accept**, **Edit**, and **Reject**.
- **✨ Fix My Resume Workspace**: Side-by-side comparative inspection with color-coded diff highlights:
  - 🟢 Green = Added / Strengthened
  - 🟡 Yellow = Modified Phrasing
  - 🔴 Red = Removed Passive Phrases
- **Multi-Step AI Resume Builder & Live Split Preview**:
  - 8-step wizard: Personal Info, Education, Skills, Projects, Experience, Certifications, Achievements, Templates & Export.
  - Real-time live A4 resume preview with zoom and full-screen controls.
  - 4 ATS-optimized templates:
    1. **ATS Classic**: Single-column, timeless, standard ATS layout.
    2. **Modern Professional**: Clean modern design with blue accents.
    3. **Fresher Focus**: Prioritizes education, academic CGPA, and capstones.
    4. **Technical Stack**: Prioritizes programming tools, GitHub handles, and systems engineering.
- **Authentic PDF & DOCX Generation**: Generates real binary PDF (via ReportLab) and Microsoft Word (.docx) files.
- **Job Matcher Engine**: Dedicated role fit calculator comparing any resume text against target job requirements.
- **Interactive Career Roadmap**: Milestone timeline from core competencies to production project deployments and targeted applications.
- **Resume History & Version Comparison**: Tracks version progression (e.g., Before 65/100 vs After 87/100, displaying **+22 improvement**).
- **Dark Mode**: Seamless theme toggle with persistent state.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 with custom glassmorphism and gradient design tokens
- **Routing**: React Router v7
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts (Area charts, Bar distributions)
- **Celebration Effects**: Canvas Confetti

### Backend
- **Framework**: Python 3.13 + FastAPI + Uvicorn
- **NLP & Keyword Extraction**: scikit-learn (TF-IDF vectorizer), NumPy, regular expression entity parsers
- **Document Parsing**: `pypdf` (PDF text extraction), `python-docx` (DOCX paragraph & table parsing)
- **Document Generation**: `reportlab` (vector PDF generation), `python-docx` (Word formatting)
- **Security & Auth**: Bcrypt password hashing, PyJWT bearer tokens

### Database
- **Engine**: SQLite3 (`backend/data/atsense.db`) with relational tables and JSON column support:
  - `users`
  - `resumes`
  - `job_descriptions`
  - `analyses`
  - `generated_resumes`
  - `resume_versions`

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on v24)
- **Python** 3.10+ (tested on 3.13)

### 2. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000`.  
Interactive Swagger API documentation: `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server will launch at `http://127.0.0.1:5173`.

---

## 👤 Demo Account

You can sign in using the **1-Click Demo Login** button on the Login page, or enter:
- **Email**: `demo@atsense.ai`
- **Password**: `password123`

---

## 📁 Project Structure

```
ATSsystem/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py          # Register, Login, Me, Password Reset
│   │   │   ├── resume.py        # Upload, Real ATS Analysis, AI Improvements, Generation
│   │   │   ├── export.py        # Real PDF & DOCX file streaming
│   │   │   ├── job.py           # Job Matcher & Career Guidance
│   │   │   └── history.py       # Stats, Resume History, Version Comparison
│   │   ├── core/
│   │   │   ├── config.py        # Environment settings & directory initialization
│   │   │   ├── database.py      # SQLite schema, tables, and demo seed data
│   │   │   └── security.py      # Bcrypt & JWT helpers
│   │   ├── services/
│   │   │   ├── parser.py        # PDF & DOCX text extraction & section segmentation
│   │   │   ├── nlp_analyzer.py  # Skill taxonomy extraction & TF-IDF keyword analysis
│   │   │   ├── ats_engine.py    # 6-dimension weighted ATS scoring & quality audit
│   │   │   ├── ai_improver.py   # Quantified bullet rewrites & side-by-side diff generator
│   │   │   └── exporter.py      # Real PDF & DOCX generation for 4 templates
│   │   └── main.py              # FastAPI app configuration & CORS
│   ├── sample_resumes/          # Generated test files (Alex_Morgan_ML_Engineer.pdf/.docx)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── ScoreGauge.jsx   # Animated circular SVG score indicator
│   │   │   ├── SkillBadgeModal.jsx # Skill details & ethical improvement popover
│   │   │   ├── ProcessingAnimation.jsx # Sequential 8-step AI progress screen
│   │   │   └── ResumeTemplates/ # 4 Live preview templates
│   │   │       ├── ClassicTemplate.jsx
│   │   │       ├── ModernTemplate.jsx
│   │   │       ├── FresherTemplate.jsx
│   │   │       └── TechnicalTemplate.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Hero mock dashboard, features, timeline
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx    # Analytics charts & resume manager
│   │   │   ├── AnalyzerPage.jsx # Drag-and-drop uploader & JD input
│   │   │   ├── ResultsPage.jsx  # Full ATS diagnostic report & recommendations
│   │   │   ├── FixResumePage.jsx # Interactive side-by-side diff workspace
│   │   │   ├── ResumeBuilderPage.jsx # 8-step wizard & live split preview
│   │   │   ├── JobMatcherPage.jsx # Role fit calculator
│   │   │   ├── CareerGuidancePage.jsx # Interactive career roadmap & projects
│   │   │   ├── ResumeHistoryPage.jsx
│   │   │   └── VersionComparisonPage.jsx # Before vs After delta audit
│   │   ├── services/
│   │   │   └── api.js           # Unified API client
│   │   ├── App.jsx
│   │   ├── index.css            # Tailwind v4 theme tokens & glassmorphism
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚖️ Ethical AI & ATS Disclaimer

ATSense AI estimates resume-to-job compatibility based on algorithmic screening standards. Actual hiring decisions depend on employers, specific ATS configurations, recruiters, interviews, and candidate competition. The platform strictly encourages truthful representation and provides actionable guidance on how to ethically articulate verified technical accomplishments.

