import React from 'react'

export function ClassicAtsTemplate({ data }) {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = [],
    experience = [],
    projects = [],
    certifications = [],
    achievements = [],
    codingProfiles = {},
  } = data

  return (
    <div className="bg-white text-[#111111] p-8 sm:p-10 font-sans text-xs leading-normal max-w-2xl mx-auto shadow-sm min-h-[842px]">
      {/* Header / Contact */}
      <div className="text-center pb-4 border-b border-black">
        <h1 className="text-xl font-bold uppercase tracking-wider text-black">
          {personalInfo.name || 'YOUR NAME'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-700 mt-1">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>
        {Object.values(codingProfiles).some(Boolean) && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-zinc-600 mt-1 font-mono">
            {codingProfiles.leetcode && <span>LeetCode: {codingProfiles.leetcode}</span>}
            {codingProfiles.codeforces && <span>• CF: {codingProfiles.codeforces}</span>}
            {codingProfiles.hackerrank && <span>• HR: {codingProfiles.hackerrank}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-black">
            Professional Summary
          </h2>
          <p className="mt-1.5 text-zinc-800 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-black">
            Education
          </h2>
          <div className="mt-2 space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-black">{edu.institution}</p>
                  <p className="text-zinc-700">{edu.degree}</p>
                </div>
                <div className="text-right text-[11px] text-zinc-600">
                  <p>{edu.year}</p>
                  {edu.cgpa && <p className="font-semibold text-black">CGPA: {edu.cgpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-black">
            Technical Proficiencies
          </h2>
          <p className="mt-1.5 text-zinc-800">
            <span className="font-semibold">Skills & Frameworks:</span>{' '}
            {Array.isArray(skills) ? skills.join(', ') : skills}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-black">
            Work Experience
          </h2>
          <div className="mt-2 space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{exp.title} — {exp.company}</span>
                  <span className="text-[11px] font-normal text-zinc-600">{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="text-zinc-700 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-black">
            Key Projects
          </h2>
          <div className="mt-2 space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{proj.title} <span className="font-normal text-[11px] text-zinc-600">| {proj.technologies}</span></span>
                </div>
                <p className="text-zinc-700 mt-0.5 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-black">
            Certifications
          </h2>
          <ul className="mt-1.5 list-disc list-inside space-y-0.5 text-zinc-800">
            {certifications.map((cert, idx) => (
              <li key={idx}>
                <span className="font-semibold">{cert.name}</span> — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-black">
            Achievements & Honors
          </h2>
          <ul className="mt-1.5 list-disc list-inside space-y-0.5 text-zinc-800">
            {achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ClassicAtsTemplate
