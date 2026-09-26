import React, { useState } from 'react'
import {
  PageHeader,
  LightCard,
  DarkCard,
  Badge,
  ProgressIndicator,
  PrimaryButton,
  SecondaryButton,
  Select,
} from '../components/common'
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  Sparkles,
  CheckSquare,
  Square,
  History,
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

const INITIAL_MODULES = [
  {
    id: 1,
    title: 'Programming Fundamentals',
    estimatedTime: 'Week 1 (8 hours)',
    status: 'completed',
    progress: 100,
    topics: ['Memory allocation & pointers', 'Time & Space complexity (Big-O)', 'Recursion & call stack fundamentals'],
    resources: ['CS50 Fundamentals', 'Language Standard Docs'],
    practiceQuestions: ['Implement Binary Search iteratively & recursively', 'Reverse a linked list'],
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms',
    estimatedTime: 'Weeks 2–4 (24 hours)',
    status: 'completed',
    progress: 100,
    topics: ['Arrays & Two Pointers', 'Fast & Slow pointers, Sliding Window', 'HashMaps & prefix sums', 'Binary Trees & BST traversals'],
    resources: ['NeetCode 150', 'Striver SDE Sheet'],
    practiceQuestions: ['Lowest Common Ancestor in BST', 'Course Schedule (Topological Sort)'],
  },
  {
    id: 3,
    title: 'Object-Oriented Programming (OOP)',
    estimatedTime: 'Week 5 (10 hours)',
    status: 'in-progress',
    progress: 60,
    topics: ['Encapsulation, Inheritance, Polymorphism, Abstraction', 'SOLID design principles', 'Design Patterns (Factory, Singleton, Observer)'],
    resources: ['Head First Design Patterns', 'Refactoring.Guru'],
    practiceQuestions: ['Design a Parking Lot system in Java/C++', 'Implement an LRU Cache with O(1) ops'],
  },
  {
    id: 4,
    title: 'Database Management Systems (DBMS)',
    estimatedTime: 'Week 6 (12 hours)',
    status: 'in-progress',
    progress: 40,
    topics: ['ACID properties & transactions', 'Relational normalization (1NF to BCNF)', 'B-Trees, indexing & query execution plans'],
    resources: ['Database System Concepts (Silberschatz)', 'Use The Index, Luke'],
    practiceQuestions: ['Explain write amplification with indexes', 'Solve a phantom read concurrency anomaly'],
  },
  {
    id: 5,
    title: 'Operating Systems',
    estimatedTime: 'Week 7 (10 hours)',
    status: 'pending',
    progress: 0,
    topics: ['Processes vs Threads & Context Switching', 'CPU Scheduling algorithms', 'Deadlock detection & Bankers algorithm', 'Virtual memory, paging & page replacement'],
    resources: ['Operating Systems: Three Easy Pieces (OSTEP)'],
    practiceQuestions: ['Implement a Producer-Consumer pattern using Mutex/Semaphores', 'Explain Thrashing'],
  },
  {
    id: 6,
    title: 'Computer Networks',
    estimatedTime: 'Week 8 (10 hours)',
    status: 'pending',
    progress: 0,
    topics: ['OSI & TCP/IP 5-layer models', 'TCP 3-way handshake & termination', 'DNS lookup flow, HTTP/1.1 vs HTTP/2 vs HTTP/3', 'WebSockets & TLS handshakes'],
    resources: ['Computer Networking: A Top-Down Approach (Kurose & Ross)'],
    practiceQuestions: ['What happens step-by-step when you type google.com in a browser?', 'TCP vs UDP trade-offs'],
  },
  {
    id: 7,
    title: 'SQL & Query Optimization',
    estimatedTime: 'Week 9 (8 hours)',
    status: 'pending',
    progress: 0,
    topics: ['Complex JOINs, Aggregations & Window functions', 'Subqueries vs CTEs', 'Optimizing slow queries with EXPLAIN ANALYZE'],
    resources: ['PostgreSQL Official Tutorial', 'LeetCode SQL 50'],
    practiceQuestions: ['Department Top 3 Salaries (Dense_Rank window function)', 'Second Highest Salary query'],
  },
  {
    id: 8,
    title: 'Backend Development & REST APIs',
    estimatedTime: 'Week 10 (14 hours)',
    status: 'pending',
    progress: 0,
    topics: ['RESTful API standards & status codes', 'Authentication (JWT, OAuth2, Session cookies)', 'Middleware, rate limiting & error handling'],
    resources: ['RESTful API Guidelines', 'Mozilla Developer Network (MDN)'],
    practiceQuestions: ['Build an authenticated token bucket rate limiter', 'Design an idempotent payment endpoint'],
  },
  {
    id: 9,
    title: 'System Design (HLD & LLD)',
    estimatedTime: 'Week 11 (16 hours)',
    status: 'pending',
    progress: 0,
    topics: ['Horizontal vs Vertical Scaling & Load Balancers', 'Caching strategies (Redis, Write-through vs Write-back)', 'Database Sharding & Consistent Hashing', 'Message Queues (Kafka, RabbitMQ)'],
    resources: ['System Design Primer (Donne Martin)', 'Designing Data-Intensive Applications (Kleppmann)'],
    practiceQuestions: ['Design a URL Shortener (TinyURL)', 'Design a Distributed Rate Limiter'],
  },
  {
    id: 10,
    title: 'Full-Stack Production Projects',
    estimatedTime: 'Week 12 (16 hours)',
    status: 'pending',
    progress: 0,
    topics: ['Quantifying architectural impact with metrics', 'Containerization with Docker', 'Deploying CI/CD pipelines & monitoring'],
    resources: ['Full Stack Open', 'Docker Docs'],
    practiceQuestions: ['Add Redis caching to a slow project endpoint', 'Set up GitHub Actions automated build'],
  },
  {
    id: 11,
    title: 'Interview Preparation & Behavioral Polish',
    estimatedTime: 'Final Polish (10 hours)',
    status: 'pending',
    progress: 0,
    topics: ['Timed mock coding simulations in Monaco', 'STAR method behavioral stories (Conflict, Leadership, Obstacle)', 'ATS Resume alignment for target companies'],
    resources: ['Cracking the Coding Interview', 'Placement Forge AI Simulation Studio'],
    practiceQuestions: ['Simulate 3 live technical rounds', 'Record a 3-minute behavioral STAR elevator pitch'],
  },
]

