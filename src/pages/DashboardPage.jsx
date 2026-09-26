import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageHeader,
  SectionHeader,
  LightCard,
  DarkCard,
  Badge,
  ProgressIndicator,
  PrimaryButton,
} from '../components/common'
import { useUser } from '../context/UserContext'
import {
  Flame,
  Video,
  FileCheck2,
  FileText,
  Sparkles,
  ArrowRight,
  Code2,
  Map,
  Clock,
  CheckCircle2,
  TrendingUp,
  Target,
  Database,
  Users,
} from 'lucide-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

export function DashboardPage() {
  const { user } = useUser()
  const navigate = useNavigate()

  const userName = user?.name ? user.name.split(' ')[0] : 'Sampath'

  const READINESS_DATA = [
    { subject: 'Resume', score: 81, fullMark: 100 },
    { subject: 'DSA', score: 78, fullMark: 100 },
    { subject: 'Core CS', score: 70, fullMark: 100 },
    { subject: 'Communication', score: 84, fullMark: 100 },
    { subject: 'Projects', score: 88, fullMark: 100 },
    { subject: 'Interview', score: 74, fullMark: 100 },
    { subject: 'Problem Solving', score: 76, fullMark: 100 },
  ]

  const NEXT_STEPS = [
    {
      title: 'Improve Resume',
      desc: 'Add quantifiable metrics to your 2 personal projects to increase ATS score to 88+.',
      tag: 'High Impact',
      icon: FileCheck2,
      action: () => navigate('/resume/scorer'),
      actionText: 'Review Suggestions',
    },
    {
      title: 'Practice Technical Interview',
      desc: 'Simulate a 25-minute Trees & Graphs algorithmic round with AI video avatar.',
      tag: 'Simulation',
      icon: Video,
      action: () => navigate('/interview/setup'),
      actionText: 'Start Interview',
    },
    {
      title: 'Complete DSA Arrays',
      desc: '3 remaining sliding window problems in your active Week 4 curriculum.',
      tag: 'Roadmap',
      icon: Code2,
      action: () => navigate('/roadmap'),
      actionText: 'Open Problems',
    },
    {
      title: 'Strengthen SQL',
      desc: 'Practice indexing and multi-table joins expected in SDE-1 interviews.',
      tag: 'Core CS',
      icon: Database,
      action: () => navigate('/roadmap'),
      actionText: 'Study Topic',
    },
    {
      title: 'Practice HR Questions',
      desc: 'Rehearse behavioral STAR answers for conflict resolution and leadership.',
      tag: 'Behavioral',
      icon: Users,
      action: () => navigate('/interview/setup'),
      actionText: 'Practice HR',
    },
  ]

  const RECENT_ACTIVITIES = [
    {
      title: 'Technical interview completed',
      time: 'Yesterday at 4:30 PM',
      score: '82% score',
      desc: 'Frontend Engineer round • Strong component hierarchy',
      icon: Video,
      accent: true,
    },
    {
      title: 'Resume updated & saved',
      time: 'Yesterday at 11:15 AM',
      score: '+13 points',
      desc: 'Integrated quantifiable metrics for NexTech internship',
      icon: FileText,
    },
    {
      title: 'Roadmap module completed',
      time: '3 days ago',
      score: '100% finished',
      desc: 'Completed Arrays & Fast-Slow Pointers',
      icon: CheckCircle2,
    },
    {
      title: 'Resume score improved',
      time: '4 days ago',
      score: '81/100',
      desc: 'ATS scan verified compatibility with SDE-1 specifications',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <PageHeader
        title={`Good morning, ${userName} 👋`}
        subtitle="Here's your placement preparation overview. You are on track for upcoming campus hiring drives."
        badge={<Badge variant="accent" dot>Readiness: 72%</Badge>}
        action={
          <PrimaryButton
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/interview/setup')}
          >
            Continue Preparation
          </PrimaryButton>
        }
      />

      {/* ── CAPSTONE EVALUATION TOUR RIBBON ── */}
      <div className="p-4 rounded-[14px] bg-[#FFF5EE] border border-[#FCD6BF] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D95B14] animate-pulse" />
            <span className="text-xs font-bold text-[#D95B14] uppercase tracking-wider">
              Capstone Demo Mode Active
            </span>
            <span className="text-xs text-[#87360A] hidden sm:inline">•</span>
            <span className="text-xs text-[#87360A] hidden sm:inline">
              Seeded student profile (Sampath Srinivas • 12 LPA SDE Goal)
            </span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-[#D95B14]">
            Offline Ready • Zero API Keys
          </span>
        </div>

        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          <strong>Recommended Evaluation Journey:</strong> Click through the stages below to test the complete placement preparation pipeline.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium">
          <button
            onClick={() => navigate('/')}
            className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E8E8E5] text-[#111111] hover:border-[#D95B14] transition-colors"
          >
            1. Landing Page
          </button>
          <span className="text-[#A0A0A0]">→</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-2.5 py-1 rounded-[6px] bg-[#111111] text-white"
          >
            2. Command Center
          </button>
          <span className="text-[#A0A0A0]">→</span>
          <button
            onClick={() => navigate('/resume')}
            className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E8E8E5] text-[#111111] hover:border-[#D95B14] transition-colors"
          >
            3. Resume Builder
          </button>
          <span className="text-[#A0A0A0]">→</span>
          <button
            onClick={() => navigate('/resume/scorer')}
            className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E8E8E5] text-[#111111] hover:border-[#D95B14] transition-colors"
          >
            4. Resume Scorer
          </button>
          <span className="text-[#A0A0A0]">→</span>
          <button
            onClick={() => navigate('/interview/setup')}
            className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E8E8E5] text-[#111111] hover:border-[#D95B14] transition-colors"
          >
            5. AI Interview Room
          </button>
          <span className="text-[#A0A0A0]">→</span>
          <button
            onClick={() => navigate('/interview/report')}
            className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E8E8E5] text-[#111111] hover:border-[#D95B14] transition-colors"
          >
            6. Diagnostic Report
          </button>
          <span className="text-[#A0A0A0]">→</span>
          <button
            onClick={() => navigate('/roadmap')}
            className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E8E8E5] text-[#111111] hover:border-[#D95B14] transition-colors"
          >
            7. Career Roadmap
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placement Readiness */}
        <LightCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Placement Readiness
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF5EE] text-[#D95B14] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#111111]">72%</span>
            <span className="text-xs font-semibold text-emerald-600">+12% this month</span>
          </div>
          <ProgressIndicator value={72} variant="accent" showPercentage={false} size="sm" />
          <p className="text-[11px] text-[#6B6B6B]">Target: 85% for Tier-1 companies</p>
        </LightCard>

        {/* Resume Score */}
        <LightCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Resume Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F4F1] text-[#111111] flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#111111]">81<span className="text-lg font-normal text-[#8E8E8E]">/100</span></span>
            <Badge variant="success" size="sm">Strong ATS</Badge>
          </div>
          <ProgressIndicator value={81} variant="dark" showPercentage={false} size="sm" />
          <p className="text-[11px] text-[#6B6B6B]">Top 15th percentile of applicants</p>
        </LightCard>

        {/* Interview Score */}
        <LightCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Interview Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F4F1] text-[#111111] flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#111111]">74<span className="text-lg font-normal text-[#8E8E8E]">/100</span></span>
            <span className="text-xs font-semibold text-[#D95B14]">6 Sessions</span>
          </div>
          <ProgressIndicator value={74} variant="dark" showPercentage={false} size="sm" />
          <p className="text-[11px] text-[#6B6B6B]">Average across Tech, DSA & HR</p>
        </LightCard>

        {/* Skills Completed */}
        <DarkCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A0A0A0]">
              Skills Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#D95B14]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">18<span className="text-lg font-normal text-[#8E8E8E]">/25</span></span>
            <Badge variant="accent" size="sm">72% Done</Badge>
          </div>
          <ProgressIndicator value={72} variant="accent" showPercentage={false} size="sm" />
          <p className="text-[11px] text-[#8E8E8E]">7 competencies remaining</p>
        </DarkCard>
      </div>

      {/* ── SECTION: YOUR PLACEMENT READINESS (RECHARTS RADAR) ── */}
      <section className="space-y-4">
        <SectionHeader
          title="Your Placement Readiness"
          description="Multidimensional competency evaluation mapped across key hiring disciplines."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Radar Chart */}
          <LightCard className="lg:col-span-7 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3 mb-2">
              <span className="text-xs font-semibold text-[#111111]">
                Competency Radar (7-Factor Diagnostic)
              </span>
              <span className="text-xs text-[#6B6B6B] font-mono">Calibrated to 12 LPA SDE</span>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={READINESS_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#E8E8E5" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#4A4A4A', fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#8E8E8E', fontSize: 10 }}
                  />
                  <Radar
                    name="Student Score"
                    dataKey="score"
                    stroke="#D95B14"
                    fill="#D95B14"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-[#E8E8E5] flex items-center justify-between text-xs text-[#6B6B6B]">
              <span>Strongest: <strong className="text-[#111111]">Projects (88%)</strong></span>
              <span>Needs Focus: <strong className="text-[#D95B14]">Core CS (70%)</strong></span>
            </div>
          </LightCard>

          {/* Goal & Target Package Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <DarkCard className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="accent" size="sm" dot>Current Goal</Badge>
                  <Target className="w-4 h-4 text-[#D95B14]" />
                </div>
                <h3 className="text-2xl font-bold text-white mt-3">Software Engineer</h3>
                <p className="text-xs text-[#A0A0A0] mt-1">Tier-1 Product & FinTech Placement</p>

                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#2A2A28]">
                  <div>
                    <span className="text-[11px] text-[#8E8E8E] block">Target Package</span>
                    <span className="text-xl font-bold text-white">12 LPA</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8E8E8E] block">Prep Progress</span>
                    <span className="text-xl font-bold text-[#D95B14]">72%</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2A2A28] text-xs text-[#A0A0A0] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8E8E8E]" />
                  <span>Expected Remaining: <strong>5 weeks of focused prep</strong></span>
                </div>
              </div>

              <div className="mt-6">
                <PrimaryButton
                  className="w-full bg-white text-[#111111] hover:bg-[#F4F4F1]"
                  onClick={() => navigate('/roadmap')}
                >
                  View Active Roadmap
                </PrimaryButton>
              </div>
            </DarkCard>
          </div>
        </div>
      </section>

      {/* ── SECTION: RECOMMENDED NEXT STEPS ── */}
      <section className="space-y-4">
        <SectionHeader
          title="Recommended Next Steps"
          description="High-leverage tasks prioritized by algorithmic impact on your placement probability."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEXT_STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <LightCard
                key={idx}
                hoverable
                className="p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-center text-[#111111]">
                      <Icon className="w-4 h-4 text-[#D95B14]" />
                    </div>
                    <Badge variant="neutral" size="sm">{step.tag}</Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-[#111111]">{step.title}</h4>
                  <p className="text-xs text-[#6B6B6B] mt-1.5 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E8E5]">
                  <button
                    onClick={step.action}
                    className="text-xs font-semibold text-[#D95B14] hover:text-[#BF4D0C] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>{step.actionText}</span>
                    <span>→</span>
                  </button>
                </div>
              </LightCard>
            )
          })}
        </div>
      </section>

      {/* ── SECTION: RECENT ACTIVITY & QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-4">
          <SectionHeader
            title="Recent Activity"
            description="Your latest interview simulations, scans, and roadmap milestones."
          />

          <LightCard className="p-0 overflow-hidden divide-y divide-[#E8E8E5]">
            {RECENT_ACTIVITIES.map((act, idx) => {
              const Icon = act.icon
              return (
                <div key={idx} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-[#FAFAF9] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      act.accent ? 'bg-[#FFF5EE] text-[#D95B14]' : 'bg-[#F4F4F1] text-[#111111]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#111111]">{act.title}</h4>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{act.desc}</p>
                      <span className="text-[11px] text-[#8E8E8A] mt-1 block">{act.time}</span>
                    </div>
                  </div>
                  <Badge variant={act.accent ? 'accent' : 'neutral'} size="sm">
                    {act.score}
                  </Badge>
                </div>
              )
            })}
          </LightCard>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <SectionHeader
            title="Quick Actions"
            description="Launch core placement tools."
          />

          <div className="space-y-3">
            <LightCard
              hoverable
              onClick={() => navigate('/resume')}
              className="p-4 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-center text-[#111111]">
                  <FileText className="w-4 h-4 text-[#D95B14]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#111111]">Build Resume</h4>
                  <p className="text-[11px] text-[#6B6B6B]">Edit 9 ATS sections</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8E8E8A]" />
            </LightCard>

            <LightCard
              hoverable
              onClick={() => navigate('/resume/scorer')}
              className="p-4 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-center text-[#111111]">
                  <FileCheck2 className="w-4 h-4 text-[#D95B14]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#111111]">Score Resume</h4>
                  <p className="text-[11px] text-[#6B6B6B]">Instant ATS scan</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8E8E8A]" />
            </LightCard>

            <LightCard
              hoverable
              onClick={() => navigate('/interview/setup')}
              className="p-4 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-center text-[#111111]">
                  <Video className="w-4 h-4 text-[#D95B14]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#111111]">Start Interview</h4>
                  <p className="text-[11px] text-[#6B6B6B]">Tech, coding or HR</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8E8E8A]" />
            </LightCard>

            <LightCard
              hoverable
              onClick={() => navigate('/roadmap')}
              className="p-4 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-center text-[#111111]">
                  <Map className="w-4 h-4 text-[#D95B14]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#111111]">Generate Roadmap</h4>
                  <p className="text-[11px] text-[#6B6B6B]">Curate 10–40 LPA plan</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8E8E8A]" />
            </LightCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
