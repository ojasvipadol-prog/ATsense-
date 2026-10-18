import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Info,
  Check,
  Edit2,
  X,
  Wand2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Layers,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadgeModal } from '../components/SkillBadgeModal';

export const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [editingRecId, setEditingRecId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    // Read from session storage or fallback sample
    const cached = sessionStorage.getItem('current_analysis');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setAnalysis(parsed);
        setRecommendations(parsed.recommendations || []);
        if (parsed.overall_score >= 80) {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
        return;
      } catch (e) {}
    }

    // Default high-fidelity sample if navigated directly
    const defaultSample = {
      overall_score: 87,
      score_status: "Strong Match",
      disclaimer: "This is an estimated resume-to-job compatibility score and is not a guarantee or actual probability of selection. ATSense AI estimates resume-to-job compatibility. Actual hiring decisions depend on employers, ATS configurations, recruiters, interviews, and other candidates.",
      scores: {
        skills_match: 91,
        keyword_match: 84,
        project_relevance: 88,
        experience_relevance: 79,
        education: 95,
        formatting: 86
      },
      skills: {
        strong_matches: [
          { name: "Python", found: true, why_it_matters: "Core language required for backend, algorithms, and AI tooling.", jd_context: "Required in primary stack qualifications.", how_to_improve: "Verified in resume." },
          { name: "SQL", found: true, why_it_matters: "Essential for database querying, data manipulation, and metrics extraction.", jd_context: "Mentioned in database manipulation criteria.", how_to_improve: "Verified in resume." },
          { name: "Machine Learning", found: true, why_it_matters: "Core subject matter competency for algorithmic modeling.", jd_context: "Primary role domain requirement.", how_to_improve: "Verified in resume." },
          { name: "PyTorch", found: true, why_it_matters: "Leading deep learning framework used for production model training.", jd_context: "Listed as preferred deep learning library.", how_to_improve: "Verified in resume." },
          { name: "FastAPI", found: true, why_it_matters: "Asynchronous microservice standard for Python API endpoints.", jd_context: "Mentioned in API serving requirements.", how_to_improve: "Verified in resume." }
        ],
        missing_skills: [
          { name: "Docker", found: false, why_it_matters: "Containerization standard essential for reproducible model deployment.", jd_context: "Listed in deployment and infrastructure stack.", how_to_improve: "If you have containerized applications, highlight Docker and Docker Compose under your technical projects. Never falsely claim a skill." },
          { name: "AWS", found: false, why_it_matters: "Leading enterprise cloud provider; familiarity with S3 and EC2 is high-value.", jd_context: "Mentioned under cloud microservices requirements.", how_to_improve: "If you have utilized AWS free tier or academic credits, mention specific services (e.g., S3, Lambda). Never fabricate experience." },
          { name: "Kubernetes", found: false, why_it_matters: "Container orchestration platform for scalable high-load microservices.", jd_context: "Desirable for production scale.", how_to_improve: "Consider taking a certified Kubernetes basics tutorial and adding a mini cluster deployment project." }
        ]
      },
      keywords: {
        matched: [
          { keyword: "deep learning", relevance: 88, jd_frequency: 3, resume_frequency: 2, found: true, suggested_placement: "Skills & Summary" },
          { keyword: "microservices", relevance: 75, jd_frequency: 2, resume_frequency: 1, found: true, suggested_placement: "Experience" },
          { keyword: "neural networks", relevance: 82, jd_frequency: 2, resume_frequency: 2, found: true, suggested_placement: "Projects" },
          { keyword: "optimization", relevance: 70, jd_frequency: 3, resume_frequency: 1, found: true, suggested_placement: "Experience" }
        ],
        missing: [
          { keyword: "ci/cd pipelines", relevance: 65, jd_frequency: 2, resume_frequency: 0, found: false, suggested_placement: "Projects or Tools" },
          { keyword: "kubernetes", relevance: 60, jd_frequency: 2, resume_frequency: 0, found: false, suggested_placement: "Cloud Skills" },
          { keyword: "vector database", relevance: 72, jd_frequency: 2, resume_frequency: 0, found: false, suggested_placement: "AI Projects" }
        ],
        important: [
          { keyword: "pytorch", relevance: 92, jd_frequency: 4, resume_frequency: 3, found: true, suggested_placement: "Skills & Projects" },
          { keyword: "latency optimization", relevance: 80, jd_frequency: 2, resume_frequency: 1, found: true, suggested_placement: "Experience" }
        ]
      },
      structure: {
        score: 86,
        sections_found: ["Contact Information", "Professional Summary", "Education", "Skills", "Projects", "Experience"],
        sections_missing: ["Certifications", "Achievements", "Languages"],
        is_ats_compliant: true
      },
      quality_issues: {
        critical: [
          { title: "No Quantifiable Metrics in Recent Project", description: "Project 2 states 'built search engine' without citing user traffic, latency improvements, or dataset size." }
        ],
        needs_improvement: [
          { title: "Passive Verbs Detected", description: "Found 'helped with' and 'responsible for' in experience section. Strengthen with definitive action verbs." }
        ],
        recommendations: [
          { title: "Expand Technical Certifications", description: "Adding verified cloud certifications (AWS/GCP/Coursera) can raise candidate tier." }
        ],
        good: [
          { title: "Standard ATS Section Headings", description: "Clean single-column structure ensures Workday and Taleo extract text accurately." },
          { title: "Clear Contact Information", description: "Email, phone number, and LinkedIn handles are properly formatted." }
        ]
      },
      recommendations: [
        {
          id: "rec-1",
          section: "Projects",
          problem: "Vague project description with zero quantifiable outcomes.",
          why_it_matters: "ATS keyword scorers and hiring managers look for scale indicators (e.g., latency, dataset size, percentage accuracy).",
          original_text: "Built a machine learning project to detect defects on manufacturing lines.",
          suggested_text: "Developed a convolutional defect classification pipeline using PyTorch and OpenCV, achieving 96.4% precision and reducing inspection latency by 42%.",
          status: "pending"
        },
        {
          id: "rec-2",
          section: "Experience",
          problem: "Passive wording 'Worked on backend API endpoints.'",
          why_it_matters: "Action verbs convey ownership and engineering maturity.",
          original_text: "Worked on backend API endpoints using FastAPI.",
          suggested_text: "Architected asynchronous REST microservices using FastAPI and Docker, handling 15,000+ daily requests with sub-50ms response times.",
          status: "pending"
        }
      ]
    };

    setAnalysis(defaultSample);
    setRecommendations(defaultSample.recommendations);
  }, []);

  if (!analysis) return null;

  const handleAcceptRec = (id) => {
    setRecommendations(recommendations.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  };

  const handleRejectRec = (id) => {
    setRecommendations(recommendations.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const handleStartEdit = (rec) => {
    setEditingRecId(rec.id);
    setEditText(rec.suggested_text);
  };

  const handleSaveEdit = (id) => {
    setRecommendations(recommendations.map(r => r.id === id ? { ...r, suggested_text: editText, status: 'accepted' } : r));
    setEditingRecId(null);
  };

  const scores = analysis.scores || {};
  const strongMatches = analysis.skills?.strong_matches || [];
  const missingSkills = analysis.skills?.missing_skills || [];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner / Disclaimer */}
      <div className="mb-8 p-4 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          <span className="font-bold">Official ATS Disclaimer: </span>
          {analysis.disclaimer}
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="mb-10 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Circular Score */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center lg:border-r border-slate-100 dark:border-slate-800 lg:pr-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              ATS Compatibility Index
            </span>
            <ScoreGauge score={analysis.overall_score} size={200} strokeWidth={15} showStatus={true} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
              Estimated ATS Match Score
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Evaluated against corporate applicant tracking algorithms and target role taxonomy.
            </p>
          </div>

          {/* Subscore Breakdown & Benchmark */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Score Dimensions & Weighting
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  6-Factor Algorithmic Audit
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Calculated dynamically from extracted resume syntax and job requirements.
              </p>
            </div>

            {/* 6 Category Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Skills Match', val: scores.skills_match || 91, weight: '30%' },
                { label: 'Keywords', val: scores.keyword_match || 84, weight: '20%' },
                { label: 'Projects', val: scores.project_relevance || 88, weight: '15%' },
                { label: 'Experience', val: scores.experience_relevance || 79, weight: '15%' },
                { label: 'Education', val: scores.education || 95, weight: '10%' },
                { label: 'Formatting', val: scores.formatting || 86, weight: '10%' },
              ].map((item) => (
                <div key={item.label} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500 truncate">{item.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.weight})</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.val}%
                    </span>
                    <span className={`text-[10px] font-semibold ${item.val >= 80 ? 'text-emerald-500' : 'text-blue-500'}`}>
                      {item.val >= 80 ? 'Optimal' : 'Good'}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.val >= 80 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Fix My Resume Prominent CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60">
              <div>
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-blue-600" />
                  <span>Interactive AI Correction Ready</span>
                </div>
                <div className="text-[11px] text-blue-700 dark:text-blue-400">
                  Inspect side-by-side diffs with green/yellow/red highlights.
                </div>
              </div>

              <Link
                to="/fix"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>✨ Fix My Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Score Levels Legend */}
      <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
          <div className="font-bold text-emerald-700 dark:text-emerald-400">80 – 100: Strong Match</div>
          <div className="text-[11px] text-slate-500">Exceeds standard recruiter & ATS screening filters.</div>
        </div>
        <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/60">
          <div className="font-bold text-blue-700 dark:text-blue-400">60 – 79: Moderate Match</div>
          <div className="text-[11px] text-slate-500">Passes baseline filters but needs keyword polish.</div>
        </div>
        <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60">
          <div className="font-bold text-amber-700 dark:text-amber-400">40 – 59: Needs Improvement</div>
          <div className="text-[11px] text-slate-500">Lacks key technical qualifiers and action phrasing.</div>
        </div>
        <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/60">
          <div className="font-bold text-rose-700 dark:text-rose-400">Below 40: Weak Match</div>
          <div className="text-[11px] text-slate-500">Requires structural redesign and major upskilling.</div>
        </div>
      </div>

      {/* Skill Analysis: Strong Matches vs Missing Skills */}
      <div className="mb-10">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Skill Compatibility Diagnostic
          </h2>
          <p className="text-xs text-slate-500">
            Click any skill badge to inspect why it matters, its job description context, and how to improve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strong Matches */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ✓ Strong Matches ({strongMatches.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                Verified in Resume
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {strongMatches.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{skill.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Missing / Weak Skills */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ⚠ Missing / Weak Skills ({missingSkills.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                Action Required
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 text-xs font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{skill.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Keyword Analysis Section */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            TF-IDF Keyword Relevance & Placement
          </h2>
          <p className="text-xs text-slate-500">
            Click any keyword to see its resume presence, frequency in job description, and suggested placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Matched Keywords */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Matched Keywords
            </h3>
            <div className="space-y-2">
              {(analysis.keywords?.matched || []).slice(0, 5).map((kw) => (
                <div
                  key={kw.keyword}
                  onClick={() => setSelectedKeyword(kw)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between items-center cursor-pointer hover:border-emerald-300 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white capitalize">{kw.keyword}</div>
                    <div className="text-[10px] text-slate-400">Found {kw.resume_frequency}x in resume</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600">{kw.relevance}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Missing High-Impact Keywords
            </h3>
            <div className="space-y-2">
              {(analysis.keywords?.missing || []).slice(0, 5).map((kw) => (
                <div
                  key={kw.keyword}
                  onClick={() => setSelectedKeyword(kw)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between items-center cursor-pointer hover:border-rose-300 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white capitalize">{kw.keyword}</div>
                    <div className="text-[10px] text-slate-400">In JD {kw.jd_frequency}x • Missing in resume</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-500">{kw.relevance}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Placement */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Placement Optimization
            </h3>
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300 space-y-2.5">
              <div className="font-bold">Algorithmic Placement Strategy:</div>
              <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-300">
                1. <strong>Summary:</strong> Top 3 target skills (e.g. Python, Machine Learning).
              </p>
              <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-300">
                2. <strong>Experience:</strong> Active verbs + quantifiable impact (%) + technical tools.
              </p>
              <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-300">
                3. <strong>Projects:</strong> Mention specific frameworks (FastAPI, Docker, PyTorch) in brackets.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Keyword Modal */}
      {selectedKeyword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                  {selectedKeyword.keyword}
                </h3>
                <span className="text-[11px] text-blue-600 font-semibold">
                  Relevance Score: {selectedKeyword.relevance}%
                </span>
              </div>
              <button onClick={() => setSelectedKeyword(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div><strong>Job Description Count:</strong> {selectedKeyword.jd_frequency} appearances</div>
              <div><strong>Resume Count:</strong> {selectedKeyword.resume_frequency} appearances</div>
              <div><strong>Suggested Placement:</strong> {selectedKeyword.suggested_placement}</div>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedKeyword(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold dark:bg-white dark:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Structure Analysis */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Resume Structure & Section Compliance
            </h2>
            <p className="text-xs text-slate-500">Essential sections expected by corporate ATS parsers</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200">
            Structure Score: {analysis.structure?.score || 86}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            "Contact Information",
            "Professional Summary",
            "Education",
            "Skills",
            "Projects",
            "Experience",
            "Certifications",
            "Achievements",
            "Languages"
          ].map((sec) => {
            const isFound = (analysis.structure?.sections_found || []).includes(sec);
            return (
              <div
                key={sec}
                className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                  isFound
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                {isFound ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="font-semibold truncate">{sec}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resume Quality Analysis Categorized (Critical, Needs Improvement, Recommendation, Good) */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Resume Quality & Phrasing Audit
          </h2>
          <p className="text-xs text-slate-500">Categorized issues detected by NLP grammar and metric evaluators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Critical */}
          {(analysis.quality_issues?.critical || []).map((issue, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
              <div className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 mb-1">
                <span>🔴 Critical:</span>
                <span>{issue.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{issue.description}</p>
            </div>
          ))}

          {/* Needs Improvement */}
          {(analysis.quality_issues?.needs_improvement || []).map((issue, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                <span>🟠 Needs Improvement:</span>
                <span>{issue.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{issue.description}</p>
            </div>
          ))}

          {/* Recommendations */}
          {(analysis.quality_issues?.recommendations || []).map((issue, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
              <div className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 mb-1">
                <span>🟡 Recommendation:</span>
                <span>{issue.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{issue.description}</p>
            </div>
          ))}

          {/* Good */}
          {(analysis.quality_issues?.good || []).map((issue, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                <span>🟢 Good:</span>
                <span>{issue.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{issue.description}</p>
            </div>
          ))}

        </div>
      </div>

      {/* AI Recommendations with Accept, Edit, Reject buttons */}
      <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-blue-600" />
              <span>AI Resume Guidance & Bullet Rewrites</span>
            </h2>
            <p className="text-xs text-slate-500">
              Review specific improvements with quantifiable results. Accept, edit, or decline each suggestion.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all ${
                rec.status === 'accepted'
                  ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : rec.status === 'rejected'
                  ? 'opacity-40 border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {rec.section} Improvement
                </span>
                {rec.status === 'accepted' && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Accepted
                  </span>
                )}
                {rec.status === 'rejected' && (
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Rejected
                  </span>
                )}
              </div>

              {/* Problem */}
              <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                Problem: {rec.problem}
              </div>
              <div className="text-[11px] text-slate-500 mb-3">
                Why it matters: {rec.why_it_matters}
              </div>

              {/* Before vs After */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                  <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5 text-[10px] uppercase">
                    Original:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">"{rec.original_text}"</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5 text-[10px] uppercase">
                    Suggested AI Rewrite:
                  </span>
                  {editingRecId === rec.id ? (
                    <div className="space-y-2 mt-1">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border rounded-lg text-xs bg-white dark:bg-slate-900"
                        rows={3}
                      />
                      <button
                        onClick={() => handleSaveEdit(rec.id)}
                        className="px-3 py-1 bg-emerald-600 text-white font-semibold text-xs rounded-lg"
                      >
                        Save & Accept
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-800 dark:text-slate-100 font-medium">"{rec.suggested_text}"</span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Accept, Edit, Reject */}
              {rec.status === 'pending' && editingRecId !== rec.id && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => handleRejectRec(rec.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStartEdit(rec)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleAcceptRec(rec.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skill Modal */}
      {selectedSkill && (
        <SkillBadgeModal
          skill={selectedSkill}
          isOpen={!!selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}

    </div>
  );
};
