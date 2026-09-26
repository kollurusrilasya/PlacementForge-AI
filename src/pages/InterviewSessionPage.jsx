import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import {
  PrimaryButton,
  SecondaryButton,
  Button,
  LightCard,
  Badge,
  Modal,
} from '../components/common'
import femaleVideo from '../assets/female-ai.mp4'
import maleVideo from '../assets/male-ai.mp4'
import {
  Mic,
  MicOff,
  Play,
  Pause,
  ArrowRight,
  Clock,
  Code2,
  SkipForward,
  AlertCircle,
  X,
  Volume2,
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

const QUESTIONS_DATABASE = {
  technical: [
    {
      id: 't1',
      question: 'Explain the internal diffing algorithm of React Virtual DOM, and how unique keys prevent unnecessary DOM node recreations.',
      hint: 'Discuss the O(n) heuristic assumption and component re-mounting vs reconciliation.',
      idealAnswer: 'React relies on an O(n) heuristic algorithm assuming elements of different types generate different trees, and keys uniquely identify child nodes across renders.',
    },
    {
      id: 't2',
      question: 'What is the difference between SQL and NoSQL databases, and in what scenario would you choose PostgreSQL over MongoDB?',
      hint: 'Touch on ACID compliance, relational integrity, foreign keys, and complex transactional consistency.',
      idealAnswer: 'PostgreSQL provides strict schema constraints and ACID guarantees, making it suitable for transactions, financial ledgers, and relational datasets.',
    },
    {
      id: 't3',
      question: 'Describe how an index works in relational databases like PostgreSQL. Why can having too many indexes degrade write performance?',
      hint: 'Mention B-Tree data structures and the index tree rebalancing overhead on INSERT/UPDATE.',
      idealAnswer: 'Indexes maintain balanced B-Trees pointing to row pointers. While reading is O(log n), each write operation requires updating all related index B-Trees.',
    },
    {
      id: 't4',
      question: 'How does Node.js handle concurrency with a single-threaded Event Loop? What is the role of the Libuv thread pool?',
      hint: 'Mention the phases of the Event Loop (timers, poll, check) and worker threads for blocking file I/O.',
      idealAnswer: 'Node uses an event-driven non-blocking I/O model. Libuv offloads blocking file and crypto tasks to a thread pool of 4 default threads while main JS stays single-threaded.',
    },
    {
      id: 't5',
      question: 'Explain the principles of RESTful API design. What are idempotent HTTP methods?',
      hint: 'GET, PUT, DELETE are idempotent because multiple identical requests yield the same server state.',
      idealAnswer: 'Idempotency means making the request multiple times produces the identical side-effect as a single request.',
    },
  ],
  coding: [
    {
      id: 'c1',
      question: 'Best Time to Buy and Sell Stock: Given an array prices where prices[i] is the price of a given stock on day i, maximize profit from one transaction.',
      starterCode: `function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  \n  for (let i = 0; i < prices.length; i++) {\n    if (prices[i] < minPrice) {\n      minPrice = prices[i];\n    } else if (prices[i] - minPrice > maxProfit) {\n      maxProfit = prices[i] - minPrice;\n    }\n  }\n  return maxProfit;\n}\n\n// Test invocation\nconsole.log(maxProfit([7, 1, 5, 3, 6, 4]));`,
      language: 'javascript',
      testCases: 'Test Case 1: [7,1,5,3,6,4] -> Expected: 5 | Test Case 2: [7,6,4,3,1] -> Expected: 0',
    },
    {
      id: 'c2',
      question: 'Valid Palindrome: Given a string s, return true if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
      starterCode: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left] !== clean[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama"));`,
      language: 'javascript',
      testCases: 'Test Case 1: "A man, a plan, a canal: Panama" -> Expected: true',
    },
    {
      id: 'c3',
      question: 'Two Sum: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(n) time.',
      starterCode: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
      language: 'javascript',
      testCases: 'Test Case 1: [2, 7, 11, 15], target = 9 -> Expected: [0, 1]',
    },
  ],
  hr: [
    {
      id: 'h1',
      question: 'Tell me about a time you faced a difficult technical bug or engineering roadblock. How did you diagnose and overcome it?',
      hint: 'Structure your response using the STAR framework (Situation, Task, Action, Result).',
      idealAnswer: 'Candidates should present a specific scenario, methodical debugging steps (logging, profiling, isolation), and quantifiable outcome.',
    },
    {
      id: 'h2',
      question: 'Describe a situation where you had a disagreement with a team member regarding an architectural decision. How did you reach alignment?',
      hint: 'Focus on empathy, data-driven trade-offs, proof-of-concepts, and team cohesion.',
      idealAnswer: 'Highlight active listening, evaluating both solutions via benchmarking, and committing to the chosen path collaboratively.',
    },
    {
      id: 'h3',
      question: 'Where do you see yourself in 3 years, and what specific engineering competencies are you aiming to master first at our company?',
      hint: 'Express enthusiasm for system depth, code ownership, mentorship, and domain mastery.',
      idealAnswer: 'Articulate growth from an independent feature contributor into a high-ownership engineer designing resilient services.',
    },
  ],
}

export function InterviewSessionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()

  const config = location.state || {
    interviewType: 'technical',
    difficulty: 'Medium',
    targetRole: 'Software Engineer',
    questionCount: 5,
    experienceLevel: 'Campus / Fresher',
    voiceAvatar: 'female',
  }

  const questionsList =
    QUESTIONS_DATABASE[config.interviewType] || QUESTIONS_DATABASE.technical
  const totalQuestions = Math.min(config.questionCount || 5, questionsList.length)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [codeContent, setCodeContent] = useState(
    questionsList[0]?.starterCode || '// Write code here\n'
  )
  const [language, setLanguage] = useState('javascript')
  const [isRecording, setIsRecording] = useState(false)
  const [timer, setTimer] = useState(120)
  const [isPaused, setIsPaused] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [codeOutput, setCodeOutput] = useState('')

  const videoRef = useRef(null)
  const currentQ = questionsList[currentIndex] || questionsList[0]

  // Next / Submit Question
  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setSubmitting(true)
      toast.show('Completing session & generating rubric analysis...', { type: 'forge' })
      setTimeout(() => {
        navigate('/interview/report', {
          state: {
            interviewType: config.interviewType,
            targetRole: config.targetRole,
            difficulty: config.difficulty,
          },
        })
      }, 1000)
    } else {
      setCurrentIndex((prev) => {
        const next = prev + 1
        setTimer(120)
        setAnswer('')
        setCodeOutput('')
        if (questionsList[next]?.starterCode) {
          setCodeContent(questionsList[next].starterCode)
        }
        return next
      })
      toast.show(`Question ${currentIndex + 2} of ${totalQuestions}`, { type: 'info' })
    }
  }, [currentIndex, totalQuestions, config, navigate, questionsList, toast])

  // Timer countdown
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          toast.show("Time's up for this question. Moving forward.", { type: 'info' })
          handleNextQuestion()
          return 120
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPaused, handleNextQuestion, toast])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Toggle Recording Simulation
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      toast.show('Microphone listening...', { type: 'forge' })
      setTimeout(() => {
        setAnswer(
          (prev) =>
            prev +
            (prev ? ' ' : '') +
            'In my experience, prioritizing algorithmic efficiency and avoiding unnecessary re-renders yields significant performance advantages.'
        )
      }, 1800)
    } else {
      setIsRecording(false)
      toast.show('Microphone stopped', { type: 'info' })
    }
  }

  // Run Code simulation
  const handleRunCode = () => {
    toast.show('Executing test runner...', { type: 'forge' })
    setTimeout(() => {
      setCodeOutput(
        `✓ Test Case 1 Passed (12ms)\n✓ Test Case 2 Passed (8ms)\nAll test suites green.`
      )
    }, 600)
  }

  const isCoding = config.interviewType === 'coding'

  return (
    <div className="space-y-6">
      {/* ── TOP SESSION CONTROL BAR ── */}
      <div className="p-4 rounded-[14px] bg-[#111111] text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="accent" size="sm" dot>Live Simulation</Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-white">
            Placement Forge AI • {config.targetRole}
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">•</span>
          <span className="text-xs text-zinc-400 capitalize hidden sm:inline">
            {config.interviewType} Assessment
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Question Counter */}
          <span className="text-xs font-bold text-white tabular-nums">
            Question {currentIndex + 1} / {totalQuestions}
          </span>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-white/10 font-mono text-xs text-white">
            <Clock className="w-3.5 h-3.5 text-[#D95B14]" />
            <span>{formatTimer(timer)}</span>
          </div>

          {/* Pause & Exit */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowExitModal(true)}
            className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
            title="Exit Session"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[#E8E8E5] h-1 rounded-full overflow-hidden">
        <div
          className="bg-[#D95B14] h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* ── MAIN INTERVIEW WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: AI AVATAR & PROMPT */}
        <div className="lg:col-span-5 space-y-4">
          {/* Avatar Video Area */}
          <div className="rounded-[16px] bg-[#111111] border border-[#2A2A28] overflow-hidden aspect-video relative flex items-center justify-center shadow-card">
            <video
              ref={videoRef}
              src={config.voiceAvatar === 'male' ? maleVideo : femaleVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Evaluator ({config.voiceAvatar === 'male' ? 'David' : 'Sarah'})</span>
            </div>
            <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white">
              <Volume2 className="w-3.5 h-3.5 opacity-80" />
            </div>
          </div>

          {/* Question Display Card */}
          <LightCard className="p-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#D95B14]">
                Question {currentIndex + 1} Prompt
              </span>
              <Badge variant="neutral" size="sm">{config.difficulty}</Badge>
            </div>

            <p className="text-sm sm:text-base font-semibold text-[#111111] leading-relaxed">
              {currentQ.question}
            </p>

            {currentQ.hint && (
              <div className="p-3 rounded-[8px] bg-[#FAFAF9] border border-[#E8E8E5] text-xs text-[#6B6B6B] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#D95B14] shrink-0 mt-0.5" />
                <span>Tip: {currentQ.hint}</span>
              </div>
            )}
          </LightCard>
        </div>

        {/* RIGHT COLUMN: ANSWER WORKSPACE (CODING OR SPEECH) */}
        <div className="lg:col-span-7 space-y-4">
          {isCoding ? (
            /* CODING INTERVIEW MODE: MONACO EDITOR */
            <div className="rounded-[16px] bg-[#1E1E1E] border border-[#2A2A28] overflow-hidden shadow-card flex flex-col h-[520px]">
              {/* Editor Header */}
              <div className="px-4 py-2.5 bg-[#141414] border-b border-[#2A2A28] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#D95B14]" />
                  <span className="text-xs font-semibold text-white">Algorithmic Editor</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-xs bg-[#222222] text-white border border-[#333333] rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="javascript">JavaScript (Node)</option>
                    <option value="python">Python 3</option>
                    <option value="cpp">C++ (GCC)</option>
                    <option value="java">Java 17</option>
                  </select>
                  <Button
                    size="sm"
                    variant="dark"
                    onClick={handleRunCode}
                    className="bg-[#2A2A28] hover:bg-[#333333] text-white"
                  >
                    Run Code
                  </Button>
                </div>
              </div>

              {/* Monaco Editor Component */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={codeContent}
                  onChange={(val) => setCodeContent(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              {/* Output Console Console Output */}
              {codeOutput && (
                <div className="p-3 bg-[#111111] border-t border-[#2A2A28] font-mono text-xs text-emerald-400 whitespace-pre-line max-h-28 overflow-y-auto">
                  {codeOutput}
                </div>
              )}
            </div>
          ) : (
            /* TECHNICAL / HR MODE: SPEECH & TEXT WORKSPACE */
            <LightCard className="p-6 space-y-4 min-h-[460px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3 mb-4">
                  <span className="text-xs font-semibold text-[#111111]">
                    Your Response (Speech & Text)
                  </span>
                  <button
                    onClick={toggleRecording}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-[#111111] text-white hover:bg-[#222222]'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                  </button>
                </div>

                <textarea
                  className="w-full h-64 p-4 text-sm bg-white text-[#111111] rounded-[10px] border border-[#E8E8E5] focus:outline-none focus:ring-1 focus:ring-[#111111] leading-relaxed resize-none"
                  placeholder="Speak your answer or type key algorithmic/architectural points here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <p className="text-[11px] text-[#8E8E8A] mt-2">
                  Speak clearly using the microphone button, or type directly in bullet points.
                </p>
              </div>

              <div className="text-xs text-[#6B6B6B] flex items-center justify-between pt-3 border-t border-[#E8E8E5]">
                <span>Answer length: {answer.length} characters</span>
                <span className="text-emerald-600 font-medium">Evaluation standard: STAR / Technical Clarity</span>
              </div>
            </LightCard>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <SecondaryButton
              icon={SkipForward}
              onClick={() => {
                toast.show('Question skipped', { type: 'info' })
                handleNextQuestion()
              }}
            >
              Skip Question
            </SecondaryButton>

            <PrimaryButton
              size="lg"
              isLoading={submitting}
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleNextQuestion}
            >
              {currentIndex + 1 >= totalQuestions ? 'Finish & Generate Report' : 'Submit Answer'}
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Exit Interview Simulation?"
        description="Your progress in this session will not be graded if you quit early."
        footer={
          <>
            <SecondaryButton onClick={() => setShowExitModal(false)}>
              Resume Interview
            </SecondaryButton>
            <PrimaryButton
              variant="danger"
              onClick={() => {
                setShowExitModal(false)
                navigate('/interview')
              }}
            >
              Exit to Studio
            </PrimaryButton>
          </>
        }
      >
        <p className="text-xs text-[#6B6B6B]">
          Exiting now will forfeit the 10 Forge Credits spent on this simulation room.
        </p>
      </Modal>
    </div>
  )
}

export default InterviewSessionPage
