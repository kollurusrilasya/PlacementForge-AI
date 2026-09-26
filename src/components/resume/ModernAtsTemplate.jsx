import React from 'react'

export function ModernAtsTemplate({ data }) {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = [],
    experience = [],
    projects = [],
    certifications = [],
    achievements = [],
  } = data

  return (
    <div className="bg-white text-[#111111] p-8 sm:p-10 font-sans text-xs leading-normal max-w-2xl mx-auto shadow-sm min-h-[842px]">
      {/* Modern Header */}
      <div className="pb-4 border-b-2 border-[#D95B14]">
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          {personalInfo.name || 'YOUR NAME'}
        </h1>
        <p className="text-xs font-semibold text-[#D95B14] mt-0.5">Software Engineering Candidate</p>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6B6B6B] mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>
      </div>

      {summary && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
            Summary
          </h2>
          <p className="text-zinc-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Technical Arsenal
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(skills) ? skills : [skills]).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[10px] font-medium border border-zinc-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="pl-3 border-l-2 border-[#D95B14]/40">
                <div className="flex justify-between items-baseline font-semibold text-black">
                  <span>{exp.title}</span>
                  <span className="text-[11px] text-zinc-500 font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="text-[11px] font-medium text-zinc-700">{exp.company} • {exp.location}</p>
                <p className="text-zinc-700 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
            Featured Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={idx} className="pl-3 border-l-2 border-zinc-300">
                <div className="flex justify-between items-baseline font-semibold text-black">
                  <span>{proj.title}</span>
                  <span className="text-[11px] text-zinc-500 font-normal">{proj.technologies}</span>
                </div>
                <p className="text-zinc-700 mt-0.5 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-black">{edu.institution}</p>
                  <p className="text-zinc-600">{edu.degree}</p>
                </div>
                <div className="text-right text-[11px] text-zinc-500">
                  <p>{edu.year}</p>
                  {edu.cgpa && <p className="font-medium text-black">CGPA: {edu.cgpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Certifications
          </h2>
          <ul className="list-disc list-inside space-y-0.5 text-zinc-700">
            {certifications.map((c, idx) => (
              <li key={idx}><span className="font-semibold text-black">{c.name}</span> — {c.issuer} ({c.date})</li>
            ))}
          </ul>
        </div>
      )}

      {achievements.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
            Achievements & Honors
          </h2>
          <ul className="list-disc list-inside space-y-0.5 text-zinc-700">
            {achievements.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function MinimalTemplate({ data }) {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    skills = [],
    experience = [],
    projects = [],
  } = data

  return (
    <div className="bg-white text-[#111111] p-8 sm:p-10 font-sans text-xs leading-normal max-w-2xl mx-auto shadow-sm min-h-[842px] space-y-4">
      {/* Minimal Header */}
      <div>
        <h1 className="text-xl font-medium tracking-tight text-[#111111]">
          {personalInfo.name || 'YOUR NAME'}
        </h1>
        <p className="text-[11px] text-zinc-500 mt-1">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.github]
            .filter(Boolean)
            .join('  /  ')}
        </p>
      </div>

      {summary && (
        <div className="pt-2 border-t border-zinc-200">
          <p className="text-zinc-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="pt-2 border-t border-zinc-200">
          <span className="font-semibold text-zinc-900 block mb-1">SKILLS</span>
          <p className="text-zinc-600 font-mono text-[11px]">
            {Array.isArray(skills) ? skills.join('  •  ') : skills}
          </p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="pt-2 border-t border-zinc-200 space-y-3">
          <span className="font-semibold text-zinc-900 block">EXPERIENCE</span>
          {experience.map((exp, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-medium">
                <span>{exp.title} — {exp.company}</span>
                <span className="text-zinc-500 text-[11px]">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-zinc-600">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="pt-2 border-t border-zinc-200 space-y-2.5">
          <span className="font-semibold text-zinc-900 block">PROJECTS</span>
          {projects.map((proj, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-medium">
                <span>{proj.title}</span>
                <span className="text-zinc-500 text-[11px]">{proj.technologies}</span>
              </div>
              <p className="text-zinc-600">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="pt-2 border-t border-zinc-200 space-y-1.5">
          <span className="font-semibold text-zinc-900 block">EDUCATION</span>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-zinc-700">
              <span>{edu.institution}, {edu.degree}</span>
              <span className="text-zinc-500">{edu.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModernAtsTemplate
