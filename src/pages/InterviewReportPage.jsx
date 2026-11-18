import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  PageHeader,
  LightCard,
  DarkCard,
  Badge,
  PrimaryButton,
  SecondaryButton,
} from '../components/common'
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertCircle,
  Map,
  FileText,
  RotateCcw,
} from 'lucide-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useToast } from '../context/ToastContext'
import { apiRequest } from '../services/api'

export function InterviewReportPage() {
  const navigate = useNavigate()
const location = useLocation()
const toast = useToast()

const [interview, setInterview] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  const fetchInterview = async () => {
    const interviewId = location.state?.interviewId

    if (!interviewId) {
      setError('Interview ID not found. Please complete an interview first.')
      setLoading(false)
      return
    }

    try {
      const data = await apiRequest(`/api/interviews/${interviewId}`)
      setInterview(data.interview)
    } catch (err) {
      setError(err.message || 'Failed to load interview report')
    } finally {
      setLoading(false)
    }
  }

  fetchInterview()
}, [location.state])

  const [animatedScore, setAnimatedScore] = useState(0)
  const evaluatedAnswers = interview?.answers?.filter(
    (answer) => answer.evaluation && typeof answer.evaluation.score === 'number'
  ) || []
  
  
const totalQuestionCount = interview?.questions?.length || 0

const targetScore = totalQuestionCount > 0
  ? Math.round(
      (
        evaluatedAnswers.reduce(
          (total, answer) => total + answer.evaluation.score,
          0
        ) / totalQuestionCount
      ) * 10
    )
  : 0


  useEffect(() => {
    let start = 0
    const timer = setInterval(() => {
      start += 2
      if (start >= targetScore) {
        setAnimatedScore(targetScore)
        clearInterval(timer)
      } else {
        setAnimatedScore(start)
      }
    }, 25)
    return () => clearInterval(timer)
  }, [targetScore])

  // 8 Dimensions specified in prompt
  
