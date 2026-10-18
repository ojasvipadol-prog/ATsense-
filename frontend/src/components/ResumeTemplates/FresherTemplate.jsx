import React from 'react';

export const FresherTemplate = ({ data }) => {
  const {
    personal = {},
    education = [],
    skills = {},
    projects = [],
    experience = [],
    certifications = [],
    achievements = []
  } = data || {};

  return (
    <div className="bg-white text-slate-800 p-8 sm:p-12 shadow-lg max-w-4xl mx-auto font-sans text-xs leading-relaxed border border-slate-200">
      {/* Header - Sticky Frozen Personal Info */}
      <div className="text-center pb-4 pt-1 mb-2 border-b border-emerald-500 sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {personal.fullName || 'Candidate Name'}
        </h1>
        <p className="text-xs font-semibold text-emerald-600 mt-0.5">
          Aspiring Software Engineer & Tech Innovator
        </p>
        <div className="mt-2 text-slate-500 flex flex-wrap justify-center gap-x-2 gap-y-0.5 text-[11px]">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
          {personal.github && <span>• {personal.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mt-4 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
          <p className="text-slate-700 leading-normal">{personal.summary}</p>
        </div>
      )}

      {/* Education First for Freshers */}
      {Array.isArray(education) && education.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">
            Education & Academic Background
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900 text-[13px]">{edu?.degree || ''}</span>
                  {(edu?.university || edu?.college) && (
                    <div className="text-slate-600 font-medium">{edu?.university || edu?.college}</div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-semibold text-emerald-700">{edu?.year || ''}</span>
                  {edu?.cgpa && <div className="text-slate-500 text-[11px]">CGPA: {edu.cgpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {skills && Object.keys(skills).length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">
            Technical Skillset
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(skills).map(([cat, list]) => (
              <div key={cat} className="p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block text-[11px] mb-0.5">{cat}</span>
                <span className="text-slate-600 text-[11px]">
                  {Array.isArray(list) ? list.join(' • ') : list}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">
            Academic & Capstone Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="border-l-2 border-emerald-400 pl-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[13px]">{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-emerald-700 font-mono text-[11px]">{proj.technologies}</span>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                {proj.responsibilities && <p className="text-slate-600 mt-0.5">{proj.responsibilities}</p>}
                {proj.results && (
                  <p className="text-emerald-800 font-semibold mt-0.5">Outcome: {proj.results}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internships & Work Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-2">
            Internships & Experience
          </h2>
          <div className="space-y-2">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">{exp.position} — {exp.company}</span>
                  <span className="text-slate-500">{exp.duration}</span>
                </div>
                {exp.responsibilities && <p className="text-slate-600 mt-0.5">{exp.responsibilities}</p>}
                {exp.achievements && (
                  <p className="text-slate-700 font-medium mt-0.5">Impact: {exp.achievements}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-1.5">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                {certifications.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-200 pb-1 mb-1.5">
                Honors & Extracurriculars
              </h2>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                {achievements.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
