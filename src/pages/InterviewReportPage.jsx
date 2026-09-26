import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

export function InterviewReportPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [animatedScore, setAnimatedScore] = useState(0)
  const targetScore = 78

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
  }, [])

  // 8 Dimensions specified in prompt
  const RADAR_DATA = [
    { metric: 'Correctness', score: 82, fullMark: 100 },
    { metric: 'Communication', score: 76, fullMark: 100 },
    { metric: 'Clarity', score: 80, fullMark: 100 },
    { metric: 'Problem Solving', score: 84, fullMark: 100 },
    { metric: 'Technical Knowledge', score: 79, fullMark: 100 },
    { metric: 'Relevance', score: 85, fullMark: 100 },
    { metric: 'Efficiency', score: 72, fullMark: 100 },
    { metric: 'Confidence', score: 75, fullMark: 100 },
  ]

  const SCORE_HISTORY = [
    { session: 'Session 1', score: 62 },
    { session: 'Session 2', score: 68 },
    { session: 'Session 3', score: 71 },
    { session: 'Session 4', score: 74 },
    { session: 'Today (Session 5)', score: 78 },
  ]

  const QUESTION_ANALYSIS = [
    {
      qNum: 1,
      question: 'Explain the internal diffing algorithm of React Virtual DOM, and how unique keys prevent unnecessary DOM node recreations.',
      userAnswer: 'React relies on Virtual DOM trees. When state changes, it compares the new tree with the previous one. Keys help identify which items changed, were added, or were removed.',
      score: 84,
      whatWentWell: 'Accurately articulated the tree diffing intuition and role of keys in item reconciliation.',
      whatCouldImprove: 'Could explicitly mention the O(n) heuristic assumption and avoiding index keys in dynamic lists.',
      idealAnswer: 'React assumes elements of different types produce different subtrees and uses persistent keys to uniquely identity child nodes across renders, maintaining O(n) linear tree comparison.',
    },
    {
      qNum: 2,
      question: 'Given an array prices where prices[i] is the price on day i, maximize profit from one transaction.',
      userAnswer: 'Used a single pass maintaining the running minimum price and calculating maximum profit at each step.',
      score: 86,
      whatWentWell: 'Optimal O(n) time and O(1) space complexity solution implemented in Monaco editor without bugs.',
      whatCouldImprove: 'Could walk through empty array and monotonic decreasing array edge cases during explanation.',
      idealAnswer: 'Track minimum price so far and running maxProfit in a single iteration through the array in O(n) time.',
    },
    {
      qNum: 3,
      question: 'Describe how an index works in relational databases. Why can having too many indexes degrade write performance?',
      score: 72,
      userAnswer: 'Indexes make searches faster like a book index. Too many indexes make updates slower because you have to update the indexes too.',
      whatWentWell: 'Correctly understood the fundamental read-versus-write trade-off.',
      whatCouldImprove: 'Deeper structural terminology needed: mention B-Trees, disk pages, and index rebalancing overhead.',
      idealAnswer: 'Indexes maintain balanced B-Trees pointing to row pointers. While reading is O(log n), each write requires updating all secondary index trees, incurring significant disk I/O.',
    },
  ]

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
              Verdict: Strong SDE-1 Contender
            </h3>
            <p className="text-xs text-[#A0A0A0] mt-1.5 leading-relaxed">
              Your overall problem solving and communication exceeded the campus hiring benchmark (70). Focusing on database internal complexity will help reach top-tier thresholds.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#2A2A28] flex items-center justify-between text-xs text-[#8E8E8E]">
            <span>Candidate: <strong>Sampath Srinivas</strong></span>
            <span>Target: <strong>12 LPA SDE</strong></span>
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
            <span>Highest: <strong className="text-[#111111]">Relevance (85)</strong></span>
            <span>Focus Area: <strong className="text-[#D95B14]">Efficiency (72)</strong></span>
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
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Optimal Algorithmic Intuition:</strong> Successfully coded O(n) single-pass solutions without regression.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Structured Delivery:</strong> Used logical step-by-step narration while explaining Virtual DOM diffing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Relevance:</strong> Addressed specific question prompts directly without rambling.</span>
            </li>
          </ul>
        </LightCard>

        {/* Areas to Improve */}
        <LightCard className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D95B14]">
            <AlertCircle className="w-4 h-4 text-[#D95B14]" />
            <span>3. Areas to Improve</span>
          </div>
          <ul className="text-xs text-[#6B6B6B] space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#D95B14] font-bold">•</span>
              <span><strong>Core CS Terminology:</strong> Explain database internals using formal concepts (B-Tree splits, write amplification).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D95B14] font-bold">•</span>
              <span><strong>Edge Case Verification:</strong> Proactively dry-run null/empty array inputs before announcing completion.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D95B14] font-bold">•</span>
              <span><strong>Time Complexity Justification:</strong> State exact Big-O space and time complexity upfront.</span>
            </li>
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
              <div className="p-3 rounded-[8px] bg-[#111111] text-white text-xs">
                <span className="font-semibold text-[#D95B14] block mb-1">Benchmark Ideal Answer:</span>
                <p className="text-zinc-300 leading-relaxed">{qa.idealAnswer}</p>
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
            Strong executive presence and clear confidence. You handle algorithmic questions with high composure; your primary differentiator will be demonstrating deeper Low-Level Design knowledge.
          </p>
        </LightCard>

        <LightCard className="p-5 space-y-2">
          <Badge variant="accent" size="sm">Section 6</Badge>
          <h4 className="text-sm font-semibold text-[#111111]">Recommended Practice</h4>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Practice 5 DBMS index-tuning problems and review B-Tree balancing. Run another 20-minute simulation round focusing specifically on System Design fundamentals.
          </p>
        </LightCard>

        <DarkCard className="p-5 space-y-2">
          <Badge variant="dark" size="sm">Section 7</Badge>
          <h4 className="text-sm font-semibold text-white">Target Next Steps</h4>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Complete the active Week 4 Dynamic Programming checklist and synchronize your updated resume metrics before your next scheduled mock interview.
          </p>
        </DarkCard>
      </div>

      {/* ── SCORE PROGRESSION HISTORY ── */}
      <LightCard className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
          <div>
            <h4 className="text-sm font-semibold text-[#111111]">Session-over-Session Progression</h4>
            <p className="text-xs text-[#6B6B6B]">Tracking score growth from first baseline simulation</p>
          </div>
          <Badge variant="success" size="sm">+16 pts total growth</Badge>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SCORE_HISTORY} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
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
