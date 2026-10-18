import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, X, ShieldAlert, BookOpen, Lightbulb } from 'lucide-react';

export const SkillBadgeModal = ({ skill, isOpen, onClose }) => {
  if (!isOpen || !skill) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  skill.found
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                }`}
              >
                {skill.found ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {skill.name}
                </h3>
                <span
                  className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    skill.found
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {skill.found ? 'Verified in Resume' : 'Missing from Resume'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-xs text-slate-600 dark:text-slate-300">
            {/* Why it matters */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Why It Matters</span>
              </div>
              <p className="pl-5 leading-relaxed text-slate-600 dark:text-slate-400">
                {skill.why_it_matters || 'A core competency frequently evaluated by ATS algorithms and hiring teams.'}
              </p>
            </div>

            {/* JD Context */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                <span>Job Description Context</span>
              </div>
              <p className="pl-5 leading-relaxed text-slate-600 dark:text-slate-400">
                {skill.jd_context || 'Identified in the role requirements and qualification filters.'}
              </p>
            </div>

            {/* How to Improve */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>How to Improve</span>
              </div>
              <p className="pl-5 leading-relaxed text-slate-600 dark:text-slate-400">
                {skill.how_to_improve ||
                  'If you have practiced this skill in projects, coursework, or internships, include it with verifiable context. Never falsely claim proficiency you do not possess.'}
              </p>
            </div>

            {/* Safety disclaimer */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-[11px] text-blue-700 dark:text-blue-300 leading-normal border border-blue-100 dark:border-blue-900/40">
              💡 <strong>Ethical AI Note:</strong> ATSense AI advocates honest representation. Always back up skills with tangible code, GitHub repositories, or production examples.
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 cursor-pointer"
            >
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
