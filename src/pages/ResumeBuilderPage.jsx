import React, { useState } from 'react'
import {
  PageHeader,
  LightCard,
  Badge,
  ProgressIndicator,
  PrimaryButton,
  SecondaryButton,
  Input,
} from '../components/common'
import ResumePreview from '../components/resume/ResumePreview'
import { INITIAL_RESUME_DATA } from '../data/initialMockData'
import { useToast } from '../context/ToastContext'
import {
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Eye,
  Edit3,
} from 'lucide-react'

const STORAGE_KEY = 'placement_forge_resume'

export function ResumeBuilderPage() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_RESUME_DATA
    } catch {
      return INITIAL_RESUME_DATA
    }
  })

  const [template, setTemplate] = useState('classic')
  const [mobileTab, setMobileTab] = useState('editor') // 'editor' | 'preview'
  const toast = useToast()

  // Save to localStorage
  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      toast.show('Resume draft saved successfully to local workspace', { type: 'success' })
    } catch {
      toast.show('Failed to save resume draft', { type: 'error' })
    }
  }

  // Calculate completeness percentage
  const calculateCompleteness = () => {
    let score = 0
    if (data.personalInfo.name && data.personalInfo.email && data.personalInfo.phone) score += 20
    if (data.summary && data.summary.length > 30) score += 15
    if (data.education && data.education.length > 0) score += 15
    if (data.skills && data.skills.length >= 4) score += 15
    if (data.experience && data.experience.length > 0) score += 15
    if (data.projects && data.projects.length >= 2) score += 15
    if (data.certifications && data.certifications.length > 0) score += 5
    return Math.min(100, score)
  }

  const completeness = calculateCompleteness()

  // Suggestions for missing elements
  const getSuggestions = () => {
    const suggestions = []
    if (!data.personalInfo.github) suggestions.push('Add your GitHub profile URL')
    if (!data.personalInfo.linkedin) suggestions.push('Add your LinkedIn profile URL')
    if (data.projects.length < 2) suggestions.push('Include at least 2 full-stack or systems projects')
    if (data.certifications.length === 0) suggestions.push('Add relevant cloud or algorithmic certifications')
    return suggestions
  }

  const suggestions = getSuggestions()

  // Update Personal Info
  const updatePersonal = (field, val) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val },
    }))
  }

  // Add / Remove Education
  const addEducation = () => {
    const newEdu = {
      institution: 'University / Institute Name',
      degree: 'B.Tech in Computer Science',
      year: '2022 - 2026',
      cgpa: '8.5 / 10',
    }
    setData((prev) => ({ ...prev, education: [...prev.education, newEdu] }))
  }

  const removeEducation = (index) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  // Add / Remove Experience
  const addExperience = () => {
    const newExp = {
      id: 'exp_' + Date.now(),
      title: 'Software Engineer Intern',
      company: 'Tech Company',
      location: 'Bangalore, India',
      startDate: 'Jan 2026',
      endDate: 'Present',
      description: 'Built scalable backend microservices and improved database queries.',
    }
    setData((prev) => ({ ...prev, experience: [...prev.experience, newExp] }))
  }

  const removeExperience = (index) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  // Add / Remove Project
  const addProject = () => {
    const newProj = {
      id: 'proj_' + Date.now(),
      title: 'Full Stack Web Platform',
      technologies: 'React, Node.js, PostgreSQL',
      description: 'Engineered responsive web client and optimized query performance.',
    }
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }))
  }

  const removeProject = (index) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  // Add / Remove Certification
  const addCertification = () => {
    const newCert = {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2025',
    }
    setData((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCert],
    }))
  }

  const removeCertification = (index) => {
    setData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index),
    }))
  }

  // Add / Remove Achievement
  const addAchievement = () => {
    setData((prev) => ({
      ...prev,
      achievements: [
        ...(prev.achievements || []),
        'Finalist in Smart India Hackathon 2025 among 1,200+ teams',
      ],
    }))
  }

  const removeAchievement = (index) => {
    setData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Resume Builder"
        subtitle="Craft an ATS-optimized software engineering resume step-by-step with real-time live preview."
        breadcrumbs={['Preparation', 'Resume Builder']}
        badge={<Badge variant="accent" dot>Completeness: {completeness}%</Badge>}
        action={
          <div className="flex items-center gap-2">
            <SecondaryButton onClick={handleSave} icon={Save}>
              Save Resume
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                handleSave()
                window.location.href = '/resume/scorer'
              }}
            >
              Scan with ATS
            </PrimaryButton>
          </div>
        }
      />

      {/* Completeness & Suggestions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <LightCard className="md:col-span-5 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#111111]">Resume Completeness</span>
            <span className="font-mono font-bold text-[#D95B14]">{completeness}%</span>
          </div>
          <ProgressIndicator value={completeness} variant="accent" showPercentage={false} size="sm" />
          <p className="text-[11px] text-[#6B6B6B] mt-2">
            Target 90%+ for top applicant pool filtering.
          </p>
        </LightCard>

        <LightCard className="md:col-span-7 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#111111] mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#D95B14]" />
            <span>Recommended Next Additions</span>
          </div>
          {suggestions.length > 0 ? (
            <ul className="text-xs text-[#6B6B6B] space-y-1">
              {suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-[#D95B14]">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ All high-priority ATS resume sections are populated!
            </p>
          )}
        </LightCard>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="flex lg:hidden rounded-[10px] bg-[#F4F4F1] p-1 border border-[#E8E8E5]">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-[8px] flex items-center justify-center gap-1.5 ${
            mobileTab === 'editor' ? 'bg-white text-[#111111] shadow-subtle' : 'text-[#6B6B6B]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Form Editor</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-[8px] flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview' ? 'bg-white text-[#111111] shadow-subtle' : 'text-[#6B6B6B]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live ATS Preview</span>
        </button>
      </div>

      {/* Dual Pane Layout (Desktop Left Editor, Right Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 9 SECTIONS EDITOR */}
        <div className={`lg:col-span-6 space-y-6 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
          {/* Section 1: Personal Information */}
          <LightCard className="p-6 space-y-4">
            <div className="border-b border-[#E8E8E5] pb-3">
              <h3 className="text-sm font-semibold text-[#111111]">1. Personal Information</h3>
              <p className="text-xs text-[#6B6B6B]">Basic contact and verified profile links.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Full Name"
                value={data.personalInfo.name}
                onChange={(e) => updatePersonal('name', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
              />
              <Input
                label="Phone Number"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
              />
              <Input
                label="Location"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonal('location', e.target.value)}
              />
              <Input
                label="LinkedIn Profile"
                value={data.personalInfo.linkedin}
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
              />
              <Input
                label="GitHub Profile"
                value={data.personalInfo.github}
                onChange={(e) => updatePersonal('github', e.target.value)}
              />
            </div>
          </LightCard>

          {/* Section 2: Professional Summary */}
          <LightCard className="p-6 space-y-4">
            <div className="border-b border-[#E8E8E5] pb-3">
              <h3 className="text-sm font-semibold text-[#111111]">2. Professional Summary</h3>
              <p className="text-xs text-[#6B6B6B]">Concise 2–3 sentence career synopsis.</p>
            </div>
            <textarea
              className="w-full p-3 text-xs bg-white text-[#111111] rounded-[10px] border border-[#E8E8E5] focus:outline-none focus:ring-1 focus:ring-[#111111] leading-relaxed"
              rows={3}
              value={data.summary}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
            />
          </LightCard>

          {/* Section 3: Education */}
          <LightCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#111111]">3. Education</h3>
                <p className="text-xs text-[#6B6B6B]">Colleges and degrees in chronological order.</p>
              </div>
              <SecondaryButton size="sm" icon={Plus} onClick={addEducation}>
                Add Education
              </SecondaryButton>
            </div>

            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-[12px] bg-[#FAFAF9] border border-[#E8E8E5] space-y-3 relative">
                  <button
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                    <Input
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEd = [...data.education]
                        newEd[idx].institution = e.target.value
                        setData({ ...data, education: newEd })
                      }}
                    />
                    <Input
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEd = [...data.education]
                        newEd[idx].degree = e.target.value
                        setData({ ...data, education: newEd })
                      }}
                    />
                    <Input
                      label="Years"
                      value={edu.year}
                      onChange={(e) => {
                        const newEd = [...data.education]
                        newEd[idx].year = e.target.value
                        setData({ ...data, education: newEd })
                      }}
                    />
                    <Input
                      label="CGPA / Grade"
                      value={edu.cgpa}
                      onChange={(e) => {
                        const newEd = [...data.education]
                        newEd[idx].cgpa = e.target.value
                        setData({ ...data, education: newEd })
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </LightCard>

          {/* Section 4: Skills */}
          <LightCard className="p-6 space-y-4">
            <div className="border-b border-[#E8E8E5] pb-3">
              <h3 className="text-sm font-semibold text-[#111111]">4. Technical Skills</h3>
              <p className="text-xs text-[#6B6B6B]">Comma-separated list of engineering proficiencies.</p>
            </div>
            <textarea
              className="w-full p-3 text-xs bg-white text-[#111111] rounded-[10px] border border-[#E8E8E5] focus:outline-none focus:ring-1 focus:ring-[#111111]"
              rows={2}
              value={Array.isArray(data.skills) ? data.skills.join(', ') : data.skills}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </LightCard>

          {/* Section 5: Experience */}
          <LightCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#111111]">5. Work Experience</h3>
                <p className="text-xs text-[#6B6B6B]">Internships, research, and technical roles.</p>
              </div>
              <SecondaryButton size="sm" icon={Plus} onClick={addExperience}>
                Add Role
              </SecondaryButton>
            </div>

            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-[12px] bg-[#FAFAF9] border border-[#E8E8E5] space-y-3 relative">
                  <button
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                    <Input
                      label="Title / Role"
                      value={exp.title}
                      onChange={(e) => {
                        const arr = [...data.experience]
                        arr[idx].title = e.target.value
                        setData({ ...data, experience: arr })
                      }}
                    />
                    <Input
                      label="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const arr = [...data.experience]
                        arr[idx].company = e.target.value
                        setData({ ...data, experience: arr })
                      }}
                    />
                    <Input
                      label="Start Date"
                      value={exp.startDate}
                      onChange={(e) => {
                        const arr = [...data.experience]
                        arr[idx].startDate = e.target.value
                        setData({ ...data, experience: arr })
                      }}
                    />
                    <Input
                      label="End Date"
                      value={exp.endDate}
                      onChange={(e) => {
                        const arr = [...data.experience]
                        arr[idx].endDate = e.target.value
                        setData({ ...data, experience: arr })
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#111111] mb-1">
                      Responsibilities & Quantified Impact
                    </label>
                    <textarea
                      className="w-full p-2.5 text-xs bg-white text-[#111111] rounded-[8px] border border-[#E8E8E5] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const arr = [...data.experience]
                        arr[idx].description = e.target.value
                        setData({ ...data, experience: arr })
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </LightCard>

          {/* Section 6: Projects */}
          <LightCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#111111]">6. Projects</h3>
                <p className="text-xs text-[#6B6B6B]">Key technical software projects with metrics.</p>
              </div>
              <SecondaryButton size="sm" icon={Plus} onClick={addProject}>
                Add Project
              </SecondaryButton>
            </div>

            <div className="space-y-4">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-[12px] bg-[#FAFAF9] border border-[#E8E8E5] space-y-3 relative">
                  <button
                    onClick={() => removeProject(idx)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                    <Input
                      label="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const arr = [...data.projects]
                        arr[idx].title = e.target.value
                        setData({ ...data, projects: arr })
                      }}
                    />
                    <Input
                      label="Technologies Used"
                      value={proj.technologies}
                      onChange={(e) => {
                        const arr = [...data.projects]
                        arr[idx].technologies = e.target.value
                        setData({ ...data, projects: arr })
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#111111] mb-1">
                      Project Description & Metrics
                    </label>
                    <textarea
                      className="w-full p-2.5 text-xs bg-white text-[#111111] rounded-[8px] border border-[#E8E8E5] focus:outline-none focus:ring-1 focus:ring-[#111111]"
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const arr = [...data.projects]
                        arr[idx].description = e.target.value
                        setData({ ...data, projects: arr })
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </LightCard>

          {/* Section 7: Certifications */}
          <LightCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#111111]">7. Certifications</h3>
                <p className="text-xs text-[#6B6B6B]">Verified industry accreditations.</p>
              </div>
              <SecondaryButton size="sm" icon={Plus} onClick={addCertification}>
                Add Cert
              </SecondaryButton>
            </div>

            <div className="space-y-3">
              {(data.certifications || []).map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-[10px] bg-[#FAFAF9] border border-[#E8E8E5]">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={cert.name}
                      onChange={(e) => {
                        const arr = [...data.certifications]
                        arr[idx].name = e.target.value
                        setData({ ...data, certifications: arr })
                      }}
                    />
                    <Input
                      value={cert.issuer}
                      onChange={(e) => {
                        const arr = [...data.certifications]
                        arr[idx].issuer = e.target.value
                        setData({ ...data, certifications: arr })
                      }}
                    />
                    <Input
                      value={cert.date}
                      onChange={(e) => {
                        const arr = [...data.certifications]
                        arr[idx].date = e.target.value
                        setData({ ...data, certifications: arr })
                      }}
                    />
                  </div>
                  <button
                    onClick={() => removeCertification(idx)}
                    className="text-zinc-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </LightCard>

          {/* Section 8: Achievements */}
          <LightCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#111111]">8. Achievements & Honors</h3>
                <p className="text-xs text-[#6B6B6B]">Competitive programming, hackathons, and awards.</p>
              </div>
              <SecondaryButton size="sm" icon={Plus} onClick={addAchievement}>
                Add Achievement
              </SecondaryButton>
            </div>

            <div className="space-y-2">
              {(data.achievements || []).map((ach, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={ach}
                    onChange={(e) => {
                      const arr = [...data.achievements]
                      arr[idx] = e.target.value
                      setData({ ...data, achievements: arr })
                    }}
                  />
                  <button
                    onClick={() => removeAchievement(idx)}
                    className="text-zinc-400 hover:text-rose-600 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </LightCard>

          {/* Section 9: Coding Profiles */}
          <LightCard className="p-6 space-y-4">
            <div className="border-b border-[#E8E8E5] pb-3">
              <h3 className="text-sm font-semibold text-[#111111]">9. Coding Profiles</h3>
              <p className="text-xs text-[#6B6B6B]">Platform handles for technical recruiters.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="LeetCode Handle"
                placeholder="e.g. sampath_s"
                value={data.codingProfiles?.leetcode || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    codingProfiles: { ...data.codingProfiles, leetcode: e.target.value },
                  })
                }
              />
              <Input
                label="Codeforces Handle"
                placeholder="e.g. sampath_cf"
                value={data.codingProfiles?.codeforces || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    codingProfiles: { ...data.codingProfiles, codeforces: e.target.value },
                  })
                }
              />
              <Input
                label="HackerRank Handle"
                placeholder="e.g. sampath_hr"
                value={data.codingProfiles?.hackerrank || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    codingProfiles: { ...data.codingProfiles, hackerrank: e.target.value },
                  })
                }
              />
            </div>
          </LightCard>
        </div>

        {/* RIGHT COLUMN: STICKY LIVE RESUME PREVIEW */}
        <div className={`lg:col-span-6 lg:sticky lg:top-24 h-[calc(100vh-8rem)] ${mobileTab === 'editor' ? 'hidden lg:block' : ''}`}>
          <ResumePreview
            data={data}
            selectedTemplate={template}
            onSelectTemplate={setTemplate}
          />
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilderPage
