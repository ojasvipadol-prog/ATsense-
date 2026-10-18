import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Download,
  RotateCcw,
  Sparkles,
  GitCompare,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export const ResumeHistoryPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await api.getUserResumes();
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.deleteResume(id);
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to delete resume");
    }
  };

  const handleDownload = async (resume, e) => {
    e.stopPropagation();
    try {
      const details = await api.getResumeById(resume.id);
      await api.downloadPdf(details.content, details.template, `${resume.title.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Document Management</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Resumes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse saved templates, past versions, and export production copies.
          </p>
        </div>

        <Link
          to="/builder"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:opacity-95 flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Resume</span>
        </Link>
      </div>

      {/* Grid of Resumes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <motion.div
            key={resume.id}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200">
                  ATS: {resume.score}/100
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                {resume.title}
              </h3>
              <p className="text-xs text-slate-500 mb-1">
                Target Role: <span className="font-semibold text-slate-700 dark:text-slate-300">Machine Learning Engineer</span>
              </p>
              <p className="text-[11px] text-slate-400 mb-4">
                Template: <span className="capitalize">{resume.template}</span> • {resume.version || 'v2.0'} • Updated {new Date(resume.updated_at || Date.now()).toLocaleDateString()}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/builder?id=${resume.id}`}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Edit Resume"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <Link
                  to={`/compare/${resume.id}`}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Compare Versions"
                >
                  <GitCompare className="w-4 h-4" />
                </Link>
                <button
                  onClick={(e) => handleDownload(resume, e)}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(resume.id, e)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Link
                to={`/analyzer`}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Analyze Again</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
