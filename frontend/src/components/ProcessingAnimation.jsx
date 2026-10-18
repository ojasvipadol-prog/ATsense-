import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Loader2, BrainCircuit } from 'lucide-react';

const STEPS = [
  "Extracting resume content",
  "Detecting skills",
  "Extracting keywords",
  "Understanding job requirements",
  "Comparing resume and job",
  "Checking ATS structure",
  "Calculating scores",
  "Preparing recommendations"
];

export const ProcessingAnimation = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 600);
          }
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden"
      >
        {/* Glowing aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Pulse Logo */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 animate-pulse">
          <BrainCircuit className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          ATSense AI is analyzing your resume...
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
          Evaluating structural compatibility, keyword density, and competitive role alignment.
        </p>

        {/* Sequential Step Progress */}
        <div className="space-y-3 text-left max-w-sm mx-auto">
          {STEPS.map((step, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: idx <= currentStepIndex ? 1 : 0.35, x: 0 }}
                className={`flex items-center gap-3 text-xs font-medium py-1.5 px-3 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                    : isFinished
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {isFinished ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                )}
                <span>{step}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-violet-600"
            initial={{ width: '5%' }}
            animate={{ width: `${Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
};
