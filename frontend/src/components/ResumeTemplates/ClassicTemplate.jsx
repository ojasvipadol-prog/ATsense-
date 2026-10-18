import React from 'react';

export const ClassicTemplate = ({ data }) => {
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
    <div className="bg-white text-gray-900 p-8 sm:p-12 shadow-md max-w-4xl mx-auto font-serif text-[13px] leading-relaxed border border-gray-200">
      {/* Header - Sticky Frozen Personal Info */}
      <div className="text-center pb-4 pt-1 mb-2 border-b border-gray-400 sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-xs">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
          {personal.fullName || 'Candidate Name'}
        </h1>
        <div className="mt-1.5 text-xs text-gray-600 flex flex-wrap justify-center gap-x-2 gap-y-1">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
          {personal.github && <span>• {personal.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-justify">{personal.summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && Object.keys(skills).length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="space-y-1">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="text-gray-700">
                <span className="font-semibold text-gray-900">{category}: </span>
                <span>{Array.isArray(items) ? items.join(', ') : items}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-0.5 mb-1.5">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{exp.position}</span>
                  <span className="text-xs text-gray-600">{exp.duration}</span>
                </div>
                <div className="text-xs italic text-gray-700">{exp.company}</div>
                {exp.responsibilities && (
                  <p className="mt-1 text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0">
                    {exp.responsibilities}
                  </p>
                )}
                {exp.achievements && (
                  <p className="mt-0.5 text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0">
                    <span className="font-semibold">Key Achievement:</span> {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-0.5 mb-1.5">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-xs italic text-gray-600">[{proj.technologies}]</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0">
                    {proj.description}
                  </p>
                )}
                {proj.responsibilities && (
                  <p className="text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0">
                    {proj.responsibilities}
                  </p>
                )}
                {proj.results && (
                  <p className="text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 font-medium">
                    Impact: {proj.results}
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-gray-900">{edu?.degree || ''}</span>
                  {(edu?.university || edu?.college) && (
                    <span className="text-gray-700"> — {edu?.university || edu?.college}</span>
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  {edu?.year || ''} {edu?.cgpa ? `| CGPA: ${edu.cgpa}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-0.5 mb-1.5">
            Certifications
          </h2>
          <ul className="list-disc pl-5 space-y-0.5 text-gray-700">
            {certifications.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-0.5 mb-1.5">
            Honors & Achievements
          </h2>
          <ul className="list-disc pl-5 space-y-0.5 text-gray-700">
            {achievements.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
