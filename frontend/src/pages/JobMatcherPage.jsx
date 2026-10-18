import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crosshair,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ChevronRight,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';

export const JobMatcherPage = () => {
  const [sampleJobs, setSampleJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('ml-engineer');
  const [jobTitle, setJobTitle] = useState('Machine Learning Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    api.getSampleJobs().then((jobs) => {
      setSampleJobs(jobs);
      if (jobs.length > 0) {
        setJobTitle(jobs[0].title);
        setJobDescription(jobs[0].description);
      }
    }).catch(() => {});

    api.getSampleResumes().then((samples) => {
      if (samples.length > 0) {
        setResumeText(samples[0].text);
      }
    }).catch(() => {});
  }, []);

  const handleSelectPresetJob = (job) => {
    setSelectedJobId(job.id);
    setJobTitle(job.title);
    setJobDescription(job.description);
  };

  const handleRunMatch = async () => {
    if (!resumeText || !jobDescription) return;
    setMatching(true);
    try {
      const res = await api.matchJob({
        resume_text: resumeText,
        job_description: jobDescription,
        job_role: jobTitle
      });
      setMatchResult(res);
    } catch (err) {
      alert("Job matching error: " + err.message);
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Crosshair className="w-3.5 h-3.5" />
          <span>Role Alignment Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Match My Resume With a Job
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Compare your resume directly against specific job qualifications to reveal your competitive fit, missing keywords, and targeted improvements.
        </p>
      </div>

      {/* Input Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Left: Resume Input */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                1. Your Resume Text
              </h2>
              <span className="text-[11px] font-semibold text-emerald-600">Sample Preloaded</span>
            </div>
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your raw resume text here..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            * You can paste updated text from your latest draft.
          </p>
        </div>

        {/* Right: Job Description */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                2. Target Job Description
              </h2>
              <div className="flex gap-1">
                {sampleJobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => handleSelectPresetJob(j)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                      selectedJobId === j.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {j.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Target Role (e.g. Machine Learning Engineer)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 mb-2.5 font-bold"
            />

            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the hiring requirements and responsibilities here..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="pt-3">
            <button
              onClick={handleRunMatch}
              disabled={matching}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{matching ? 'Calculating Alignment...' : 'Calculate Job Match Score'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Match Results Display */}
      {matchResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Match Header Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <ScoreGauge score={matchResult.overall_match} size={150} strokeWidth={12} showStatus={false} />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Role Fit
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Overall Match: {matchResult.overall_match}%
                </h3>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {matchResult.status}
                </span>
                <p className="text-xs text-slate-500 mt-2 max-w-md">
                  Based on weighted scoring across skills, keywords, project context, and experience depth.
                </p>
              </div>
            </div>

            {/* Dimension Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs w-full md:w-auto">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                <span className="text-slate-400 block text-[11px]">Skills Match</span>
                <span className="font-bold text-emerald-600 text-base">{matchResult.scores?.skills_match}%</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                <span className="text-slate-400 block text-[11px]">Keywords</span>
                <span className="font-bold text-blue-600 text-base">{matchResult.scores?.keyword_match}%</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                <span className="text-slate-400 block text-[11px]">Project Match</span>
                <span className="font-bold text-indigo-600 text-base">{matchResult.scores?.project_relevance}%</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                <span className="text-slate-400 block text-[11px]">Experience</span>
                <span className="font-bold text-violet-600 text-base">{matchResult.scores?.experience_relevance}%</span>
              </div>
            </div>
          </div>

          {/* Strengths & Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Your Core Strengths</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.strengths.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills & Keywords */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Missing Skills & Keywords</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.missing_skills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold text-xs border border-amber-200">
                    ⚠ {s}
                  </span>
                ))}
                {matchResult.missing_keywords.map((k) => (
                  <span key={k} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700">
                    + {k}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-blue-950 dark:text-blue-200">
                Turn Gaps Into Opportunities
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                View your personalized learning path with recommended projects and certifications.
              </p>
            </div>
            <a
              href="/guidance"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 flex items-center gap-2"
            >
              <span>Explore Career Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </motion.div>
      )}

    </div>
  );
};
