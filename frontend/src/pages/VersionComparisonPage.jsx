import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GitCompare,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  FileText,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';

export const VersionComparisonPage = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    before_score: 65,
    after_score: 87,
    improvement: 22,
    improved_areas: [
      "Quantified Project Results (e.g. 96.4% precision, 42% latency reduction)",
      "High-Impact Action Verbs (Architected, Engineered, Spearheaded, Optimized)",
      "Target Role Keyword Alignment (PyTorch, Docker, CI/CD, FastAPI, Vector DB)",
      "Workday & Taleo Compliant Header & Section Hierarchy"
    ],
    versions: [
      {
        version_number: 1,
        score: 65,
        change_summary: "Initial draft imported from profile information"
      },
      {
        version_number: 2,
        score: 87,
        change_summary: "Injected quantifiable outcomes, strengthened action verbs, added Docker & PyTorch keywords"
      }
    ]
  });

  useEffect(() => {
    if (id) {
      api.getResumeVersionComparison(id).then(setData).catch(() => {});
    }
  }, [id]);

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Iterative Optimization Audit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Version Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Measure tangible score improvements between your original baseline resume and AI-optimized version.
        </p>
      </div>

      {/* Main Before vs After Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl mb-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
          
          {/* Before */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Before Optimization (v1.0)
            </span>
            <div className="text-4xl font-black text-slate-700 dark:text-slate-300">
              {data.before_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
              Moderate Match
            </span>
          </div>

          {/* Delta Pill */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-500/25 mb-2">
              +{data.improvement}
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              +{data.improvement} Improvement
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">Statistical ATS Boost</span>
          </div>

          {/* After */}
          <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
              After AI Optimization (v2.0)
            </span>
            <div className="text-4xl font-black text-emerald-700 dark:text-emerald-300">
              {data.after_score} <span className="text-xs font-normal text-emerald-500">/ 100</span>
            </div>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300">
              Strong Match (Top Tier)
            </span>
          </div>

        </div>

      </div>

      {/* Improved Areas Breakdown */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Specific Areas That Propelled Your Score</span>
        </h3>

        <div className="space-y-3">
          {data.improved_areas.map((area, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Link
          to="/dashboard"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          ← Back to Dashboard
        </Link>
        <Link
          to="/builder?id=1"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center gap-2"
        >
          <span>Open Latest Version in Builder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
