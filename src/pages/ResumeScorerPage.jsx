import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageHeader,
  LightCard,
  DarkCard,
  Badge,
  ProgressIndicator,
  PrimaryButton,
} from '../components/common'
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Check,
  X,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useToast } from '../context/ToastContext'
import { apiRequest } from '../services/api'

export function ResumeScorerPage() {
  const [scanState, setScanState] = useState('idle') // 'idle' | 'scanning' | 'results' | 'error'
  const [scanStep, setScanStep] = useState(0)
  const [fileName, setFileName] = useState('Sampath_Srinivas_Resume.pdf')
  const [scoreData, setScoreData] = useState(null)
  const [scoreHistory, setScoreHistory] = useState([])
  const navigate = useNavigate()
  const toast = useToast()
  useEffect(() => {
  const loadHistory = async () => {
    const token = localStorage.getItem('placement_forge_token')
    if (!token) return

    try {
      const result = await apiRequest('/api/resume/score-history', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setScoreHistory(result.history || [])
    } catch (error) {
      console.error('Could not load score history:', error)
    }
  }

  loadHistory()
}, [])

  const SCAN_STEPS = [
    'Parsing document layout & section hierarchy...',
    'Matching recruiter keywords against SDE-1 specifications...',
    'Evaluating quantifiable impact & metrics density...',
    'Generating ATS compatibility rubric & score...',
  ]

 /* const SCORE_HISTORY = [
    { name: 'Initial Draft', score: 62 },
    { name: 'Rev 1', score: 68 },
    { name: 'Rev 2', score: 75 },
    { name: 'Current Audit', score: 82 },
    { name: 'Target Tier-1', score: 90 },
  ]

  const BREAKDOWN = [
    { label: 'Keyword Match', score: 18, max: 20 },
    { label: 'Formatting & ATS Cleanliness', score: 17, max: 20 },
    { label: 'Skills Alignment', score: 16, max: 20 },
    { label: 'Work Experience Quality', score: 15, max: 20 },
    { label: 'Projects & Quantified Impact', score: 9, max: 10 },
    { label: 'Education & Chronology', score: 7, max: 10 },
  ]

  const MATCHED_KEYWORDS = [
    'React',
    'Node.js',
    'JavaScript',
    'REST APIs',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'Data Structures',
    'Algorithms',
    'Git',
  ]

  const MISSING_KEYWORDS = [
    'System Design',
    'Redis Caching',
    'CI/CD Pipelines',
    'AWS / Cloud',
    'Kubernetes',
  ]

  const BEFORE_AFTER = [
    {
      section: 'Work Experience — NexTech Labs',
      before: 'Worked on backend APIs and helped make the dashboard faster for the client team.',
      after: 'Architected REST endpoints in Node.js, reducing client payload response times by 34% through Redis caching.',
      impact: '+4 pts ATS score',
    },
    {
      section: 'Projects — Distributed KV Store',
      before: 'Built a key value store using Go language that supports storage and retrieval.',
      after: 'Engineered a distributed key-value store in Go implementing Raft consensus for linearizable reads across 5 replicas.',
      impact: '+5 pts ATS score',
    },
  ]*/

  const handleResumeUpload = async (file) => {
    if (!file) {
      toast.show('Please select a PDF file', { type: 'error' })
      return
    }

    if (
      file.type !== 'application/pdf' &&
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      toast.show('Only PDF files are allowed', { type: 'error' })
      return
    }

    const token = localStorage.getItem('placement_forge_token')

    if (!token) {
      toast.show('Please log in before uploading your resume', {
        type: 'error',
      })
      return
    }

    const formData = new FormData()
    formData.append('resume', file)

    try {
      setScanState('scanning')
      setScanStep(0)

      // Step 1: Upload the PDF
      const result = await apiRequest('/api/resume/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      // Step 2: Extract text from the uploaded PDF
      const extractionResult = await apiRequest('/api/resume/text', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setFileName(file.name)
      setScoreData(null)
      setScanState('idle')

      toast.show(
        extractionResult.message || result.message ||
          'Resume uploaded and text extracted successfully',
        { type: 'forge' }
      )
    } catch (error) {
      setScanState('idle')

      toast.show(error.message || 'Resume upload failed', {
        type: 'error',
      })
    }
  }

const runScan = async () => {
  const token = localStorage.getItem('placement_forge_token')

  if (!token) {
    toast.show('Please log in before scanning your resume', {
      type: 'error',
    })
    return
  }

  try {
    setScanState('scanning')
    setScanStep(0)
    setScoreData(null)

    const result = await apiRequest('/api/resume/score', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setScoreData(result.scoreData)

    const historyResult = await apiRequest('/api/resume/score-history', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setScoreHistory(historyResult.history || [])
    setScanStep(SCAN_STEPS.length - 1)
    setScanState('results')

    toast.show('ATS analysis completed successfully!', {
      type: 'success',
    })
  } catch (error) {
    setScanState('idle')
    toast.show(error.message || 'ATS analysis failed', {
      type: 'error',
    })
  }
}

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume Scorer & ATS Diagnostic"
        subtitle="Benchmark your resume against top software engineering criteria, verify ATS parser safety, and eliminate vague phrasing."
        breadcrumbs={['Preparation', 'Resume Scorer']}
        badge={
          scanState === 'results' ? (
            <Badge variant="accent" dot>ATS Analysis Complete</Badge>
          ) : null
        }
        action={
          scanState === 'results' && (
            <PrimaryButton onClick={() => setScanState('idle')}>
              Scan Another Resume
            </PrimaryButton>
          )
        }
      />

      {/* ── 1. IDLE / UPLOAD STATE ── */}
      {scanState === 'idle' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <LightCard className="p-8 text-center space-y-5 border-dashed border-2 border-[#DCDCD8]">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF5EE] text-[#D95B14] flex items-center justify-center mx-auto">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#111111]">
                Upload Resume or Use Active Builder Draft
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-1 max-w-sm mx-auto">
                Upload a PDF file or immediately audit your draft from the Placement Forge Resume Builder.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton onClick={runScan}>
                Scan Active Resume Draft
              </PrimaryButton>
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-[10px] bg-white text-[#111111] border border-[#E8E8E5] hover:bg-[#F4F4F1] shadow-subtle">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                   onChange={(e) => {
  const file = e.target.files?.[0]

  if (file) {
    handleResumeUpload(file)
  }

  e.target.value = ''
}}
                />
                Upload Custom PDF
              </label>
            </div>

            <p className="text-[11px] text-[#8E8E8A]">
              Recommended format: PDF, single-column, standard font (Inter, Roboto, Arial).
            </p>
          </LightCard>
        </div>
      )}

      {/* ── 2. SCANNING ANIMATION STATE ── */}
      {scanState === 'scanning' && (
        <div className="max-w-lg mx-auto py-12">
          <LightCard className="p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto shadow-subtle animate-spin">
              <RefreshCw className="w-6 h-6 text-[#D95B14]" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#111111]">
                Auditing {fileName}...
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Simulating recruiter ATS parsing engine
              </p>
            </div>

            <div className="space-y-3 text-left max-w-sm mx-auto pt-2">
              {SCAN_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                    idx <= scanStep ? 'text-[#111111] opacity-100' : 'text-[#8E8E8A] opacity-40'
                  }`}
                >
                  {idx < scanStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : idx === scanStep ? (
                    <span className="w-4 h-4 rounded-full border-2 border-[#D95B14] border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-[#DCDCD8] shrink-0" />
                  )}
                  <span className={idx === scanStep ? 'font-semibold text-[#D95B14]' : ''}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </LightCard>
        </div>
      )}

      {/* ── 3. RESULTS DASHBOARD STATE ── */}
      {scanState === 'results' && scoreData && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Score */}
            <DarkCard className="lg:col-span-5 p-8 flex flex-col justify-between">
              <div>
                <Badge variant="accent" size="sm" dot>ATS Diagnostic Verified</Badge>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-6xl font-bold tracking-tight text-white">
                    {scoreData?.score ?? 0}
                  </span>
                  <span className="text-xl text-[#8E8E8E]">/100</span>
                </div>
                <p className="text-sm font-semibold text-emerald-400 mt-2">
                  Strong Candidate Tier (Top 15th Percentile)
                </p>
                <p className="text-xs text-[#A0A0A0] mt-1 leading-relaxed">
                  Your score is based on the extracted resume text, target-role keywords, and available resume sections.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2A2A28] flex items-center justify-between">
                <span className="text-xs text-[#8E8E8E]">
                  Target Role: {scoreData?.targetRole || 'Not specified'}
                </span>
                <PrimaryButton
                  size="sm"
                  className="bg-[#D95B14] text-white hover:bg-[#BF4D0C]"
                  onClick={() => navigate('/resume')}
                >
                  Improve My Resume
                </PrimaryButton>
              </div>
            </DarkCard>

            {/* Score History Chart */}
            <LightCard className="lg:col-span-7 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3 mb-2">
                <div>
                  <h4 className="text-xs font-semibold text-[#111111]">Score Progression History</h4>
                  <p className="text-[11px] text-[#6B6B6B]">Tracking score across revisions</p>
                </div>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                   data={scoreHistory.map((item) => ({
                    name: new Date(item.createdAt).toLocaleDateString(),
                    score: item.score,
                  }))}
                  margin={{ top: 10, right: 20, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid stroke="#E8E8E5" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B6B6B' }} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#6B6B6B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111111',
                        borderRadius: '8px',
                        border: 'none',
                        color: 'white',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#D95B14"
                      strokeWidth={2.5}
                      dot={{ fill: '#D95B14', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </LightCard>
          </div>

          {/* Category Breakdown Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#111111]">Detailed Rubric Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(scoreData?.categoryScores || []).map((cat, idx) => (
                <LightCard key={idx} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#111111]">{cat.label}</span>
                    <span className="font-mono font-bold text-[#111111]">{cat.score}/{cat.max}</span>
                  </div>
                  <ProgressIndicator
                    value={(cat.score / cat.max) * 100}
                    variant={cat.score / cat.max >= 0.85 ? 'accent' : 'dark'}
                    showPercentage={false}
                    size="sm"
                  />
                </LightCard>
              ))}
            </div>
          </div>

          {/* 4 Quadrants: Strengths, Weaknesses, Missing Skills, Recommended Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <LightCard className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Strengths</span>
              </div>
              <ul className="text-xs text-[#6B6B6B] space-y-2">
                {(scoreData?.strengths || []).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </LightCard>

            {/* Weaknesses */}
            <LightCard className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Identified Weaknesses</span>
              </div>
              <ul className="text-xs text-[#6B6B6B] space-y-2">
                {(scoreData?.weaknesses || []).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </LightCard>
          </div>

          {/* ATS Keyword Section */}
          <LightCard className="p-6 space-y-4">
            <div className="border-b border-[#E8E8E5] pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#111111]">ATS Recruiter Keyword Analysis</h4>
                <p className="text-xs text-[#6B6B6B]">Matching against Software Engineer (12 LPA) requirements</p>
              </div>
              <Badge variant="neutral" size="sm">
                {(scoreData?.matchedKeywords || []).length} / {
                (scoreData?.matchedKeywords || []).length +
                (scoreData?.missingKeywords || []).length
                } Matched
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-emerald-700 block mb-2">Matched Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {(scoreData?.matchedKeywords || []).map((kw, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-medium text-rose-700 block mb-2">Missing High-Value Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {(scoreData?.missingKeywords || []).map((kw, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                      <X className="w-3 h-3 text-rose-600" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </LightCard>

          {/* Before & After Suggestions */}
          {/* ATS Improvement Suggestions */}
<div className="space-y-4">
  <h3 className="text-base font-semibold text-[#111111]">
    Recommended Improvements
  </h3>

  <div className="space-y-3">
    {(scoreData?.suggestions || []).map((item, index) => (
      <LightCard key={index} className="p-4">
        <p className="text-xs text-[#6B6B6B]">{item}</p>
      </LightCard>
    ))}
  </div>
</div>
          {/* Action Bar */}
          <div className="p-6 rounded-[14px] bg-[#111111] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold">Apply Suggestions to Resume Builder</h4>
              <p className="text-xs text-[#A0A0A0] mt-0.5">Directly incorporate these quantifiable revisions to reach the 90+ score bracket.</p>
            </div>
            <PrimaryButton
              className="bg-white text-[#111111] hover:bg-[#F4F4F1] shrink-0"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/resume')}
            >
              Open Resume Builder
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeScorerPage
