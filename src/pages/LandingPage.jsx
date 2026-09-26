import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PrimaryButton,
  SecondaryButton,
  LightCard,
  DarkCard,
  FeatureCard,
  Badge,
} from '../components/common'
import BrandLogo from '../components/common/BrandLogo'
import AuthModal from '../components/common/AuthModal'
import {
  ArrowRight,
  Flame,
  FileCheck2,
  FileText,
  Map,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  Video,
} from 'lucide-react'

export function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState('login')
  const [openFaq, setOpenFaq] = useState(0)
  const navigate = useNavigate()

  const openAuth = (tab = 'login') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }

  const FAQS = [
    {
      q: 'How does Placement Forge AI differ from generic chat tools?',
      a: 'Placement Forge AI is not a conversational gimmick. It is a purpose-built preparation command center combining speech-to-text live interview simulations, ATS deterministic resume parsing, and package-tiered roadmaps (10–40 LPA) calibrated specifically for campus placements.',
    },
    {
      q: 'Can I practice live coding and algorithmic problems?',
      a: 'Yes. The technical interview studio integrates a Monaco code editor with language support for JavaScript, Python, C++, and Java, coupled with automated test cases and algorithmic complexity checks.',
    },
    {
      q: 'How does the Resume Scorer evaluate my ATS compatibility?',
      a: 'It scans for recruiter keyword density, quantifier metrics (such as % latency reductions or scale numbers), standardized chronological sections, and missing engineering proficiencies demanded by top-tier tech recruiters.',
    },
    {
      q: 'Are the roadmaps customized to target compensation packages?',
      a: 'Each roadmap adapts to your chosen bracket—from 6 LPA foundational roles to 40+ LPA product tier companies—adjusting the depth of System Design, Dynamic Programming, and Low-Level Design accordingly.',
    },
    {
      q: 'Do I need a credit card or payment setup for the demo?',
      a: 'No. Placement Forge AI runs completely client-side in preview mode with 3,590 complimentary Forge Credits preloaded for full feature testing.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111111] flex flex-col font-sans">
      {/* ── NAVBAR ── */}
      <nav className="h-16 px-4 sm:px-8 border-b border-[#E8E8E5] bg-[#FAFAF9]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <BrandLogo size="md" />

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-[#6B6B6B]">
          <a href="#features" className="hover:text-[#111111] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#111111] transition-colors">
            How it works
          </a>
          <a href="#analytics" className="hover:text-[#111111] transition-colors">
            Readiness
          </a>
          <a href="#faq" className="hover:text-[#111111] transition-colors">
            FAQ
          </a>
          <Link to="/billing" className="hover:text-[#111111] transition-colors">
            Pricing
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openAuth('login')}
            className="text-xs font-medium text-[#6B6B6B] hover:text-[#111111] px-3 py-1.5 transition-colors"
          >
            Login
          </button>
          <PrimaryButton
            size="sm"
            onClick={() => openAuth('register')}
            className="shadow-subtle"
          >
            Get Started
          </PrimaryButton>
        </div>
      </nav>

      {/* ── 1. HERO SECTION ── */}
      <section className="px-4 sm:px-8 pt-16 sm:pt-24 pb-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="accent" dot>
            Placement Forge AI • Ready for 2026 Season
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.12]">
          Forge Your Path.
          <br />
          Crack Your Placement.
        </h1>

        <p className="text-base sm:text-lg text-[#6B6B6B] mt-6 max-w-2xl mx-auto leading-relaxed">
          An AI-powered placement command center that helps students build stronger resumes, practice interviews, identify skill gaps, and create a personalized preparation roadmap.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => openAuth('register')}
          >
            Start Preparing
          </PrimaryButton>
          <a href="#features">
            <SecondaryButton size="lg">
              Explore Features
            </SecondaryButton>
          </a>
        </div>

        {/* Product Statement Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#6B6B6B]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#D95B14]" />
            Zero AI generic fluff
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#D95B14]" />
            Real Monaco coding + speech recognition
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#D95B14]" />
            Curated 10–40 LPA Curricula
          </span>
        </div>

        {/* Product Preview Mockup */}
        <div className="mt-14 rounded-[20px] bg-white border border-[#E8E8E5] shadow-modal overflow-hidden p-3 sm:p-6 text-left">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-4 mb-6 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E8E8E5]" />
              <span className="w-3 h-3 rounded-full bg-[#E8E8E5]" />
              <span className="w-3 h-3 rounded-full bg-[#E8E8E5]" />
              <span className="ml-3 text-xs font-mono text-[#8E8E8E]">
                placement-forge.app/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm" dot>Live Simulation</Badge>
              <Link to="/dashboard">
                <span className="text-xs font-semibold text-[#D95B14] hover:underline">Launch →</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LightCard className="p-5">
              <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-2">
                <span className="font-semibold text-[#111111]">Placement Readiness</span>
                <Flame className="w-4 h-4 text-[#D95B14]" />
              </div>
              <p className="text-3xl font-bold text-[#111111]">72%</p>
              <div className="mt-3 w-full bg-[#E8E8E5] h-2 rounded-full overflow-hidden">
                <div className="bg-[#D95B14] h-full w-[72%] rounded-full" />
              </div>
              <p className="text-xs text-[#6B6B6B] mt-2">Next milestone: Tree Traversals</p>
            </LightCard>

            <LightCard className="p-5">
              <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-2">
                <span className="font-semibold text-[#111111]">ATS Resume Quality</span>
                <FileCheck2 className="w-4 h-4 text-[#111111]" />
              </div>
              <p className="text-3xl font-bold text-[#111111]">81 / 100</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">High ATS compatibility</p>
              <p className="text-xs text-[#6B6B6B] mt-2">3 suggestions ready to apply</p>
            </LightCard>

            <DarkCard className="p-5">
              <div className="flex items-center justify-between text-xs text-[#8E8E8E] mb-2">
                <span className="font-semibold text-white">Active Goal</span>
                <Sparkles className="w-4 h-4 text-[#D95B14]" />
              </div>
              <p className="text-2xl font-bold text-white">12 LPA SDE</p>
              <p className="text-xs text-[#A0A0A0] mt-1">Target Role: Software Engineer</p>
              <p className="text-xs text-[#D95B14] mt-2 font-medium">Week 4: Graphs & DP</p>
            </DarkCard>
          </div>
        </div>
      </section>

      {/* ── 2. WHY PLACEMENT FORGE AI ── */}
      <section className="px-4 sm:px-8 py-20 bg-[#F4F4F1] border-y border-[#E8E8E5]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Why Placement Forge AI?
            </h2>
            <p className="text-sm text-[#6B6B6B] mt-2">
              Most preparation tools give generic advice. Placement Forge AI gives you a disciplined, measured system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LightCard className="p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">The Problem with Generic SaaS</p>
              <h3 className="text-base font-semibold text-[#111111]">Fragmented, unmeasured preparation</h3>
              <ul className="space-y-2.5 text-xs text-[#6B6B6B]">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  Disconnected LeetCode sheets without interview communication practice
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  Resumes rejected by ATS filters before any recruiter ever reads them
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  Gimmicky AI chatbots that lack timed coding editors or speech analysis
                </li>
              </ul>
            </LightCard>

            <DarkCard className="p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#D95B14]">The Placement Forge Method</p>
              <h3 className="text-base font-semibold text-white">An integrated placement command center</h3>
              <ul className="space-y-2.5 text-xs text-[#A0A0A0]">
                <li className="flex items-start gap-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#D95B14] shrink-0" />
                  Deterministic Readiness Index calculated across DSA, System Design, and Communication
                </li>
                <li className="flex items-start gap-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#D95B14] shrink-0" />
                  Live video avatar simulations with real-time speech-to-text transcription
                </li>
                <li className="flex items-start gap-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#D95B14] shrink-0" />
                  Package-calibrated roadmaps so you prepare for the exact hiring tier you want
                </li>
              </ul>
            </DarkCard>
          </div>
        </div>
      </section>

      {/* ── 3. CORE AI CAPABILITIES ── */}
      <section id="features" className="px-4 sm:px-8 py-20 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="neutral" size="sm" className="mb-3">Command Modules</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Six integrated capabilities. One platform.
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Everything you need from your first resume draft to the final HR interview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={FileText}
            title="Resume Builder"
            description="9-section structured editor with live ATS-tested templates, instant completeness scores, and PDF export."
            badgeText="Module 01"
            actionText="Build Resume"
            onAction={() => navigate('/resume')}
          />
          <FeatureCard
            icon={FileCheck2}
            title="Resume Scorer"
            description="Diagnostic scan that checks formatting, keyword density, and quantifiable impact metrics against job criteria."
            badgeText="Module 02"
            actionText="Score Resume"
            onAction={() => navigate('/resume/scorer')}
          />
          <FeatureCard
            icon={Video}
            title="AI Interview"
            description="Technical, coding, and behavioral interview simulations with video avatars, timers, and Monaco editor."
            badgeText="Module 03"
            actionText="Start Simulation"
            onAction={() => navigate('/interview')}
          />
          <FeatureCard
            icon={BarChart3}
            title="Interview Analytics"
            description="8-dimension diagnostic radar charts, question-by-question ideal answers, and growth tracking."
            badgeText="Module 04"
            actionText="View Reports"
            onAction={() => navigate('/interview/report')}
          />
          <FeatureCard
            icon={Map}
            title="Career Roadmap"
            description="Curated 11-module weekly curricula aligned to 6–20+ LPA brackets with interactive progress checklists."
            badgeText="Module 05"
            actionText="View Roadmap"
            onAction={() => navigate('/roadmap')}
          />
          <FeatureCard
            icon={LayoutDashboard}
            title="Placement Dashboard"
            description="Your unified command center tracking placement readiness, active goals, and recommended daily actions."
            badgeText="Module 06"
            actionText="Open Dashboard"
            onAction={() => navigate('/dashboard')}
          />
        </div>
      </section>

      {/* ── 4. RESUME INTELLIGENCE ── */}
      <section className="px-4 sm:px-8 py-20 bg-white border-y border-[#E8E8E5]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <Badge variant="accent" size="sm">Resume Intelligence</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Resumes built to pass modern ATS filters.
            </h2>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Recruiters spend an average of 6 seconds per resume. Placement Forge AI ensures your resume features standard headers, quantifiable metrics, and role-specific technical keywords.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-[10px] bg-[#FAFAF9] border border-[#E8E8E5] text-xs">
                <span className="font-semibold text-[#111111]">Before:</span>
                <p className="text-[#6B6B6B] mt-0.5">"Worked on the backend APIs and helped make the dashboard faster."</p>
              </div>
              <div className="p-3 rounded-[10px] bg-[#FFF5EE] border border-[#FCD6BF] text-xs">
                <span className="font-semibold text-[#D95B14]">After (Placement Forge Suggestion):</span>
                <p className="text-[#111111] mt-0.5">"Architected REST endpoints in Node.js, reducing client payload response times by 34% through Redis caching."</p>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/resume">
                <PrimaryButton size="sm">Explore Resume Builder</PrimaryButton>
              </Link>
            </div>
          </div>

          <LightCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <span className="text-xs font-semibold text-[#111111]">ATS Diagnostic Score</span>
              <span className="text-sm font-bold text-[#D95B14]">81 / 100</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Keyword Match</span>
                <span className="font-semibold text-[#111111]">18/20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Formatting & Chronology</span>
                <span className="font-semibold text-[#111111]">17/20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Quantified Project Metrics</span>
                <span className="font-semibold text-[#111111]">16/20</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E8E8E5]">
              <span className="text-[11px] font-semibold text-emerald-600">✓ 92% pass probability for SDE-1 campus drives</span>
            </div>
          </LightCard>
        </div>
      </section>

      {/* ── 5. AI INTERVIEW PRACTICE ── */}
      <section className="px-4 sm:px-8 py-20 max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="neutral" size="sm" className="mb-3">Live Simulation Room</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Practice before the real interview.
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Speak to realistic video avatars, write code in the embedded editor, and receive instant rubric feedback.
          </p>
        </div>

        <DarkCard className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A28] pb-6">
            <div>
              <Badge variant="accent" size="sm" dot>Round 2: Technical & DSA</Badge>
              <h3 className="text-xl font-bold text-white mt-2">Question 4 of 10</h3>
              <p className="text-xs text-[#A0A0A0] mt-1">Difficulty: Medium • Timer: 120s</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/10 text-white">01:42 remaining</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-medium">
            "Given an array of integer stock prices where prices[i] is the price on day i, write an efficient algorithm in O(n) time to determine the maximum profit from a single transaction."
          </p>

          <div className="p-4 rounded-[12px] bg-[#1A1A1A] border border-[#2A2A28] font-mono text-xs text-zinc-400">
            <span className="text-[#D95B14]">// Monaco Code Workspace</span>
            <br />
            function maxProfit(prices) &#123;
            <br />
            &nbsp;&nbsp;let minPrice = Infinity, maxProfit = 0;
            <br />
            &nbsp;&nbsp;<span className="text-emerald-400">// Your solution here</span>
            <br />
            &#125;
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <span className="text-xs text-[#8E8E8E]">Microphone speech-to-text active • Video avatar responsive</span>
            <Link to="/interview/setup">
              <PrimaryButton size="sm" className="bg-[#D95B14] text-white hover:bg-[#BF4D0C]">
                Try Interview Room
              </PrimaryButton>
            </Link>
          </div>
        </DarkCard>
      </section>

      {/* ── 6. PERSONALIZED ROADMAP ── */}
      <section className="px-4 sm:px-8 py-20 bg-[#F4F4F1] border-y border-[#E8E8E5]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="neutral" size="sm" className="mb-3">12-Week Blueprints</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Know exactly what to study every week.
            </h2>
            <p className="text-sm text-[#6B6B6B] mt-2">
              Select your dream CTC bracket (6 LPA to 20+ LPA) and follow a structured curriculum covering 11 core computer science modules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LightCard className="p-5 space-y-3">
              <Badge variant="success">Completed</Badge>
              <h4 className="text-sm font-semibold text-[#111111]">1. DSA Fundamentals</h4>
              <p className="text-xs text-[#6B6B6B]">Arrays, Two Pointers, Sliding Window, Binary Search.</p>
            </LightCard>

            <LightCard className="p-5 space-y-3 border-[#D95B14]/40 ring-1 ring-[#D95B14]/20">
              <Badge variant="accent" dot>Active Week</Badge>
              <h4 className="text-sm font-semibold text-[#111111]">2. Trees & Graphs</h4>
              <p className="text-xs text-[#6B6B6B]">BST, BFS/DFS, Cycle detection, Topological sort.</p>
            </LightCard>

            <LightCard className="p-5 space-y-3">
              <Badge variant="neutral">Upcoming</Badge>
              <h4 className="text-sm font-semibold text-[#111111]">3. System Design</h4>
              <p className="text-xs text-[#6B6B6B]">Object-oriented principles, caching, schema design.</p>
            </LightCard>

            <LightCard className="p-5 space-y-3">
              <Badge variant="neutral">Final Phase</Badge>
              <h4 className="text-sm font-semibold text-[#111111]">4. Mock Placement</h4>
              <p className="text-xs text-[#6B6B6B]">Timed live simulations and HR interview polish.</p>
            </LightCard>
          </div>
        </div>
      </section>

      {/* ── 7. PLACEMENT READINESS ANALYTICS ── */}
      <section id="analytics" className="px-4 sm:px-8 py-20 max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="neutral" size="sm" className="mb-3">Readiness Index</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Know where you stand before the company arrives.
          </h2>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Multi-dimensional evaluation across 7 core disciplines: Resume, DSA, Core CS, Communication, Projects, Interview, and Problem Solving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <LightCard className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#111111]">Competency Breakdown</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#6B6B6B]">Data Structures & Algorithms</span>
                  <span className="font-semibold text-[#111111]">78%</span>
                </div>
                <div className="w-full bg-[#E8E8E5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#D95B14] h-full w-[78%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#6B6B6B]">Core CS (OS, DBMS, Networks)</span>
                  <span className="font-semibold text-[#111111]">70%</span>
                </div>
                <div className="w-full bg-[#E8E8E5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#111111] h-full w-[70%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#6B6B6B]">Communication & Clarity</span>
                  <span className="font-semibold text-[#111111]">82%</span>
                </div>
                <div className="w-full bg-[#E8E8E5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#111111] h-full w-[82%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#6B6B6B]">Resume Quality</span>
                  <span className="font-semibold text-[#111111]">81%</span>
                </div>
                <div className="w-full bg-[#E8E8E5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#111111] h-full w-[81%] rounded-full" />
                </div>
              </div>
            </div>
          </LightCard>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#111111]">Objective, data-driven readiness</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              No guessing whether you are ready for a Google, Microsoft, or Tier-1 product campus drive. Your Placement Readiness Score tracks every problem solved, interview taken, and resume improvement made.
            </p>
            <div className="pt-2">
              <Link to="/dashboard">
                <PrimaryButton size="sm">Inspect Command Center</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. HOW IT WORKS ── */}
      <section id="how-it-works" className="px-4 sm:px-8 py-20 bg-[#F4F4F1] border-y border-[#E8E8E5]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="neutral" size="sm" className="mb-3">The Protocol</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              How it works
            </h2>
            <p className="text-sm text-[#6B6B6B] mt-2">
              Three clear steps to turn preparation into an offer letter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LightCard className="p-6 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-semibold text-[#111111]">Baseline Diagnostic</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Scan your resume with the ATS evaluator and take a quick 15-minute diagnostic interview to identify exact skill gaps.
              </p>
            </LightCard>

            <LightCard className="p-6 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#D95B14] text-white flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-semibold text-[#111111]">Target Roadmap</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Receive an 11-module weekly study plan tailored to your target package bracket (10, 15, or 20+ LPA).
              </p>
            </LightCard>

            <LightCard className="p-6 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-semibold text-[#111111]">Simulation Loop</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                Practice weekly technical simulations, refine your coding speed in Monaco, and monitor your Readiness Index rise.
              </p>
            </LightCard>
          </div>
        </div>
      </section>

      {/* ── 9. STUDENT WORKFLOW ── */}
      <section className="px-4 sm:px-8 py-20 max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="neutral" size="sm" className="mb-3">Weekly Rhythm</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            A student's week on Placement Forge AI
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-[14px] bg-white border border-[#E8E8E5] space-y-2">
            <span className="text-xs font-semibold text-[#D95B14]">Monday — Focus Topic</span>
            <h4 className="text-sm font-semibold text-[#111111]">Complete Roadmap Module</h4>
            <p className="text-xs text-[#6B6B6B]">Solve the week's curated DSA patterns (e.g. Graph Traversals).</p>
          </div>
          <div className="p-5 rounded-[14px] bg-white border border-[#E8E8E5] space-y-2">
            <span className="text-xs font-semibold text-[#D95B14]">Wednesday — Resume Audit</span>
            <h4 className="text-sm font-semibold text-[#111111]">Optimize Application</h4>
            <p className="text-xs text-[#6B6B6B]">Incorporate quantifiable project metrics into your ATS profile.</p>
          </div>
          <div className="p-5 rounded-[14px] bg-white border border-[#E8E8E5] space-y-2">
            <span className="text-xs font-semibold text-[#D95B14]">Friday — Live Simulation</span>
            <h4 className="text-sm font-semibold text-[#111111]">Take Mock Interview</h4>
            <p className="text-xs text-[#6B6B6B]">Simulate a real 30-minute technical interview and review the rubric report.</p>
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section id="faq" className="px-4 sm:px-8 py-20 bg-[#F4F4F1] border-y border-[#E8E8E5]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <Badge variant="neutral" size="sm" className="mb-3">Answers</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-[12px] bg-white border border-[#E8E8E5] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#111111]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-[#111111]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed border-t border-[#E8E8E5]/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FINAL CTA ── */}
      <section className="px-4 sm:px-8 py-24 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111]">
          Start your placement preparation with clarity.
        </h2>
        <p className="text-sm sm:text-base text-[#6B6B6B] max-w-xl mx-auto">
          Join thousands of university students forging their path to top software engineering roles.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => openAuth('register')}
          >
            Start Preparing Now
          </PrimaryButton>
          <Link to="/dashboard">
            <SecondaryButton size="lg">
              Explore Demo Mode
            </SecondaryButton>
          </Link>
        </div>
      </section>

      {/* ── 12. FOOTER ── */}
      <footer className="mt-auto px-4 sm:px-8 py-10 border-t border-[#E8E8E5] bg-[#FAFAF9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6B6B]">
        <BrandLogo size="sm" showTagline />
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="hover:text-[#111111]">Dashboard</Link>
          <Link to="/resume" className="hover:text-[#111111]">Resume</Link>
          <Link to="/interview" className="hover:text-[#111111]">Interviews</Link>
          <Link to="/roadmap" className="hover:text-[#111111]">Roadmap</Link>
          <Link to="/billing" className="hover:text-[#111111]">Billing</Link>
        </div>
        <p>© 2026 Placement Forge AI. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialTab={authTab}
      />
    </div>
  )
}

export default LandingPage
