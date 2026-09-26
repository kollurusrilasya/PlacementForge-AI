import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageHeader,
  LightCard,
  PrimaryButton,
  SecondaryButton,
  Select,
  Badge,
} from '../components/common'
import { Video, Code2, Users, ArrowRight, Clock } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export function InterviewSetupPage() {
  const [interviewType, setInterviewType] = useState('technical')
  const [difficulty, setDifficulty] = useState('Medium')
  const [targetRole, setTargetRole] = useState('Software Engineer')
  const [questionCount, setQuestionCount] = useState('5')
  const [experienceLevel, setExperienceLevel] = useState('Campus / Fresher (0-1 yrs)')
  const [voiceAvatar, setVoiceAvatar] = useState('female')
  const navigate = useNavigate()
  const toast = useToast()

  const handleStart = () => {
    toast.show('Initializing AI simulation room...', { type: 'forge' })
    navigate('/interview/session', {
      state: {
        interviewType,
        difficulty,
        targetRole,
        questionCount: parseInt(questionCount, 10),
        experienceLevel,
        voiceAvatar,
      },
    })
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Configure AI Interview Session"
        subtitle="Select simulation parameters, round type, and target hiring specifications."
        breadcrumbs={['Preparation', 'AI Interviews', 'Setup']}
        badge={<Badge variant="accent" dot>Simulated Assessment</Badge>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Card: Technical */}
        <div
          onClick={() => setInterviewType('technical')}
          className={`p-5 rounded-[14px] border cursor-pointer transition-all ${
            interviewType === 'technical'
              ? 'bg-white border-[#D95B14] ring-2 ring-[#D95B14]/20 shadow-card'
              : 'bg-white border-[#E8E8E5] hover:border-[#D0D0CB]'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-center text-[#111111] mb-3">
            <Video className="w-5 h-5 text-[#D95B14]" />
          </div>
          <h3 className="text-sm font-semibold text-[#111111]">Technical Interview</h3>
          <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
            Algorithmic principles, system architecture, database query design, and computer science concepts.
          </p>
        </div>

        {/* Type Card: Coding */}
        <div
          onClick={() => setInterviewType('coding')}
          className={`p-5 rounded-[14px] border cursor-pointer transition-all ${
            interviewType === 'coding'
              ? 'bg-white border-[#D95B14] ring-2 ring-[#D95B14]/20 shadow-card'
              : 'bg-white border-[#E8E8E5] hover:border-[#D0D0CB]'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-center text-[#111111] mb-3">
            <Code2 className="w-5 h-5 text-[#D95B14]" />
          </div>
          <h3 className="text-sm font-semibold text-[#111111]">Coding Interview</h3>
          <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
            Live code execution inside the Monaco editor with algorithmic constraints, complexity analysis, and edge cases.
          </p>
        </div>

        {/* Type Card: HR */}
        <div
          onClick={() => setInterviewType('hr')}
          className={`p-5 rounded-[14px] border cursor-pointer transition-all ${
            interviewType === 'hr'
              ? 'bg-white border-[#D95B14] ring-2 ring-[#D95B14]/20 shadow-card'
              : 'bg-white border-[#E8E8E5] hover:border-[#D0D0CB]'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-center text-[#111111] mb-3">
            <Users className="w-5 h-5 text-[#D95B14]" />
          </div>
          <h3 className="text-sm font-semibold text-[#111111]">HR & Culture Fit</h3>
          <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
            Behavioral questions evaluated using the STAR framework: leadership, conflict resolution, and career vision.
          </p>
        </div>
      </div>

      <LightCard className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E8E8E5] pb-3">
          <h3 className="text-sm font-semibold text-[#111111]">Simulation Parameters</h3>
          <p className="text-xs text-[#6B6B6B]">Calibrated to standard Indian university placement drives.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Target Engineering Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
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
            label="Round Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={['Easy', 'Medium', 'Hard']}
          />

          <Select
            label="Question Count"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            options={[
              { value: '3', label: '3 Questions (Quick 10m)' },
              { value: '5', label: '5 Questions (Standard 20m)' },
              { value: '10', label: '10 Questions (Full Assessment 40m)' },
            ]}
          />

          <Select
            label="Experience Level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            options={[
              'Campus / Fresher (0-1 yrs)',
              'Junior Engineer (1-2 yrs)',
            ]}
          />

          <Select
            label="AI Interviewer Avatar"
            value={voiceAvatar}
            onChange={(e) => setVoiceAvatar(e.target.value)}
            options={[
              { value: 'female', label: 'Sarah (Female AI Interviewer)' },
              { value: 'male', label: 'David (Male AI Interviewer)' },
            ]}
          />
        </div>

        <div className="p-3.5 rounded-[12px] bg-[#FAFAF9] border border-[#E8E8E5] flex items-center justify-between text-xs text-[#6B6B6B]">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D95B14]" />
            Session Duration: ~{parseInt(questionCount, 10) * 4} minutes
          </span>
          <span className="font-semibold text-[#111111]">Fee: 10 Forge Credits</span>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8E8E5]">
          <SecondaryButton onClick={() => navigate('/interview')}>
            Back to Studio
          </SecondaryButton>
          <PrimaryButton
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleStart}
          >
            Start Interview
          </PrimaryButton>
        </div>
      </LightCard>
    </div>
  )
}

export default InterviewSetupPage
