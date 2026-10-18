import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Crosshair,
  TrendingUp,
  Wand2,
  LayoutTemplate,
  Compass,
  Download,
  ShieldCheck,
  Zap,
  BarChart3,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';

export const LandingPage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 'analyzer',
      title: 'ATS Resume Analyzer',
      icon: FileSearch,
      desc: 'Deep inspection of resume syntax, headings, keywords, projects, and machine parseability across standard ATS algorithms.',
      details: 'Our engine parses raw PDF/DOCX layouts through simulated enterprise parsers (Workday, Taleo, Greenhouse) to detect dropped text, missing sections, and formatting errors.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'matcher',
      title: 'Job Matcher',
      icon: Crosshair,
      desc: 'Targeted comparison against specific job descriptions to compute role compatibility and interview qualification scores.',
      details: 'Leverages TF-IDF and dense embedding models to contrast your demonstrated background against mandatory qualification criteria in real time.',
      color: 'from-indigo-500 to-violet-600'
    },
    {
      id: 'gaps',
      title: 'Skill Gap Detection',
      icon: TrendingUp,
      desc: 'Instantly identifies critical competencies required by your target employer that are missing from your resume.',
      details: 'Categorizes skills into high-frequency prerequisites and suggests exact contextual placement without recommending dishonest resume padding.',
      color: 'from-violet-500 to-purple-600'
    },
    {
      id: 'improver',
      title: 'AI Resume Improver',
      icon: Wand2,
      desc: 'Detects weak verbs, passive phrasing, and missing metrics to generate compelling, quantifiable bullet points.',
      details: 'Replaces phrases like "worked on" with "spearheaded and architected", injecting verifiable performance impact and industry standards.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'builder',
      title: 'AI Resume Builder',
      icon: LayoutTemplate,
      desc: 'Multi-step guided wizard that structures your background into clean, ATS-compliant formats with live preview.',
      details: 'Never invents fake data or claims. Guides you step-by-step to capture your real achievements and formats them into four high-converting templates.',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'templates',
      title: 'ATS-Friendly Templates',
      icon: Layers,
      desc: 'Engineered specifically to survive strict corporate parsers without graphical clutter or unreadable columns.',
      details: 'Choose between ATS Classic, Modern Professional, Fresher, and Technical archetypes with instant theme synchronization.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'guidance',
      title: 'Career Guidance & Roadmap',
      icon: Compass,
      desc: 'Personalized step-by-step roadmaps showing recommended technologies, real projects to build, and key certifications.',
      details: 'Maps your journey from current competencies to role readiness with curated milestones and realistic timeline benchmarks.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'export',
      title: 'Real PDF & DOCX Export',
      icon: Download,
      desc: 'Download genuine, structured files that recruiters and HR software can parse flawlessly.',
      details: 'Generates clean vector PDF and native Microsoft Word (.docx) files preserving formatting, font hierarchies, and bullet points.',
      color: 'from-rose-500 to-red-600'
    }
  ];

  const steps = [
    { num: '01', title: 'Upload Resume', desc: 'Drag and drop your PDF or DOCX file for instant neural parsing.' },
    { num: '02', title: 'Add Job Description', desc: 'Paste the target job role and description for tailored alignment.' },
    { num: '03', title: 'Analyze', desc: 'Our engine evaluates structural syntax, skills, and keyword frequencies.' },
    { num: '04', title: 'Find Gaps', desc: 'Uncover missing qualifications, passive verbs, and missing metrics.' },
    { num: '05', title: 'Improve', desc: 'Review AI-suggested rewrites in an interactive side-by-side workspace.' },
    { num: '06', title: 'Generate', desc: 'Choose an ATS-compliant template with instant live preview.' },
    { num: '07', title: 'Download', desc: 'Export high-fidelity PDF and DOCX files ready for corporate applications.' }
  ];

  return (
    <div className="relative overflow-hidden pt-20">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-28 right-1/4 w-96 h-96 bg-violet-400/15 dark:bg-violet-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-indigo-300/10 dark:bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Generation Career Intelligence</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Analyze. Optimize.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Get Hired.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Your AI-powered resume companion that analyzes ATS compatibility, identifies skill gaps, improves your resume, and helps you create a job-ready profile.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/analyzer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>✨ Analyze My Resume</span>
              </Link>

              <Link
                to="/builder"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Create Resume with AI</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </Link>
            </div>

            {/* Small Trust Indicators */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Powered</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>ATS Focused</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-blue-500" />
                <span>Job Specific</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Interactive Visual Mock Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Floating Mock Dashboard Card */}
            <div className="relative mx-auto max-w-md rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-indigo-500/10">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Live ATS Diagnostic
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  Target: ML Engineer
                </span>
              </div>

              {/* Circular Gauge Center */}
              <div className="py-5 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-500 mb-2">ATS Match</span>
                <ScoreGauge score={87} size={160} strokeWidth={12} showStatus={true} />
              </div>

              {/* Subscores Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500">Skills Match</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">91%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500">Keyword Match</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">84%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500">Project Match</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">88%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500">Formatting</span>
                    <span className="font-bold text-violet-600 dark:text-violet-400">86%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: '86%' }} />
                  </div>
                </div>
              </div>

              {/* Animated Skill Badges */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-500 mb-2">Evaluated Competencies:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Python
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> SQL
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Machine Learning
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium text-[11px] border border-amber-200 dark:border-amber-800/60">
                    <AlertTriangle className="w-3 h-3 text-amber-500" /> Docker
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium text-[11px] border border-amber-200 dark:border-amber-800/60">
                    <AlertTriangle className="w-3 h-3 text-amber-500" /> AWS
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Floating Accessory Badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden sm:flex absolute -bottom-5 -left-6 bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 items-center gap-3 z-10"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                ✓
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-100">Parser Approved</div>
                <div className="text-slate-500 text-[11px]">Workday & Taleo Ready</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="hidden sm:flex absolute -top-5 -right-6 bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 items-center gap-3 z-10"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                AI
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-100">+22 Score Boost</div>
                <div className="text-slate-500 text-[11px]">After Action-Verb Fix</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50/60 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Capabilities Built for Hiring Success
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything Your Resume Needs
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              From automated keyword density analysis to full multi-template AI document generation, each feature is calibrated for real ATS selection algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.id}
                  whileHover={{ y: -5 }}
                  className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-5 shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {feat.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedFeature(feat)}
                    className="pt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learn More Feature Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedFeature.color} flex items-center justify-center text-white`}>
                <selectedFeature.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedFeature.title}</h3>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Core ATSense AI Capability</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedFeature.details}
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedFeature(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
              <Link
                to={selectedFeature.id === 'builder' ? '/builder' : selectedFeature.id === 'matcher' ? '/matcher' : '/analyzer'}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xs"
              >
                Try Feature
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Frictionless Diagnostic Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            From initial document ingest to landing verified interview calls in 7 transparent steps.
          </p>
        </div>

        {/* Step Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, i) => (
            <motion.div
              key={st.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent font-mono">
                  {st.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                {st.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {st.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white text-center shadow-2xl shadow-blue-500/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Beat the ATS and Land More Interviews?
            </h2>
            <p className="text-sm sm:text-base text-blue-100">
              Upload your existing resume for a complimentary deep analysis or generate a brand new optimized resume in minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link
                to="/analyzer"
                className="px-8 py-3.5 rounded-2xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                <span>✨ Analyze My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/builder"
                className="px-8 py-3.5 rounded-2xl bg-blue-900/60 border border-white/20 text-white font-bold text-sm hover:bg-blue-900/80 transition-all"
              >
                Open Resume Builder
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
