import React from 'react';

export const ModernTemplate = ({ data }) => {
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
      <div className="pb-4 pt-1 mb-2 border-b-2 border-blue-600 flex flex-col sm:flex-row justify-between sm:items-end gap-3 sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-xs">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {personal.fullName || 'Candidate Name'}
          </h1>
          <p className="text-sm font-semibold text-blue-600 mt-0.5">
            {personal.role || 'Software & AI Engineer'}
          </p>
        </div>
        <div className="text-right sm:text-right text-slate-500 space-y-0.5">
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
          <div className="flex gap-2 justify-start sm:justify-end text-blue-600">
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.github && <span>• {personal.github}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Professional Summary
          </h2>
          <p className="text-slate-600 leading-normal pl-3 border-l-2 border-slate-200">
            {personal.summary}
          </p>
        </div>
      )}

      {/* Skills Chips */}
      {skills && Object.keys(skills).length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Core Competencies & Skills
          </h2>
          <div className="space-y-1.5 pl-3 border-l-2 border-slate-200">
            {Object.entries(skills).map(([cat, list]) => (
              <div key={cat} className="flex flex-wrap items-baseline gap-1.5">
                <span className="font-bold text-slate-700">{cat}:</span>
                {Array.isArray(list) ? (
                  list.map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium text-[11px]">
                      {s}
                    </span>
                  ))
                ) : (
                  <span>{list}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Work Experience
          </h2>
          <div className="space-y-3.5 pl-3 border-l-2 border-slate-200">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-[13px]">{exp.position}</span>
                  <span className="text-slate-400 font-medium">{exp.duration}</span>
                </div>
                <div className="text-blue-600 font-semibold mb-1">{exp.company}</div>
                {exp.responsibilities && (
                  <p className="text-slate-600 leading-normal">{exp.responsibilities}</p>
                )}
                {exp.achievements && (
                  <p className="text-slate-700 font-medium mt-1 bg-blue-50/60 p-1.5 rounded">
                    ⚡ Impact: {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Featured Projects
          </h2>
          <div className="space-y-3 pl-3 border-l-2 border-slate-200">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[13px]">{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[11px] font-mono text-blue-600">{proj.technologies}</span>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                {proj.results && (
                  <p className="text-emerald-700 font-semibold text-[11px] mt-0.5">
                    ✓ {proj.results}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {Array.isArray(education) && education.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Education
          </h2>
          <div className="space-y-2 pl-3 border-l-2 border-slate-200">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu?.degree || ''}</span>
                  {(edu?.university || edu?.college) && (
                    <span className="text-slate-600"> — {edu?.university || edu?.college}</span>
                  )}
                </div>
                <span className="text-slate-500 font-medium">
                  {edu?.year || ''} {edu?.cgpa ? `(CGPA: ${edu.cgpa})` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Honors */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1.5">
                Certifications
              </h2>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {certifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1.5">
                Achievements
              </h2>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
