import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ScoreGauge = ({ score = 87, size = 180, strokeWidth = 14, showStatus = true }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    if (end === 0) {
      setDisplayScore(0);
      return;
    }
    const duration = 1200; // ms
    const stepTime = 15;
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  // Determine color and status
  let strokeColor = "#10b981"; // emerald
  let statusText = "Strong Match";
  let statusBadge = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";

  if (score < 40) {
    strokeColor = "#f43f5e"; // rose
    statusText = "Weak Match";
    statusBadge = "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
  } else if (score < 60) {
    strokeColor = "#f59e0b"; // amber
    statusText = "Needs Improvement";
    statusBadge = "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  } else if (score < 80) {
    strokeColor = "#3b82f6"; // blue
    statusText = "Moderate Match";
    statusBadge = "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800/80"
            fill="transparent"
          />
          {/* Animated Gauge Track */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {displayScore}
          </span>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            Out of 100
          </span>
        </div>
      </div>

      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-4 px-3.5 py-1 rounded-full text-xs font-semibold border ${statusBadge} shadow-xs`}
        >
          {statusText}
        </motion.div>
      )}
    </div>
  );
};
