import React from 'react';

export const TechnicalTemplate = ({ data }) => {
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
    <div className="bg-white text-slate-900 p-8 sm:p-12 shadow-lg max-w-4xl mx-auto font-sans text-xs leading-relaxed border border-slate-300">
      {/* Header - Sticky Frozen Personal Info */}
      <div className="pb-4 pt-1 mb-2 border-b-2 border-slate-900 flex justify-between items-start sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-xs">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            {personal.fullName || 'Candidate Name'}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-slate-600 font-mono text-[11px]">
            {personal.github && <span className="font-semibold text-slate-900">{personal.github}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mt-3.5">
          <p className="text-slate-700 leading-normal">{personal.summary}</p>
        </div>
      )}

      {/* Technical Skills First */}
      {skills && Object.keys(skills).length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 mb-2 font-mono">
            // Core Technical Stack
          </h2>
          <div className="space-y-1 px-1">
            {Object.entries(skills).map(([cat, list]) => (
              <div key={cat} className="flex">
                <span className="w-36 font-bold text-slate-800 shrink-0 font-mono text-[11px]">{cat}:</span>
                <span className="text-slate-700">{Array.isArray(list) ? list.join(', ') : list}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 mb-2 font-mono">
            // Engineering Projects & Systems
          </h2>
          <div className="space-y-3 px-1">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[13px]">{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[11px] font-mono text-slate-500">[{proj.technologies}]</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-700 pl-3 relative before:content-['>'] before:absolute before:left-0 before:font-mono">
                    {proj.description}
                  </p>
                )}
                {proj.responsibilities && (
                  <p className="text-slate-700 pl-3 relative before:content-['>'] before:absolute before:left-0 before:font-mono">
                    {proj.responsibilities}
                  </p>
                )}
                {proj.results && (
                  <p className="text-slate-900 font-semibold pl-3 relative before:content-['✓'] before:absolute before:left-0">
                    Results: {proj.results}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 mb-2 font-mono">
            // Professional Engineering Experience
          </h2>
          <div className="space-y-3 px-1">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900 text-[13px]">{exp.position}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{exp.duration}</span>
                </div>
                <div className="text-slate-700 font-medium italic">{exp.company}</div>
                {exp.responsibilities && (
                  <p className="text-slate-700 mt-1 pl-3 relative before:content-['>'] before:absolute before:left-0 before:font-mono">
                    {exp.responsibilities}
                  </p>
                )}
                {exp.achievements && (
                  <p className="text-slate-900 font-semibold mt-0.5 pl-3 relative before:content-['✓'] before:absolute before:left-0">
                    Metric: {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {Array.isArray(education) && education.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-0.5 mb-2 font-mono">
            // Education & Credentials
          </h2>
          <div className="space-y-1 px-1">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{edu?.degree || ''}</span>
                  {(edu?.university || edu?.college) && (
                    <span className="text-slate-600"> — {edu?.university || edu?.college}</span>
                  )}
                </div>
                <span className="font-mono text-slate-500">{edu?.year || ''} {edu?.cgpa ? `| ${edu.cgpa}` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Honors */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 px-1">
          {certifications.length > 0 && (
            <div>
              <span className="font-bold font-mono text-slate-800 block text-[11px] mb-1">// Certifications</span>
              <ul className="space-y-0.5 text-slate-700">
                {certifications.map((c, i) => (
                  <li key={i} className="pl-3 relative before:content-['#'] before:absolute before:left-0 before:text-slate-400 font-mono text-[11px]">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {achievements.length > 0 && (
            <div>
              <span className="font-bold font-mono text-slate-800 block text-[11px] mb-1">// Honors</span>
              <ul className="space-y-0.5 text-slate-700">
                {achievements.map((a, i) => (
                  <li key={i} className="pl-3 relative before:content-['#'] before:absolute before:left-0 before:text-slate-400 font-mono text-[11px]">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