export function RoadmapPage() {
  const [role, setRole] = useState('Software Engineer')
  const [targetPackage, setTargetPackage] = useState('12 LPA')
  const [skillLevel, setSkillLevel] = useState('Intermediate')
  const [useResume, setUseResume] = useState('Yes')
  const [modules, setModules] = useState(INITIAL_MODULES)
  const [expandedModule, setExpandedModule] = useState(3) // Module 3 expanded by default
  const [activeTab, setActiveTab] = useState('curriculum') // 'curriculum' | 'history'
  const toast = useToast()

  // Calculate overall progress dynamically
  const completedCount = modules.filter((m) => m.status === 'completed').length
  const inProgressSum = modules
    .filter((m) => m.status === 'in-progress')
    .reduce((acc, m) => acc + (m.progress || 50), 0)
  const overallProgress = Math.round(
    ((completedCount * 100 + inProgressSum) / (modules.length * 100)) * 100
  )

  const handleGenerate = (e) => {
    e.preventDefault()
    toast.show(`Roadmap generated for ${role} (${targetPackage})`, { type: 'forge' })
  }

  const toggleModuleComplete = (id) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'completed' ? 'in-progress' : 'completed'
          const nextProgress = nextStatus === 'completed' ? 100 : 50
          return { ...m, status: nextStatus, progress: nextProgress }
        }
        return m
      })
    )
    toast.show('Module progress updated', { type: 'success' })
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <PageHeader
        title="AI Career Roadmap"
        subtitle="Curated 11-module structured placement blueprint tailored to your target package and role."
        breadcrumbs={['Preparation', 'Career Roadmap']}
        badge={<Badge variant="accent" dot>Target: {targetPackage}</Badge>}
        action={
          <div className="flex items-center gap-2">
            <SecondaryButton
              icon={History}
              onClick={() => setActiveTab(activeTab === 'curriculum' ? 'history' : 'curriculum')}
            >
              {activeTab === 'curriculum' ? 'Roadmap History' : 'View Curriculum'}
            </SecondaryButton>
          </div>
        }
      />

      {/* ── ROADMAP GENERATOR INPUT PANEL ── */}
      <LightCard className="p-6 space-y-5">
        <div className="border-b border-[#E8E8E5] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#111111]">Roadmap Parameters</h3>
            <p className="text-xs text-[#6B6B6B]">Adjust target criteria to calibrate depth & topics.</p>
          </div>
          <Badge variant="neutral" size="sm">Curriculum Generator</Badge>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Select
            label="Target Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              'Software Engineer',
              'Frontend Developer',
              'Backend Developer',
              'Full Stack Developer',
              'Data Analyst',
              'ML Engineer',
            ]}
          />

          <Select
            label="Target Package (CTC)"
            value={targetPackage}
            onChange={(e) => setTargetPackage(e.target.value)}
            options={['6 LPA', '10 LPA', '12 LPA', '15 LPA', '20 LPA+']}
          />

          <Select
            label="Current Skill Level"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            options={['Beginner', 'Intermediate', 'Advanced']}
          />

          <Select
            label="Use Verified Resume?"
            value={useResume}
            onChange={(e) => setUseResume(e.target.value)}
            options={['Yes', 'No']}
          />

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
            <PrimaryButton type="submit" icon={Sparkles}>
              Generate My Roadmap
            </PrimaryButton>
          </div>
        </form>
      </LightCard>

      {activeTab === 'history' ? (
        /* ── ROADMAP HISTORY TAB ── */
        <LightCard className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#111111]">Previous Roadmap Generations</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-[12px] bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-[#111111]">Software Engineer (12 LPA Tier)</h4>
                <p className="text-[11px] text-[#6B6B6B]">Generated 2 weeks ago • Active Roadmap</p>
              </div>
              <Badge variant="accent" size="sm">Current Active</Badge>
            </div>
            <div className="p-4 rounded-[12px] bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-[#111111]">Frontend Developer (10 LPA Tier)</h4>
                <p className="text-[11px] text-[#6B6B6B]">Archived on Sep 12, 2026</p>
              </div>
              <Badge variant="neutral" size="sm">Archived</Badge>
            </div>
          </div>
        </LightCard>
      ) : (
        /* ── CURRICULUM & TIMELINE TAB ── */
        <div className="space-y-8">
          {/* Summary Progress Card */}
          <DarkCard className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#D95B14]">
                  Preparation Roadmap • {role}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  12-Week Comprehensive Curriculum
                </h3>
                <p className="text-xs text-[#A0A0A0] mt-1">
                  Estimated duration: <strong>12 weeks</strong> • Target Compensation: <strong>{targetPackage}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#8E8E8E] block">Overall Completion</span>
                <span className="text-3xl font-bold text-white tabular-nums">{overallProgress}%</span>
              </div>
            </div>

            <div className="mt-5">
              <ProgressIndicator value={overallProgress} variant="accent" showPercentage={false} size="md" />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-[#A0A0A0]">
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {completedCount} of {modules.length} Modules Completed
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <Circle className="w-4 h-4 text-[#D95B14]" />
                2 Modules In Progress
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <Clock className="w-4 h-4 text-zinc-400" />
                ~5 weeks remaining
              </span>
            </div>
          </DarkCard>

          {/* Today's Tasks Callout */}
          <LightCard className="p-5 border-l-4 border-l-[#D95B14]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D95B14]">
                Today's Recommended Focus
              </span>
              <Badge variant="accent" size="sm">Week 5 Objective</Badge>
            </div>
            <h4 className="text-sm font-semibold text-[#111111]">
              Module 3: Implement an LRU Cache & Review SOLID Principles
            </h4>
            <p className="text-xs text-[#6B6B6B] mt-1">
              High-frequency question asked by Amazon, Cisco, and Razorpay campus hiring panels.
            </p>
          </LightCard>

          {/* 11 Modules Accordion List */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#111111]">
              Curriculum Modules (11 Stages)
            </h3>

            <div className="space-y-3">
              {modules.map((m) => {
                const isExpanded = expandedModule === m.id
                const isComplete = m.status === 'completed'
                const isInProgress = m.status === 'in-progress'

                return (
                  <div
                    key={m.id}
                    className={`rounded-[14px] bg-white border transition-all ${
                      isExpanded
                        ? 'border-[#D95B14]/40 shadow-card ring-1 ring-[#D95B14]/20'
                        : 'border-[#E8E8E5] hover:border-[#D0D0CB]'
                    }`}
                  >
                    {/* Module Header Bar */}
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleModuleComplete(m.id)}
                          className="shrink-0 text-zinc-400 hover:text-[#D95B14] transition-colors"
                          title={isComplete ? 'Mark in progress' : 'Mark complete'}
                        >
                          {isComplete ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-zinc-300" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-[#8E8E8E]">
                              Stage {m.id.toString().padStart(2, '0')}
                            </span>
                            <h4 className={`text-sm font-semibold truncate ${
                              isComplete ? 'line-through text-zinc-400' : 'text-[#111111]'
                            }`}>
                              {m.title}
                            </h4>
                          </div>
                          <span className="text-[11px] text-[#6B6B6B] block mt-0.5">
                            {m.estimatedTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          variant={
                            isComplete ? 'success' : isInProgress ? 'accent' : 'neutral'
                          }
                          size="sm"
                          dot={isInProgress}
                        >
                          {isComplete ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                        </Badge>

                        <button
                          onClick={() => setExpandedModule(isExpanded ? null : m.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B6B] hover:bg-[#F4F4F1] transition-colors"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#111111]' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Module Content */}
                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-[#E8E8E5]/70 space-y-4 text-xs text-[#6B6B6B] animate-in fade-in duration-150">
                        {/* Topics */}
                        <div>
                          <span className="font-semibold text-[#111111] block mb-1.5">
                            Core Topics Covered:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {m.topics.map((t, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-zinc-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D95B14]" />
                                <span>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div className="pt-2">
                          <span className="font-semibold text-[#111111] block mb-1">
                            Curated Resources:
                          </span>
                          <p className="text-zinc-600">
                            {m.resources.join(' • ')}
                          </p>
                        </div>

                        {/* Practice Questions */}
                        <div className="pt-2">
                          <span className="font-semibold text-[#111111] block mb-1.5">
                            Placement Benchmark Questions:
                          </span>
                          <ul className="space-y-1 list-disc list-inside text-zinc-700">
                            {m.practiceQuestions.map((q, idx) => (
                              <li key={idx}>{q}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Action buttons inside expanded card */}
                        <div className="pt-3 flex items-center justify-between border-t border-[#E8E8E5]">
                          <button
                            onClick={() => toggleModuleComplete(m.id)}
                            className="text-xs font-semibold text-[#6B6B6B] hover:text-[#111111]"
                          >
                            {isComplete ? 'Mark as In-Progress' : '✓ Mark Module Complete'}
                          </button>

                          <PrimaryButton
                            size="sm"
                            onClick={() => {
                              toast.show(`Continuing ${m.title}...`, { type: 'forge' })
                              window.location.href = '/interview/setup'
                            }}
                          >
                            Practice Questions in Studio →
                          </PrimaryButton>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoadmapPage
