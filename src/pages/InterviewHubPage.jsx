import React from 'react'
import { PageHeader, LightCard, FeatureCard, PrimaryButton } from '../components/common'
import { Video, ArrowRight, Code2, Users, BrainCircuit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function InterviewHubPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Interview Studio"
        subtitle="Simulate real placement rounds with speech recognition, code execution, and immediate diagnostic scoring."
        breadcrumbs={['Preparation', 'AI Interviews']}
        action={
          <PrimaryButton
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/interview/setup')}
          >
            New Interview
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Code2}
          title="Technical & Algorithms"
          description="Live coding questions, complexity trade-offs, and data structure reasoning."
          actionText="Setup Round"
          onAction={() => navigate('/interview/setup')}
        />
        <FeatureCard
          icon={BrainCircuit}
          title="System Architecture"
          description="Scalability, database sharding, API design, and distributed fundamentals."
          actionText="Setup Round"
          onAction={() => navigate('/interview/setup')}
        />
        <FeatureCard
          icon={Users}
          title="Behavioral & HR"
          description="STAR method responses, conflict resolution, and leadership scenarios."
          actionText="Setup Round"
          onAction={() => navigate('/interview/setup')}
        />
      </div>
    </div>
  )
}

export default InterviewHubPage
