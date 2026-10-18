import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  Terminal,
  FolderGit2,
  Send
} from 'lucide-react';

export const CareerGuidancePage = () => {
  const roadmapMilestones = [
    {
      step: "01",
      title: "Master Python & Algorithms",
      status: "Completed",
      desc: "Data structures, OOP, asynchronous workflows, and API consumption with standard libraries.",
      icon: Code2,
      color: "emerald"
    },
    {
      step: "02",
      title: "Machine Learning & Deep Learning",
      status: "In Progress",
      desc: "PyTorch, Scikit-learn, CNN/Transformer backbones, loss functions, and validation strategies.",
      icon: Terminal,
      color: "blue"
    },
    {
      step: "03",
      title: "Build Production Projects",
      status: "Next Priority",
      desc: "Develop full-stack ML apps with FastAPI and Docker; focus on sub-50ms inference latency.",
      icon: FolderGit2,
      color: "indigo"
    },
    {
      step: "04",
      title: "Learn Cloud & Deployment",
      status: "Upcoming",
      desc: "Containerization with Docker, AWS EC2/S3 deployment, and automated GitHub Actions CI/CD.",
      icon: Layers,
      color: "violet"
    },
    {
      step: "05",
      title: "Create Portfolio & Open Source",
      status: "Upcoming",
      desc: "Publish clean GitHub repositories with live demo URLs, benchmarks, and interactive READMEs.",
      icon: Sparkles,
      color: "purple"
    },
    {
      step: "06",
      title: "Apply for Internships & Full-Time",
      status: "Upcoming",
      desc: "Target high-compatibility ATS matches (85%+) using ATSense AI tailored resumes.",
      icon: Send,
      color: "pink"
    }
  ];

  const suggestedProjects = [
    {
      title: "Real-Time Multi-Modal Defect Classifier",
      stack: "PyTorch, FastAPI, Docker, OpenCV",
      difficulty: "Advanced",
      metric: "Target 95%+ precision on industrial inspection benchmarks."
    },
    {
      title: "Enterprise Vector Search Engine (RAG)",
      stack: "Python, Pinecone, LangChain, HuggingFace",
      difficulty: "Intermediate",
      metric: "Sub-50ms semantic query retrieval across 100k+ documents."
    },
    {
      title: "Microservice CI/CD Automated Test Pipeline",
      stack: "Docker, GitHub Actions, AWS EC2, Prometheus",
      difficulty: "Intermediate",
      metric: "Achieve zero-downtime deployment with automated integration testing."
    }
  ];

  const certifications = [
    { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", priority: "High" },
    { name: "DeepLearning.AI Machine Learning Specialization", issuer: "Andrew Ng / Coursera", priority: "High" },
    { name: "Certified Kubernetes Application Developer (CKAD)", issuer: "Cloud Native Computing Foundation", priority: "Medium" }
  ];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Strategic Skill Trajectory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Your Career Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Personalized progression pathway from foundational proficiencies to competitive market candidacy.
        </p>
      </div>

      {/* Interactive Vertical Roadmap / Timeline */}
      <div className="mb-16">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center">
          Career Development Timeline
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-600 via-indigo-600 to-violet-600 -translate-x-1/2" />

          <div className="space-y-8">
            {roadmapMilestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.step}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge Node */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-600 shadow-md flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>

                  {/* Content Card */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8">
                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-blue-600">
                          Step {milestone.step}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          milestone.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-600'
                            : milestone.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Projects & Certifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Suggested Projects */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            <span>High-Impact Projects to Build</span>
          </h3>

          <div className="space-y-4">
            {suggestedProjects.map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{p.title}</span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                    {p.difficulty}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mb-2">Stack: {p.stack}</div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  ⚡ Metric: {p.metric}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Certifications */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Recommended Certifications</span>
          </h3>

          <div className="space-y-4">
            {certifications.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</div>
                  <div className="text-[11px] text-slate-400">Issuer: {c.issuer}</div>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200">
                  Priority: {c.priority}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
            <strong>Next Step:</strong> Pick 1 core project and 1 certification. Integrate them into your ATSense profile once verified to boost your ATS qualification tier.
          </div>
        </div>

      </div>

    </div>
  );
};
