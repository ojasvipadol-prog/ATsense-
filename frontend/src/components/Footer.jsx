import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                ATSense <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Analyze. Optimize. Get Hired.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering students, freshers, and job seekers with real-time ATS compatibility diagnostics, skill gap remediation, and AI resume crafting.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/analyzer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">ATS Resume Analyzer</Link></li>
              <li><Link to="/matcher" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Job Matcher Engine</Link></li>
              <li><Link to="/builder" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Resume Builder</Link></li>
              <li><Link to="/guidance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Career Roadmap</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Performance Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              ATS Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><span className="text-slate-500">Taleo & Workday Ready</span></li>
              <li><span className="text-slate-500">Greenhouse Optimized</span></li>
              <li><span className="text-slate-500">Standard Heading Parsing</span></li>
              <li><span className="text-slate-500">Dual PDF & DOCX Export</span></li>
              <li><span className="text-slate-500">Action Verbs Audit</span></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Trust & Privacy
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-normal space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span>Fair Evaluation Guarantee</span>
              </div>
              <p>
                Estimated ATS scores indicate compatibility with typical applicant tracking criteria. Actual hiring choices involve employer discretion, interviews, and market supply.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ATSense AI. All rights reserved. Built for ambitious careers.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for job seekers worldwide
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