const QUESTION_ANALYSIS = (interview?.questions || []).map((question, index) => {
  const answer = interview?.answers?.find(
    (item) => item.questionId === question.questionId
  )

  return {
    qNum: index + 1,
    question: question.question,
    userAnswer: answer
      ? answer.answer || answer.code || 'No answer submitted'
      : 'No answer submitted',
    score: answer?.evaluation
      ? Math.round(answer.evaluation.score * 10)
      : 0,
    whatWentWell:
      answer?.evaluation?.strengths?.join(' ') ||
      answer?.evaluation?.feedback ||
      'No feedback available',
    whatCouldImprove:
      answer?.evaluation?.improvements?.join(' ') ||
      'No improvement suggestions available',
    idealAnswer:
      answer?.evaluation?.idealAnswer ||
      'No ideal answer available',
  }
})

  
  const RADAR_DATA = QUESTION_ANALYSIS.map((qa) => ({
    metric: `Q${qa.qNum}`,
    score: qa.score,
    fullMark: 100,
  }))
  const strengths = [
    ...new Set(
      evaluatedAnswers.flatMap(
        (answer) => answer.evaluation?.strengths || []
      )
    ),
  ]
  
  const improvements = [
    ...new Set(
      evaluatedAnswers.flatMap(
        (answer) => answer.evaluation?.improvements || []
      )
    ),
  ]
  const highestQuestion = [...QUESTION_ANALYSIS].sort(
    (a, b) => b.score - a.score
  )[0]
  
  const lowestQuestion = [...QUESTION_ANALYSIS].sort(
    (a, b) => a.score - b.score
  )[0]
  const aiFeedback = evaluatedAnswers
  .map((answer) => answer.evaluation?.feedback)
  .filter(Boolean)

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading your AI interview report...
      </div>
    )
  }
  
  if (error || !interview) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">{error || 'Interview report not found'}</p>
        <button
          onClick={() => navigate('/interview')}
          className="mt-4 px-4 py-2 rounded-lg bg-black text-white"
        >
          Back to Interview Studio
        </button>
      </div>
    )
  }
  
  return (
      <div className="space-y-8 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <PageHeader
        title="Interview Completed"
        subtitle="AI-generated comprehensive performance diagnostic and hiring rubric evaluation."
        breadcrumbs={['Preparation', 'AI Interviews', 'Diagnostic Report']}
        badge={<Badge variant="success" dot>Graded</Badge>}
        action={
          <div className="flex items-center gap-2">
            <SecondaryButton
              icon={ArrowLeft}
              onClick={() => navigate('/interview')}
            >
              Back to Studio
            </SecondaryButton>
            <PrimaryButton
              icon={Download}
              onClick={() => {
                window.print()
                toast.show('Downloading report summary...', { type: 'success' })
              }}
            >
              Download PDF
            </PrimaryButton>
          </div>
        }
      />

      {/* ── TOP SCORE & 8-DIMENSION RADAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Animated Overall Score */}
        <DarkCard className="lg:col-span-5 p-8 flex flex-col justify-between">
          <div>
            <Badge variant="accent" size="sm" dot>Performance Rubric</Badge>
            <div className="mt-6">
              <span className="text-7xl font-bold tracking-tight text-white tabular-nums">
                {animatedScore}
              </span>
              <span className="text-2xl text-[#8E8E8E]">/100</span>
            </div>
            <h3 className="text-lg font-semibold text-emerald-400 mt-3">
  Verdict: {
    targetScore >= 85
      ? 'Excellent Performance'
      : targetScore >= 70
      ? 'Strong Performance'
      : targetScore >= 50
      ? 'Needs Improvement'
      : 'More Practice Needed'
  }
</h3>
<p className="text-xs text-[#A0A0A0] mt-1.5 leading-relaxed">
  Your performance is based on AI evaluation of your submitted interview answers.
  Review the feedback and improvement areas to prepare for your next interview.
</p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#2A2A28] flex items-center justify-between text-xs text-[#8E8E8E]">
          <span>
  Interview Type: <strong>{interview.interviewType?.toUpperCase()}</strong>
</span>
<span>
  Target Role: <strong>{interview.targetRole}</strong>
</span>
          </div>
        </DarkCard>

        {/* 8-Dimension Radar Chart */}
        <LightCard className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3 mb-2">
            <h4 className="text-xs font-semibold text-[#111111]">
              8-Dimension Competency Radar
            </h4>
            <span className="text-xs text-[#6B6B6B] font-mono">Calibrated Evaluation</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#E8E8E5" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: '#333333', fontSize: 10, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#8E8E8E', fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#D95B14"
                  fill="#D95B14"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[#E8E8E5] flex items-center justify-between text-xs text-[#6B6B6B]">
  <span>
    Highest: <strong className="text-[#111111]">
      {highestQuestion
        ? `Q${highestQuestion.qNum} (${highestQuestion.score})`
        : 'N/A'}
    </strong>
  </span>

  <span>
    Focus Area: <strong className="text-[#D95B14]">
      {lowestQuestion
        ? `Q${lowestQuestion.qNum} (${lowestQuestion.score})`
        : 'N/A'}
    </strong>
  </span>
</div>
        </LightCard>
      </div>

      {/* ── SECTION 1 & 2 & 3: OVERALL, STRENGTHS & AREAS TO IMPROVE ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <LightCard className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>2. Verified Strengths</span>
          </div>
          <ul className="text-xs text-[#6B6B6B] space-y-2">
  {strengths.length > 0 ? (
    strengths.map((item, index) => (
      <li key={index} className="flex items-start gap-2">
        <span className="text-emerald-600 font-bold">•</span>
        <span>{item}</span>
      </li>
    ))
  ) : (
    <li>No strengths available yet.</li>
  )}
</ul>
        </LightCard>

        {/* Areas to Improve */}
        <LightCard className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D95B14]">
            <AlertCircle className="w-4 h-4 text-[#D95B14]" />
            <span>3. Areas to Improve</span>
          </div>
          <ul className="text-xs text-[#6B6B6B] space-y-2">
  {improvements.length > 0 ? (
    improvements.map((item, index) => (
      <li key={index} className="flex items-start gap-2">
        <span className="text-[#D95B14] font-bold">•</span>
        <span>{item}</span>
      </li>
    ))
  ) : (
    <li>No improvement suggestions available yet.</li>
  )}
</ul>
        </LightCard>
      </div>

      {/* ── SECTION 4: QUESTION-BY-QUESTION ANALYSIS ── */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-[#111111]">
          4. Question-by-Question Deep Dive
        </h3>

        <div className="space-y-4">
          {QUESTION_ANALYSIS.map((qa) => (
            <LightCard key={qa.qNum} className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-[#E8E8E5] pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D95B14]">
                    Question 0{qa.qNum}
                  </span>
                  <h4 className="text-sm font-semibold text-[#111111] mt-0.5">
                    {qa.question}
                  </h4>
                </div>
                <Badge variant={qa.score >= 80 ? 'accent' : 'neutral'} size="md">
                  Score: {qa.score} / 100
                </Badge>
              </div>

              {/* Candidate Answer */}
              <div>
                <span className="text-xs font-semibold text-[#111111] block mb-1">
                  Your Answer:
                </span>
                <p className="text-xs text-[#6B6B6B] p-3 rounded-[8px] bg-[#FAFAF9] border border-[#E8E8E5] leading-relaxed">
                  "{qa.userAnswer}"
                </p>
              </div>

              {/* Rubric Feedback */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-[8px] bg-emerald-50/60 border border-emerald-200">
                  <span className="font-semibold text-emerald-800 block mb-0.5">✓ What went well:</span>
                  <p className="text-emerald-900">{qa.whatWentWell}</p>
                </div>
                <div className="p-3 rounded-[8px] bg-[#FFF5EE] border border-[#FCD6BF]">
                  <span className="font-semibold text-[#D95B14] block mb-0.5">△ What could improve:</span>
                  <p className="text-[#87360A]">{qa.whatCouldImprove}</p>
                </div>
              </div>

              
{/* Ideal Answer */}
<div className="p-4 rounded-[8px] bg-[#111111] text-white text-xs">
  <span className="font-semibold text-[#D95B14] block mb-3">
    Benchmark Ideal Answer:
  </span>

  <div className="text-zinc-300 leading-relaxed
    [&_p]:mb-2
    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2
    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2
    [&_li]:mb-1
    [&_strong]:text-white
    [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white
    [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold
    [&_code]:text-emerald-300
    [&_code]:bg-[#292929]
    [&_code]:px-1 [&_code]:rounded">

    <ReactMarkdown
      components={{
        pre({ children }) {
          return (
            <pre className="my-3 p-3 overflow-x-auto rounded-lg bg-[#242424] border border-[#444] text-emerald-300 text-xs">
              {children}
            </pre>
          )
        },
        code({ children, className }) {
          return (
            <code className={`${className || ''} font-mono`}>
              {children}
            </code>
          )
        }
      }}
    >
      {qa.idealAnswer}
    </ReactMarkdown>
  </div>
</div>

            </LightCard>
          ))}
        </div>
      </section>

      {/* ── SECTION 5 & 6 & 7: AI FEEDBACK, PRACTICE, NEXT STEPS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LightCard className="p-5 space-y-2">
          <Badge variant="neutral" size="sm">Section 5</Badge>
          <h4 className="text-sm font-semibold text-[#111111]">AI Evaluator Feedback</h4>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
  {aiFeedback.length > 0
    ? aiFeedback.join(' ')
    : 'No AI feedback available yet.'}
</p>
        </LightCard>

        <LightCard className="p-5 space-y-2">
          <Badge variant="accent" size="sm">Section 6</Badge>
          <h4 className="text-sm font-semibold text-[#111111]">Recommended Practice</h4>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
  {improvements.length > 0
    ? improvements.join(' ')
    : 'Keep practising to improve your interview performance.'}
</p>
        </LightCard>

        <DarkCard className="p-5 space-y-2">
          <Badge variant="dark" size="sm">Section 7</Badge>
          <h4 className="text-sm font-semibold text-white">Target Next Steps</h4>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
  {improvements.length > 0
    ? `Focus on these areas before your next interview: ${improvements.slice(0, 3).join(' ')}`
    : 'Continue practising and attempt another mock interview to track your progress.'}
</p>
        </DarkCard>
      </div>

      {/* ── SCORE PROGRESSION HISTORY ── */}
      <LightCard className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
          <div>
          <h4 className="text-sm font-semibold text-[#111111]">
  Question-wise Score Analysis
</h4>
<p className="text-xs text-[#6B6B6B]">
  Your actual AI evaluation scores for each question
</p>
          </div>
          <Badge variant="success" size="sm">
  {evaluatedAnswers.length} Answers Evaluated
</Badge>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
          <LineChart
  data={QUESTION_ANALYSIS.map((qa) => ({
    session: `Q${qa.qNum}`,
    score: qa.score,
  }))}
  margin={{ top: 10, right: 20, bottom: 0, left: -20 }}
>
              <CartesianGrid stroke="#E8E8E5" strokeDasharray="3 3" />
              <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#6B6B6B' }} />
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

      {/* ── CTA BUTTONS (EXACTLY AS SPECIFIED IN PROMPT) ── */}
      <div className="p-6 rounded-[16px] bg-[#FAFAF9] border border-[#E8E8E5] flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton
          onClick={() => navigate('/interview/setup')}
          icon={RotateCcw}
        >
          Practice Again
        </PrimaryButton>

        <SecondaryButton
          onClick={() => navigate('/roadmap')}
          icon={Map}
        >
          View Roadmap
        </SecondaryButton>

        <SecondaryButton
          onClick={() => navigate('/resume')}
          icon={FileText}
        >
          Improve Resume
        </SecondaryButton>

        <SecondaryButton
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </SecondaryButton>
      </div>
    </div>
  )
}

export default InterviewReportPage
