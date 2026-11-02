import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
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
  FileText,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Code2,
  Map,
  Clock,
  Target,
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
  const [dashboardData, setDashboardData] = useState({
    atsScore: null,
    skillGap: null,
    roadmap: null,
    targetRole: null,
  })
  
  const [loading, setLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState('')
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setDashboardError('')
  
        const results = await Promise.allSettled([
          apiRequest('/api/ats/score', {
            method: 'POST',
            body: JSON.stringify({ source: 'pdf' }),
          }),
          apiRequest('/api/skill-gap'),
          apiRequest('/api/roadmap'),
        ])
  
        setDashboardData({
          atsScore: results[0].status === 'fulfilled'
            ? results[0].value.result
            : null,
          skillGap: results[1].status === 'fulfilled'
            ? results[1].value.skillGap
            : null,
          roadmap: results[2].status === 'fulfilled'
            ? results[2].value.roadmap
            : null,
          targetRole: results[1].status === 'fulfilled'
            ? results[1].value.skillGap?.targetRole
            : null,
        })
      } catch (error) {
        setDashboardError(error.message)
      } finally {
        setLoading(false)
      }
    }
  
    fetchDashboardData()
  }, [])

  const userName = user?.name ? user.name.split(' ')[0] : 'there'
  const requiredSkills = dashboardData.skillGap?.requiredSkills || []
  const missingSkills = dashboardData.skillGap?.missingSkills || []
  const matchedSkillCount = Math.max(0, requiredSkills.length - missingSkills.length)
  const skillProgress = requiredSkills.length
    ? Math.round((matchedSkillCount / requiredSkills.length) * 100)
    : 0
  const roadmapSteps = dashboardData.roadmap?.roadmap || []

  const categoryScores = dashboardData.atsScore?.categoryScores || {}
  const READINESS_DATA = [
    { subject: 'Skills', score: categoryScores.skills ?? 0, fullMark: 40 },
    { subject: 'Completeness', score: categoryScores.completeness ?? 0, fullMark: 20 },
    { subject: 'Projects & Experience', score: categoryScores.projectsAndExperience ?? 0, fullMark: 15 },
    { subject: 'Education', score: categoryScores.education ?? 0, fullMark: 10 },
    { subject: 'Certifications', score: categoryScores.certifications ?? 0, fullMark: 10 },
    { subject: 'Readability', score: categoryScores.readability ?? 0, fullMark: 5 },
  ]

  const NEXT_STEPS = (dashboardData.atsScore?.suggestions || []).map((suggestion, index) => ({
    title: index < missingSkills.length ? `Learn ${missingSkills[index]}` : 'Improve Resume',
    desc: suggestion,
    tag: index < missingSkills.length ? 'Skill Gap' : 'ATS Feedback',
    icon: index < missingSkills.length ? Code2 : FileCheck2,
    action: () => navigate(index < missingSkills.length ? '/roadmap' : '/resume/scorer'),
    actionText: index < missingSkills.length ? 'Open Roadmap' : 'Review Resume',
  }))

  if (NEXT_STEPS.length === 0) {
    NEXT_STEPS.push({
      title: 'Build your learning roadmap',
      desc: 'Select a target role and analyze your resume to receive personalized recommendations.',
      tag: 'Get Started',
      icon: Map,
      action: () => navigate('/roadmap'),
      actionText: 'Open Roadmap',
    })
  }

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <PageHeader
        title={`Good morning, ${userName} 👋`}
        subtitle="Here's your placement preparation overview. You are on track for upcoming campus hiring drives."
        badge={
          <Badge variant="accent" dot>
            Readiness: {loading ? '--' : `${skillProgress}%`}
          </Badge>
        }
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

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Placement Readiness */}
        <LightCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Required Skills Matched
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF5EE] text-[#D95B14] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-[#111111]">
              {requiredSkills.length ? `${matchedSkillCount}/${requiredSkills.length}` : '--'}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {requiredSkills.length ? `${skillProgress}% matched` : 'No data yet'}
            </span>
          </div>
          <ProgressIndicator value={skillProgress} variant="accent" showPercentage={false} size="sm" />
          <p className="text-[11px] text-[#6B6B6B]">Based on required skills for your target role</p>
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
            <span className="text-3xl font-bold tracking-tight text-[#111111]">
              {loading
                ? '...'
                : dashboardData.atsScore
                  ? dashboardData.atsScore.totalScore
                  : '--'}
              <span className="text-lg font-normal text-[#8E8E8E]">/100</span>
            </span>
            {dashboardData.atsScore && (
              <Badge variant="success" size="sm">ATS Score</Badge>
            )}
          </div>
          <ProgressIndicator
            value={dashboardData.atsScore?.totalScore || 0}
            variant="dark"
            showPercentage={false}
            size="sm"
          />
          <p className="text-[11px] text-[#6B6B6B]">
            {dashboardData.atsScore
              ? `Target role: ${dashboardData.atsScore.targetRole}`
              : loading
                ? 'Calculating ATS score...'
                : 'Upload a resume to calculate your score'}
          </p>
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
            <span className="text-3xl font-bold tracking-tight text-[#111111]">--<span className="text-lg font-normal text-[#8E8E8E]">/100</span></span>
            <span className="text-xs font-semibold text-[#D95B14]">Not available</span>
          </div>
          <ProgressIndicator value={0} variant="dark" showPercentage={false} size="sm" />
          <p className="text-[11px] text-[#6B6B6B]">Interview results will appear after interview integration</p>
        </LightCard>

        {/* Skills to Improve */}
        <DarkCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A0A0A0]">
              Skills to Improve
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#D95B14]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              {loading ? '...' : missingSkills.length}
            </span>
            <span className="text-xs font-semibold text-[#F6B18A]">
              {missingSkills.length === 1 ? 'skill remaining' : 'skills remaining'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[28px]">
            {loading ? (
              <span className="text-[11px] text-[#A0A0A0]">Loading skill analysis...</span>
            ) : missingSkills.length > 0 ? (
              missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-full bg-white/10 text-[11px] text-white"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-[#A0A0A0]">
                {requiredSkills.length ? 'All required skills matched' : 'Select a target role to analyze skills'}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/roadmap')}
            className="text-[11px] font-semibold text-[#F6B18A] hover:text-white transition-colors"
          >
            View learning roadmap →
          </button>
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
                ATS Score Breakdown
              </span>
              <span className="text-xs text-[#6B6B6B] font-mono">Based on your resume</span>
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
              <span>ATS total: <strong className="text-[#111111]">{dashboardData.atsScore ? `${dashboardData.atsScore.totalScore}/100` : 'Not available'}</strong></span>
              <span>Target: <strong className="text-[#D95B14]">{dashboardData.targetRole || 'Not selected'}</strong></span>
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
                <h3 className="text-2xl font-bold text-white mt-3">
                  {dashboardData.targetRole || 'Choose a target role'}
                </h3>
                <p className="text-xs text-[#A0A0A0] mt-1">Your selected placement target</p>

                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#2A2A28]">
                  <div>
                    <span className="text-[11px] text-[#8E8E8E] block">Target Package</span>
                    <span className="text-xl font-bold text-white">Not set</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8E8E8E] block">Prep Progress</span>
                    <span className="text-xl font-bold text-[#D95B14]">
                      {requiredSkills.length ? `${skillProgress}%` : '--'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2A2A28] text-xs text-[#A0A0A0] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8E8E8E]" />
                  <span>Learning steps: <strong>{roadmapSteps.length || 0} recommended</strong></span>
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

      {/* ── SECTION: SKILL GAP & ROADMAP ── */}
      <section className="space-y-4">
        <SectionHeader
          title="Your Skill Gap & Learning Roadmap"
          description="Skills identified from your resume and learning steps for your selected target role."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LightCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111111]">Skills to Improve</h3>
              <Badge variant="neutral" size="sm">
                {missingSkills.length} missing
              </Badge>
            </div>
            {loading ? (
              <p className="text-xs text-[#6B6B6B]">Loading skill gap...</p>
            ) : missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <Badge key={skill} variant="neutral">{skill}</Badge>
                ))}
              </div>
            ) : dashboardData.skillGap ? (
              <p className="text-xs text-[#6B6B6B]">No missing mandatory skills found for this role.</p>
            ) : (
              <p className="text-xs text-[#6B6B6B]">Skill gap data is not available yet. Select a target role and analyze your resume.</p>
            )}
            {dashboardData.skillGap?.userSkills?.length > 0 && (
              <div className="pt-3 border-t border-[#E8E8E5]">
                <p className="text-xs text-[#6B6B6B] mb-2">Skills detected in your resume</p>
                <div className="flex flex-wrap gap-2">
                  {dashboardData.skillGap.userSkills.map((skill) => (
                    <Badge key={skill} variant="success">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </LightCard>

          <LightCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111111]">Learning Roadmap</h3>
              <Badge variant="neutral" size="sm">
                {roadmapSteps.length} steps
              </Badge>
            </div>
            {loading ? (
              <p className="text-xs text-[#6B6B6B]">Loading roadmap...</p>
            ) : roadmapSteps.length > 0 ? (
              <ol className="space-y-3">
                {roadmapSteps.map((step, index) => (
                  <li key={`${step}-${index}`} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFF5EE] text-[#D95B14] text-xs font-semibold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs text-[#4A4A4A] leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-[#6B6B6B]">Your roadmap will appear after skill gap analysis.</p>
            )}
            <button
              onClick={() => navigate('/roadmap')}
              className="text-xs font-semibold text-[#D95B14] hover:text-[#BF4D0C] inline-flex items-center gap-1.5"
            >
              Open full roadmap <span>→</span>
            </button>
          </LightCard>
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

          <LightCard className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F4F4F1] text-[#111111] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111111]">Activity tracking not connected yet</h4>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Your interview, resume and roadmap activity will appear here once activity history is available from the backend.
                </p>
              </div>
            </div>
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
