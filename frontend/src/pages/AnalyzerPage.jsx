import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  FileCheck,
  FolderOpen
} from 'lucide-react';
import { api } from '../services/api';
import { ProcessingAnimation } from '../components/ProcessingAnimation';

export const AnalyzerPage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobRole, setJobRole] = useState('Machine Learning Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [samples, setSamples] = useState([]);
  const [sampleJobs, setSampleJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'sample'

  useEffect(() => {
    // Fetch test samples
    api.getSampleResumes().then(setSamples).catch(() => {});
    api.getSampleJobs().then(setSampleJobs).catch(() => {});
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSetFile = async (selectedFile) => {
    setError('');
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError(`Unsupported file format '.${ext}'. Please upload a PDF or DOCX file.`);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10 MB limit.');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    try {
      const uploadRes = await api.uploadResume(selectedFile);
      setFileDetails(uploadRes);
    } catch (err) {
      setError(err.message || 'Failed to parse resume file.');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample) => {
    setFileDetails({
      resume_id: null,
      sample_id: sample.id,
      filename: `${sample.title}.pdf`,
      file_size: 1048576,
      file_type: 'PDF',
      preview_text: sample.text.slice(0, 300) + '...',
      raw_text: sample.text
    });
    setJobRole(sample.role || 'Machine Learning Engineer');
  };

  const handleFillSampleJob = (job) => {
    setJobRole(job.title);
    setJobDescription(job.description);
  };

  const handleStartAnalysis = async () => {
    if (!fileDetails) {
      setError('Please upload a resume or select a sample resume first.');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const payload = {
        job_role: jobRole,
        job_description: jobDescription,
      };

      if (fileDetails.resume_id) {
        payload.resume_id = fileDetails.resume_id;
      } else if (fileDetails.raw_text) {
        payload.resume_text = fileDetails.raw_text;
      }

      const res = await api.analyzeResume(payload);
      setAnalysisResult(res);
      // ProcessingAnimation will call onComplete to navigate
    } catch (err) {
      setIsProcessing(false);
      setError(err.message || 'Analysis failed. Please try again.');
    }
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    if (analysisResult) {
      sessionStorage.setItem('current_analysis', JSON.stringify(analysisResult));
      navigate(`/results?analysis_id=${analysisResult.analysis_id || 1}`);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive ATS Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Upload & Analyze Resume
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload your resume and optionally pair it with a job description to receive real-time ATS diagnostics, skill gap reports, and actionable rewrites.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-8">
        
        {/* Step 1: Resume Upload Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>1. Upload Your Resume</span>
              </h2>
              <p className="text-xs text-slate-400">Supported formats: PDF / DOCX • Max 10 MB</p>
            </div>

            {/* Quick samples toggle */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  activeTab === 'file'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sample')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  activeTab === 'sample'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Instant Samples
              </button>
            </div>
          </div>

          {activeTab === 'file' ? (
            <div>
              {!fileDetails ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01] shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50'
                  }`}
                  onClick={() => document.getElementById('resume-file-input').click()}
                >
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-105">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {isDragging ? 'Drop your resume here' : 'Click to browse or drag & drop'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Ensure standard text-layer PDF or Word documents for high-precision ATS entity recognition.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {fileDetails.file_type || 'PDF'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {fileDetails.filename}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {Math.round(fileDetails.file_size / 1024)} KB • Successfully Parsed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setFile(null);
                        setFileDetails(null);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Remove File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {samples.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSample(s)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    fileDetails?.sample_id === s.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-950/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{s.title}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                      ATS: {s.score}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    Targeted for {s.role} positions with structured bullet points and technical keywords.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Target Job Role & Description */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>2. Target Job Description</span>
                <span className="text-[11px] font-normal text-slate-400">(Recommended for precise gap analysis)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Job matching identifies missing keywords and role-specific requirements.
              </p>
            </div>

            {/* Quick Fill Sample JDs */}
            {sampleJobs.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-medium">Quick Fill:</span>
                {sampleJobs.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => handleFillSampleJob(j)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    {j.title.split(' ')[0]} {j.title.split(' ')[1] || ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Job Role / Title
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Machine Learning Engineer, Full Stack Developer"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Paste Job Description
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job qualifications, requirements, and responsibilities here..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 leading-relaxed"
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              * Leaving this empty performs general ATS formatting and structural diagnostics, while providing a job description unlocks tailored keyword density matching.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={!fileDetails || isUploading}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Resume with ATSense AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Animated AI Processing Screen */}
      {isProcessing && (
        <ProcessingAnimation onComplete={handleProcessingComplete} />
      )}

    </div>
  );
};
