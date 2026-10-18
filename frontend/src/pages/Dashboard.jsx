import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  BarChart2,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Download,
  Crosshair,
  GitCompare,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    latest_ats_score: 87,
    resume_strength: 84,
    jobs_analyzed: 12,
    resumes_created: 5
  });
  const [resumes, setResumes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Initial', score: 62 },
    { name: 'v1.1', score: 68 },
    { name: 'v1.2', score: 74 },
    { name: 'v1.3', score: 81 },
    { name: 'Current', score: 87 }
  ];

  const categoryScores = [
    { category: 'Skills', score: 91 },
    { category: 'Keywords', score: 84 },
    { category: 'Projects', score: 88 },
    { category: 'Experience', score: 79 },
    { category: 'Education', score: 95 },
    { category: 'Formatting', score: 86 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, resumesRes, historyRes] = await Promise.all([
          api.getDashboardStats().catch(() => ({
            latest_ats_score: 87,
            resume_strength: 84,
            jobs_analyzed: 12,
            resumes_created: 5
          })),
          api.getUserResumes().catch(() => []),
          api.getAnalysisHistory().catch(() => [])
        ]);
        setStats(statsRes);
        setResumes(resumesRes);
        setAnalyses(historyRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete resume");
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Intelligence Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome to ATSense AI, {user?.name || 'Candidate'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track your ATS compatibility velocity, target role matches, and optimized profile assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analyzer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Resume</span>
          </Link>
          <Link
            to="/builder"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Resume</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        
        {/* Card 1: Latest ATS Score */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest ATS Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.latest_ats_score}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Strong Match • Taleo Compliant</span>
          </div>
        </div>

        {/* Card 2: Resume Strength */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resume Strength</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.resume_strength}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Top 12% in Machine Learning</span>
          </div>
        </div>

        {/* Card 3: Jobs Analyzed */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Jobs Analyzed</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.jobs_analyzed}
            </span>
            <span className="text-xs font-semibold text-slate-400">Roles</span>
          </div>
          <div className="mt-2 text-[11px] font-medium text-slate-500">
            Across Software & AI roles
          </div>
        </div>

        {/* Card 4: Resumes Created */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resumes Created</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.resumes_created}
            </span>
            <span className="text-xs font-semibold text-slate-400">Versions</span>
          </div>
          <div className="mt-2 text-[11px] font-medium text-slate-500">
            Exported in PDF & DOCX
          </div>
        </div>

      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        
        {/* ATS Score Improvement Trajectory */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ATS Compatibility Progression
              </h3>
              <p className="text-xs text-slate-500">Score gains achieved through iterative AI improvements</p>
            </div>
            <Link
              to="/compare/1"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Versions (+22 gain)</span>
            </Link>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Category Score Distribution
            </h3>
            <p className="text-xs text-slate-500">Audit weights across key evaluation criteria</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryScores} layout="vertical" margin={{ left: 15, right: 15 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Score']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* My Resumes Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Resumes</h2>
            <p className="text-xs text-slate-500">Manage active drafts, versions, and downloaded copies</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All Documents
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume) => (
            <motion.div
              key={resume.id}
              whileHover={{ y: -3 }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    ATS: {resume.score}/100
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                  {resume.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Template: <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{resume.template}</span> • {resume.version || 'v2.0'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/builder?id=${resume.id}`}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit in Builder"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/compare/${resume.id}`}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Compare Versions"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={(e) => handleDeleteResume(resume.id, e)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link
                  to={`/builder?id=${resume.id}`}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent ATS Analyses</h2>
            <p className="text-xs text-slate-500">Historical performance across target job requirements</p>
          </div>
          <Link to="/analyzer" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            + Run New Analysis
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Target Role</th>
                  <th className="py-3.5 px-6">Source File</th>
                  <th className="py-3.5 px-6">ATS Compatibility</th>
                  <th className="py-3.5 px-6">Evaluation Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analyses.length > 0 ? (
                  analyses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                        {item.job_title}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {item.filename}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.overall_score >= 80
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200'
                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200'
                        }`}>
                          {item.overall_score} / 100 • {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/results?analysis_id=${item.id}`}
                          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No analyses recorded yet. Upload a resume to run your first diagnostic!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
