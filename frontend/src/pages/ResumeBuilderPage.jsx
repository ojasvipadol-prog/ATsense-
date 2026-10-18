import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileText,
  CheckCircle2,
  Check,
  ChevronRight,
  Layers,
  Wand2,
  Loader2,
  Lock,
  Unlock,
  X,
  Save
} from 'lucide-react';
import { ClassicTemplate } from '../components/ResumeTemplates/ClassicTemplate';
import { ModernTemplate } from '../components/ResumeTemplates/ModernTemplate';
import { FresherTemplate } from '../components/ResumeTemplates/FresherTemplate';
import { TechnicalTemplate } from '../components/ResumeTemplates/TechnicalTemplate';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const STEPS = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'projects', title: 'Projects' },
  { id: 'experience', title: 'Experience' },
  { id: 'certifications', title: 'Certifications' },
  { id: 'achievements', title: 'Achievements' },
  { id: 'templates', title: 'Templates & Export' }
];

export const ResumeBuilderPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [template, setTemplate] = useState('modern'); // 'classic', 'modern', 'fresher', 'technical'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPersonalInfoFrozen, setIsPersonalInfoFrozen] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState(() => {
    const qId = searchParams.get('id');
    return qId ? parseInt(qId, 10) : null;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saved' | 'error' | null

  // Resume form state
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexmorgan',
      github: 'github.com/alexmorgan-dev',
      portfolio: 'alexmorgan.tech',
      summary: 'Results-driven Machine Learning Engineer with 2+ years of hands-on experience designing, training, and deploying scalable deep learning models. Proficient in Python, PyTorch, Scikit-learn, and cloud microservices.'
    },
    education: [
      {
        degree: 'B.S. in Computer Science & AI',
        college: 'College of Engineering',
        university: 'University of California, Berkeley',
        year: '2023',
        cgpa: '3.85 / 4.0'
      }
    ],
    skills: {
      'Programming': ['Python', 'SQL', 'C++', 'TypeScript'],
      'AI/ML': ['PyTorch', 'TensorFlow', 'Scikit-learn', 'HuggingFace', 'NLP'],
      'Web Development': ['FastAPI', 'React', 'Node.js', 'REST APIs'],
      'Databases & Cloud': ['PostgreSQL', 'Redis', 'AWS (EC2, S3)', 'Docker', 'Git'],
      'Soft Skills': ['System Design', 'Agile Collaboration', 'Technical Communication']
    },
    projects: [
      {
        name: 'Neural Vision Defect Detector',
        technologies: 'PyTorch, FastAPI, Docker, OpenCV',
        description: 'Developed an industrial surface defect classification pipeline achieving 96.4% precision on high-throughput inspection datasets.',
        responsibilities: 'Trained ResNet-50 backbone with custom attention heads and deployed as a Dockerized REST microservice.',
        results: 'Decreased quality inspection latency by 42% across manufacturing production lines.'
      },
      {
        name: 'Semantic Document Search Engine',
        technologies: 'Python, Sentence-Transformers, Pinecone, Streamlit',
        description: 'Engineered an enterprise vector search system for instant semantic similarity indexing over 100k+ PDF documents.',
        responsibilities: 'Implemented dense embeddings pipeline with BM25 hybrid ranking and sub-50ms query retrieval.',
        results: 'Improved internal knowledge base discovery speed by 3.5x for 500+ daily active users.'
      }
    ],
    experience: [
      {
        company: 'Cognitive AI Labs',
        position: 'Junior Machine Learning Engineer',
        duration: '2023 - Present',
        responsibilities: 'Spearheaded model retraining workflows and optimized deep learning inference endpoints using FastAPI and Docker.',
        achievements: 'Reduced GPU memory consumption by 35% through 8-bit quantization and model pruning.'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect – Associate',
      'DeepLearning.AI Machine Learning Specialization'
    ],
    achievements: [
      '1st Place Winner at HackCal 2023 with AI healthcare triage system',
      'Author of open-source vector benchmark repository with 800+ GitHub stars'
    ]
  });

  const [newSkillCat, setNewSkillCat] = useState('Programming');
  const [newSkillItem, setNewSkillItem] = useState('');

  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      const fetchResume = async () => {
        try {
          const res = await api.getResumeById(queryId);
          if (res && res.content) {
            setResumeData(res.content);
            if (res.template) setTemplate(res.template);
            setActiveResumeId(res.id);
          }
        } catch (err) {
          console.error("Failed to load resume by ID:", err);
        }
      };
      fetchResume();
    } else if (user) {
      const checkExisting = async () => {
        try {
          const list = await api.getUserResumes();
          if (list && list.length > 0) {
            const latest = await api.getResumeById(list[0].id);
            if (latest && latest.content) {
              setResumeData(latest.content);
              if (latest.template) setTemplate(latest.template);
              setActiveResumeId(latest.id);
              return;
            }
          }
        } catch (e) {
          // Fallback to fresh user template
        }
        if (user.name) {
          setResumeData(prev => ({
            ...prev,
            personal: {
              ...(prev.personal || {}),
              fullName: user.name,
              email: user.email || prev.personal?.email
            }
          }));
        }
      };
      checkExisting();
    }
  }, [searchParams, user]);

  // Personal info handler
  const handlePersonalChange = (field, val) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...(prev.personal || {}), [field]: val }
    }));
  };

  // Education handlers
  const handleEduChange = (idx, field, val) => {
    setResumeData(prev => {
      const eduList = Array.isArray(prev.education) ? [...prev.education] : [];
      if (!eduList[idx]) {
        eduList[idx] = { degree: '', college: '', university: '', year: '', cgpa: '' };
      } else {
        eduList[idx] = { ...eduList[idx] };
      }
      eduList[idx][field] = val;
      return { ...prev, education: eduList };
    });
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...(Array.isArray(prev.education) ? prev.education : []),
        { degree: '', college: '', university: '', year: '', cgpa: '' }
      ]
    }));
  };

  const removeEducation = (idx) => {
    setResumeData(prev => ({
      ...prev,
      education: (Array.isArray(prev.education) ? prev.education : []).filter((_, i) => i !== idx)
    }));
  };

  // Skill handlers
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillItem.trim()) return;
    const cat = newSkillCat;
    const currentSkills = prevSkills => {
      const base = prevSkills && typeof prevSkills === 'object' ? { ...prevSkills } : {};
      const existing = Array.isArray(base[cat]) ? [...base[cat]] : [];
      if (!existing.includes(newSkillItem.trim())) {
        existing.push(newSkillItem.trim());
      }
      return { ...base, [cat]: existing };
    };
    setResumeData(prev => ({
      ...prev,
      skills: currentSkills(prev.skills)
    }));
    setNewSkillItem('');
  };

  const handleRemoveSkill = (cat, skill) => {
    setResumeData(prev => {
      const base = prev.skills && typeof prev.skills === 'object' ? { ...prev.skills } : {};
      const list = Array.isArray(base[cat]) ? base[cat].filter(s => s !== skill) : [];
      return {
        ...prev,
        skills: { ...base, [cat]: list }
      };
    });
  };

  // Projects handlers
  const handleProjectChange = (idx, field, val) => {
    setResumeData(prev => {
      const projs = Array.isArray(prev.projects) ? [...prev.projects] : [];
      if (!projs[idx]) {
        projs[idx] = { name: '', technologies: '', description: '', responsibilities: '', results: '' };
      } else {
        projs[idx] = { ...projs[idx] };
      }
      projs[idx][field] = val;
      return { ...prev, projects: projs };
    });
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...(Array.isArray(prev.projects) ? prev.projects : []),
        { name: '', technologies: '', description: '', responsibilities: '', results: '' }
      ]
    }));
  };

  const removeProject = (idx) => {
    setResumeData(prev => ({
      ...prev,
      projects: (Array.isArray(prev.projects) ? prev.projects : []).filter((_, i) => i !== idx)
    }));
  };

  // Experience handlers
  const handleExpChange = (idx, field, val) => {
    setResumeData(prev => {
      const exps = Array.isArray(prev.experience) ? [...prev.experience] : [];
      if (!exps[idx]) {
        exps[idx] = { company: '', position: '', duration: '', responsibilities: '', achievements: '' };
      } else {
        exps[idx] = { ...exps[idx] };
      }
      exps[idx][field] = val;
      return { ...prev, experience: exps };
    });
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...(Array.isArray(prev.experience) ? prev.experience : []),
        { company: '', position: '', duration: '', responsibilities: '', achievements: '' }
      ]
    }));
  };

  const removeExperience = (idx) => {
    setResumeData(prev => ({
      ...prev,
      experience: (Array.isArray(prev.experience) ? prev.experience : []).filter((_, i) => i !== idx)
    }));
  };

  // Certifications & Achievements handlers
  const handleAddCert = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...(Array.isArray(prev.certifications) ? prev.certifications : []), 'New Certification']
    }));
  };

  const handleAddAch = () => {
    setResumeData(prev => ({
      ...prev,
      achievements: [...(Array.isArray(prev.achievements) ? prev.achievements : []), 'Honors / Leadership Award']
    }));
  };

  // Save resume to database
  const handleSaveResume = async (showNotification = true) => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const name = resumeData.personal?.fullName || user?.name || 'My';
      const title = `${name} - ${template.charAt(0).toUpperCase() + template.slice(1)} Resume`;
      const payload = {
        resume_id: activeResumeId || undefined,
        title,
        template,
        content: resumeData
      };
      const result = await api.saveResume(payload);
      if (result && result.id) {
        setActiveResumeId(result.id);
      }
      if (showNotification) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 3500);
      }
      return result;
    } catch (err) {
      console.error("Save resume error:", err);
      if (showNotification) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3500);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // AI Generation sequence
  const handleTriggerAIGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(0);
    const steps = [
      "Understanding your profile...",
      "Organizing your experience...",
      "Optimizing your content...",
      "Checking ATS compatibility...",
      "Generating your resume..."
    ];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setGenerationStep(step);
      } else {
        clearInterval(interval);
        setTimeout(async () => {
          setIsGenerating(false);
          setActiveStep(7); // Jump to export view
          await handleSaveResume(false);
        }, 500);
      }
    }, 400);
  };

  // Real PDF and DOCX downloads with auto-persistence
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await handleSaveResume(false);
      const name = (resumeData.personal?.fullName || 'Resume').replace(/\s+/g, '_');
      await api.downloadPdf(resumeData, template, `${name}_Resume.pdf`);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err) {
      alert("Failed to download PDF: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      await handleSaveResume(false);
      const name = (resumeData.personal?.fullName || 'Resume').replace(/\s+/g, '_');
      await api.downloadDocx(resumeData, template, `${name}_Resume.docx`);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err) {
      alert("Failed to download DOCX: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      
      {/* Top Banner & Multi-step wizard indicator */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                AI Resume Builder
              </h1>
              <p className="text-[11px] text-slate-400">Step {activeStep + 1} of {STEPS.length}: {STEPS[activeStep].title}</p>
            </div>
          </div>

          {/* Steps Horizontal Bar */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
            {STEPS.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : idx < activeStep
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {idx + 1}. {st.title}
              </button>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveResume(true)}
              disabled={isSaving}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                saveStatus === 'saved'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : saveStatus === 'error'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveStatus === 'saved' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>
                {isSaving ? 'Saving...' : saveStatus === 'saved' ? 'Saved to Dashboard!' : 'Save Resume'}
              </span>
            </button>
            <button
              onClick={handleTriggerAIGenerate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Generate My Resume</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Split Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Multi-Step Editor Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs max-h-[800px] overflow-y-auto">
            
            {/* Step Navigation Controls */}
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 disabled:opacity-30 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <span className="text-xs font-bold text-blue-600">
                {STEPS[activeStep].title}
              </span>
              <button
                disabled={activeStep === STEPS.length - 1}
                onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-30 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* STEP 1: Personal */}
            {activeStep === 0 && (
              <div className="space-y-4">
                {/* Freeze / Lock Toggle Banner */}
                <div className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                  isPersonalInfoFrozen
                    ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isPersonalInfoFrozen
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {isPersonalInfoFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isPersonalInfoFrozen ? 'Personal Info Frozen & Protected 🔒' : 'Personal Info Editable 🔓'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isPersonalInfoFrozen ? 'Fields are locked to prevent changes' : 'Click to freeze and protect this section'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPersonalInfoFrozen(!isPersonalInfoFrozen)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isPersonalInfoFrozen
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isPersonalInfoFrozen ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlock Info</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Freeze Info</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name {isPersonalInfoFrozen && <span className="text-[10px] text-blue-500 font-normal">(Frozen)</span>}
                  </label>
                  <input
                    type="text"
                    disabled={isPersonalInfoFrozen}
                    readOnly={isPersonalInfoFrozen}
                    value={resumeData.personal.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-colors ${
                      isPersonalInfoFrozen
                        ? 'bg-slate-100/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none'
                        : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email {isPersonalInfoFrozen && <span className="text-[10px] text-blue-500 font-normal">(Frozen)</span>}
                    </label>
                    <input
                      type="email"
                      disabled={isPersonalInfoFrozen}
                      readOnly={isPersonalInfoFrozen}
                      value={resumeData.personal.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-colors ${
                        isPersonalInfoFrozen
                          ? 'bg-slate-100/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none'
                          : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone {isPersonalInfoFrozen && <span className="text-[10px] text-blue-500 font-normal">(Frozen)</span>}
                    </label>
                    <input
                      type="text"
                      disabled={isPersonalInfoFrozen}
                      readOnly={isPersonalInfoFrozen}
                      value={resumeData.personal.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-colors ${
                        isPersonalInfoFrozen
                          ? 'bg-slate-100/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none'
                          : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location {isPersonalInfoFrozen && <span className="text-[10px] text-blue-500 font-normal">(Frozen)</span>}
                  </label>
                  <input
                    type="text"
                    disabled={isPersonalInfoFrozen}
                    readOnly={isPersonalInfoFrozen}
                    value={resumeData.personal.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-colors ${
                      isPersonalInfoFrozen
                        ? 'bg-slate-100/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none'
                        : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      LinkedIn Handle {isPersonalInfoFrozen && <span className="text-[10px] text-blue-500 font-normal">(Frozen)</span>}
                    </label>
                    <input
                      type="text"
                      disabled={isPersonalInfoFrozen}
                      readOnly={isPersonalInfoFrozen}
                      value={resumeData.personal.linkedin}
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-colors ${
                        isPersonalInfoFrozen
                          ? 'bg-slate-100/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none'
                          : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GitHub Profile {isPersonalInfoFrozen && <span className="text-[10px] text-blue-500 font-normal">(Frozen)</span>}
                    </label>
                    <input
                      type="text"
                      disabled={isPersonalInfoFrozen}
                      readOnly={isPersonalInfoFrozen}
                      value={resumeData.personal.github}
                      onChange={(e) => handlePersonalChange('github', e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-colors ${
                        isPersonalInfoFrozen
                          ? 'bg-slate-100/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none'
                          : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Professional Summary {isPersonalInfoFrozen && <span className="text-[10px] text-blue-500 font-normal">(Frozen)</span>}
                  </label>
                  <textarea
                    rows={4}
                    disabled={isPersonalInfoFrozen}
                    readOnly={isPersonalInfoFrozen}
                    value={resumeData.personal.summary}
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs leading-relaxed transition-colors ${
                      isPersonalInfoFrozen
                        ? 'bg-slate-100/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none'
                        : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Education */}
            {activeStep === 1 && (
              <div className="space-y-4">
                {(Array.isArray(resumeData.education) ? resumeData.education : []).map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Degree #{idx + 1}</span>
                      <button
                        onClick={() => removeEducation(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Degree (e.g. B.S. in Computer Science)"
                      value={edu?.degree || ''}
                      onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="University / College"
                      value={edu?.university || edu?.college || ''}
                      onChange={(e) => handleEduChange(idx, 'university', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Year (e.g. 2023)"
                        value={edu?.year || ''}
                        onChange={(e) => handleEduChange(idx, 'year', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                      />
                      <input
                        type="text"
                        placeholder="CGPA / % (e.g. 3.8 / 4.0)"
                        value={edu?.cgpa || ''}
                        onChange={(e) => handleEduChange(idx, 'cgpa', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full py-2.5 rounded-xl border border-dashed border-blue-400 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50/50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Education</span>
                </button>
              </div>
            )}

            {/* STEP 3: Skills */}
            {activeStep === 2 && (
              <div className="space-y-5">
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <select
                    value={newSkillCat}
                    onChange={(e) => setNewSkillCat(e.target.value)}
                    className="px-3 py-2 rounded-xl border text-xs dark:bg-slate-950 dark:border-slate-800"
                  >
                    <option value="Programming">Programming</option>
                    <option value="AI/ML">AI / ML</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Databases & Cloud">Databases & Cloud</option>
                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                  <input
                    type="text"
                    placeholder="New skill chip (e.g. PyTorch)"
                    value={newSkillItem}
                    onChange={(e) => setNewSkillItem(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border text-xs dark:bg-slate-950 dark:border-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </form>

                <div className="space-y-3">
                  {Object.entries(resumeData.skills || {}).map(([category, items]) => (
                    <div key={category} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">{category}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(items) && items.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 shadow-xs"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(category, skill)}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Projects */}
            {activeStep === 3 && (
              <div className="space-y-4">
                {(Array.isArray(resumeData.projects) ? resumeData.projects : []).map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Project #{idx + 1}</span>
                      <button onClick={() => removeProject(idx)} className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj?.name || ''}
                      onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="Technologies (e.g. PyTorch, FastAPI, Docker)"
                      value={proj?.technologies || ''}
                      onChange={(e) => handleProjectChange(idx, 'technologies', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                    <textarea
                      placeholder="Description & Responsibilities"
                      rows={2}
                      value={proj?.description || ''}
                      onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="Measurable Results (e.g. Reduced latency by 42%)"
                      value={proj?.results || ''}
                      onChange={(e) => handleProjectChange(idx, 'results', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-2.5 rounded-xl border border-dashed border-blue-400 text-blue-600 text-xs font-semibold hover:bg-blue-50/50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Project</span>
                </button>
              </div>
            )}

            {/* STEP 5: Experience */}
            {activeStep === 4 && (
              <div className="space-y-4">
                {(Array.isArray(resumeData.experience) ? resumeData.experience : []).map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Role #{idx + 1}</span>
                      <button onClick={() => removeExperience(idx)} className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Position Title"
                        value={exp?.position || ''}
                        onChange={(e) => handleExpChange(idx, 'position', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp?.company || ''}
                        onChange={(e) => handleExpChange(idx, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Duration (e.g. 2023 - Present)"
                      value={exp?.duration || ''}
                      onChange={(e) => handleExpChange(idx, 'duration', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                    <textarea
                      placeholder="Responsibilities"
                      rows={2}
                      value={exp?.responsibilities || ''}
                      onChange={(e) => handleExpChange(idx, 'responsibilities', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="Measurable Achievement (e.g. Decreased memory usage by 35%)"
                      value={exp?.achievements || ''}
                      onChange={(e) => handleExpChange(idx, 'achievements', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs dark:bg-slate-900 dark:border-slate-700"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full py-2.5 rounded-xl border border-dashed border-blue-400 text-blue-600 text-xs font-semibold hover:bg-blue-50/50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Experience</span>
                </button>
              </div>
            )}

            {/* STEP 6: Certifications */}
            {activeStep === 5 && (
              <div className="space-y-3">
                {(Array.isArray(resumeData.certifications) ? resumeData.certifications : []).map((c, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={c || ''}
                      onChange={(e) => {
                        const updated = [...(Array.isArray(resumeData.certifications) ? resumeData.certifications : [])];
                        updated[idx] = e.target.value;
                        setResumeData(prev => ({ ...prev, certifications: updated }));
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border text-xs dark:bg-slate-950 dark:border-slate-800"
                    />
                    <button
                      onClick={() => {
                        setResumeData(prev => ({
                          ...prev,
                          certifications: (Array.isArray(prev.certifications) ? prev.certifications : []).filter((_, i) => i !== idx)
                        }));
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddCert}
                  className="w-full py-2.5 rounded-xl border border-dashed border-blue-400 text-blue-600 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Certification</span>
                </button>
              </div>
            )}

            {/* STEP 7: Achievements */}
            {activeStep === 6 && (
              <div className="space-y-3">
                {(Array.isArray(resumeData.achievements) ? resumeData.achievements : []).map((a, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={a || ''}
                      onChange={(e) => {
                        const updated = [...(Array.isArray(resumeData.achievements) ? resumeData.achievements : [])];
                        updated[idx] = e.target.value;
                        setResumeData(prev => ({ ...prev, achievements: updated }));
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border text-xs dark:bg-slate-950 dark:border-slate-800"
                    />
                    <button
                      onClick={() => {
                        setResumeData(prev => ({
                          ...prev,
                          achievements: (Array.isArray(prev.achievements) ? prev.achievements : []).filter((_, i) => i !== idx)
                        }));
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddAch}
                  className="w-full py-2.5 rounded-xl border border-dashed border-blue-400 text-blue-600 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Achievement</span>
                </button>
              </div>
            )}

            {/* STEP 8: Templates & Final Download */}
            {activeStep === 7 && (
              <div className="space-y-5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Verified ATS Template:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'classic', name: 'ATS Classic', desc: 'Single-column, maximum ATS compatibility' },
                    { id: 'modern', name: 'Modern Pro', desc: 'Clean layout with subtle blue headers' },
                    { id: 'fresher', name: 'Fresher Focus', desc: 'Prioritizes education & capstones' },
                    { id: 'technical', name: 'Technical Stack', desc: 'Skills, GitHub & architecture focused' },
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        template === t.id
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-white mb-0.5">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Export Authentic Documents:</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-md hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={handleDownloadDocx}
                      disabled={isDownloading}
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download DOCX</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleSaveResume(true)}
                    disabled={isSaving}
                    className={`w-full py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all ${
                      saveStatus === 'saved'
                        ? 'bg-emerald-600 text-white'
                        : saveStatus === 'error'
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{isSaving ? 'Saving to Dashboard...' : saveStatus === 'saved' ? '✓ Saved to Dashboard!' : 'Save Resume to Dashboard'}</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">
                    * Generates authentic documents and synchronizes directly to your Dashboard profile.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: Live Resume Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* Live Controls Toolbar */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Preview</span>
                </span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md uppercase">
                  {template}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
                  className="p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 dark:border-slate-800"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-medium text-slate-500 w-10 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                  className="p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 dark:border-slate-800"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
                <button
                  onClick={handleDownloadPdf}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleDownloadDocx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>DOCX</span>
                </button>
              </div>
            </div>

            {/* A4 Sheet Render Frame */}
            <div className="overflow-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-center max-h-[750px]">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease'
                }}
                className="w-full max-w-[800px]"
              >
                {template === 'classic' && <ClassicTemplate data={resumeData} />}
                {template === 'modern' && <ModernTemplate data={resumeData} />}
                {template === 'fresher' && <FresherTemplate data={resumeData} />}
                {template === 'technical' && <TechnicalTemplate data={resumeData} />}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* AI Resume Generation Animated Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-2xl"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              Generating Your ATS Resume
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Formatting sections, ranking keywords, and validating layout parser compliance.
            </p>

            <div className="space-y-2.5 text-xs text-left max-w-xs mx-auto">
              {[
                "Understanding your profile...",
                "Organizing your experience...",
                "Optimizing your content...",
                "Checking ATS compatibility...",
                "Generating your resume..."
              ].map((msg, i) => (
                <div
                  key={msg}
                  className={`flex items-center gap-2.5 py-1 ${
                    i <= generationStep ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-400 opacity-40'
                  }`}
                >
                  {i < generationStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : i === generationStep ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 text-blue-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                  )}
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
