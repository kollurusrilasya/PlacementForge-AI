import React, { useState } from 'react'
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  Button,
  LightCard,
  StatCard,
  FeatureCard,
  PageHeader,
  SectionHeader,
  Badge,
  ProgressIndicator,
  Modal,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  SkeletonCard,
  EmptyState,
  Input,
  Select,
} from '../components/common'
import { useToast } from '../context/ToastContext'
import {
  Sparkles,
  Flame,
  Code2,
  FileCheck2,
  Video,
  Map,
  ChevronDown,
} from 'lucide-react'

export function DesignSystemPage() {
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [progressVal, setProgressVal] = useState(68)

  const triggerLoading = () => {
    setButtonLoading(true)
    setTimeout(() => {
      setButtonLoading(false)
      toast.show('Action simulated successfully', { type: 'success' })
    }, 1200)
  }

  return (
    <div className="space-y-12">
      <PageHeader
        title="Placement Forge AI Design System"
        subtitle="Master UI/UX foundation: clean, quiet, human-designed, and minimal. Crafted for focused college placement preparation without AI SaaS clutter."
        breadcrumbs={['System', 'Foundations & Tokens']}
        badge={<Badge variant="accent" dot>Phase 2 Complete</Badge>}
        action={
          <PrimaryButton onClick={() => setIsModalOpen(true)}>
            Open Sample Modal
          </PrimaryButton>
        }
      />

      {/* 1. Design Tokens Overview */}
      <section className="space-y-4">
        <SectionHeader
          title="1. Color & Surface Tokens"
          description="Warm neutral foundation with near-black text, subtle 1px structural borders, and a restrained warm forge amber accent."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-[12px] bg-[#FAFAF9] border border-[#E8E8E5] space-y-2">
            <div className="h-10 rounded-md bg-[#FAFAF9] border border-[#E8E8E5]" />
            <div>
              <p className="text-xs font-semibold text-[#111111]">Background</p>
              <p className="text-[11px] text-[#6B6B6B] font-mono">#FAFAF9</p>
            </div>
          </div>
          <div className="p-3.5 rounded-[12px] bg-white border border-[#E8E8E5] space-y-2">
            <div className="h-10 rounded-md bg-white border border-[#E8E8E5]" />
            <div>
              <p className="text-xs font-semibold text-[#111111]">Surface</p>
              <p className="text-[11px] text-[#6B6B6B] font-mono">#FFFFFF</p>
            </div>
          </div>
          <div className="p-3.5 rounded-[12px] bg-white border border-[#E8E8E5] space-y-2">
            <div className="h-10 rounded-md bg-[#F4F4F1] border border-[#E8E8E5]" />
            <div>
              <p className="text-xs font-semibold text-[#111111]">Muted Surface</p>
              <p className="text-[11px] text-[#6B6B6B] font-mono">#F4F4F1</p>
            </div>
          </div>
          <div className="p-3.5 rounded-[12px] bg-white border border-[#E8E8E5] space-y-2">
            <div className="h-10 rounded-md bg-[#111111]" />
            <div>
              <p className="text-xs font-semibold text-[#111111]">Near-Black</p>
              <p className="text-[11px] text-[#6B6B6B] font-mono">#111111</p>
            </div>
          </div>
          <div className="p-3.5 rounded-[12px] bg-white border border-[#E8E8E5] space-y-2">
            <div className="h-10 rounded-md bg-[#E8E8E5]" />
            <div>
              <p className="text-xs font-semibold text-[#111111]">Subtle Border</p>
              <p className="text-[11px] text-[#6B6B6B] font-mono">#E8E8E5</p>
            </div>
          </div>
          <div className="p-3.5 rounded-[12px] bg-white border border-[#E8E8E5] space-y-2">
            <div className="h-10 rounded-md bg-[#D95B14]" />
            <div>
              <p className="text-xs font-semibold text-[#111111]">Forge Accent</p>
              <p className="text-[11px] text-[#6B6B6B] font-mono">#D95B14</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Buttons & Interactivity */}
      <section className="space-y-4">
        <SectionHeader
          title="2. Buttons & States"
          description="Tactile, physical 150ms transitions, subtle scale-on-press, and dedicated loading indicators."
        />
        <LightCard className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton onClick={() => toast.show('Primary Button clicked', { type: 'forge' })}>
              Primary Button
            </PrimaryButton>
            <SecondaryButton onClick={() => toast.show('Secondary Button clicked', { type: 'info' })}>
              Secondary Button
            </SecondaryButton>
            <GhostButton onClick={() => toast.show('Ghost Button clicked', { type: 'info' })}>
              Ghost Button
            </GhostButton>
            <Button
              variant="accent"
              icon={Sparkles}
              onClick={() => toast.show('Accent action completed', { type: 'forge' })}
            >
              Accent Action
            </Button>
            <PrimaryButton isLoading={buttonLoading} onClick={triggerLoading}>
              Click to Test Loading State
            </PrimaryButton>
            <SecondaryButton disabled>Disabled State</SecondaryButton>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#E8E8E5]">
            <Button size="sm">Small (32px)</Button>
            <Button size="md">Medium (40px)</Button>
            <Button size="lg">Large (44px)</Button>
            <Button size="sm" variant="secondary" icon={Flame}>
              Icon Button
            </Button>
          </div>
        </LightCard>
      </section>

      {/* 3. Cards & Hierarchy */}
      <section className="space-y-4">
        <SectionHeader
          title="3. Cards & Editorial Layouts"
          description="Restrained cards reserved for meaningful groupings. Differentiated through spacing and contrast rather than heavy drop shadows."
        />

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Placement Readiness"
            value="68%"
            secondaryText="Targeting 12 LPA benchmark"
            icon={Flame}
            trend={{ positive: true, text: '+12% this month' }}
          />
          <StatCard
            label="Mock Interviews"
            value="6"
            secondaryText="3 technical, 2 DSA, 1 HR"
            icon={Video}
          />
          <StatCard
            label="ATS Resume Score"
            value="84"
            secondaryText="Above 80th percentile"
            icon={FileCheck2}
            trend={{ positive: true, text: 'Strong' }}
          />
          <StatCard
            variant="dark"
            label="Interview Credits"
            value="150"
            secondaryText="Next refill in 14 days"
            icon={Sparkles}
          />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <FeatureCard
            icon={Code2}
            title="Technical AI Interview"
            description="Realistic algorithmic and system design rounds with real-time speech, code editor, and diagnostic rubric."
            badgeText="Core Engine"
            actionText="Enter Studio"
            onAction={() => toast.show('Navigating to Interview Studio', { type: 'info' })}
          />
          <FeatureCard
            icon={FileCheck2}
            title="Resume ATS Scorer"
            description="Deep keyword and impact metric audit matching your target company requirements."
            badgeText="Instant Audit"
            actionText="Analyze Document"
            onAction={() => toast.show('Navigating to Scorer', { type: 'info' })}
          />
          <FeatureCard
            variant="dark"
            icon={Map}
            title="Package Tier Roadmap"
            description="Week-by-week curated roadmap mapped to 10 LPA, 20 LPA, and 40 LPA hiring bars."
            badgeText="12 Weeks"
            actionText="View Milestones"
            onAction={() => toast.show('Navigating to Roadmap', { type: 'forge' })}
          />
        </div>
      </section>

      {/* 4. Badges & Progress Indicators */}
      <section className="space-y-4">
        <SectionHeader
          title="4. Badges & Progress Indicators"
          description="Pill badges reserved exclusively for statuses and tags. Pure, purposeful progress bars."
        />
        <LightCard className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="neutral">Draft</Badge>
            <Badge variant="accent" dot>
              AI In Progress
            </Badge>
            <Badge variant="success" dot>
              Placement Ready
            </Badge>
            <Badge variant="warning" dot>
              Needs Review
            </Badge>
            <Badge variant="danger" dot>
              Action Required
            </Badge>
            <Badge variant="dark">Tier 1 Target</Badge>
          </div>

          <div className="space-y-4 max-w-xl">
            <ProgressIndicator
              label="DSA & Problem Solving Mastery"
              sublabel="Week 4 of 12"
              value={progressVal}
              variant="accent"
            />
            <ProgressIndicator
              label="Resume Optimization"
              value={84}
              variant="dark"
            />
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setProgressVal((p) => Math.max(0, p - 10))}
              >
                -10%
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setProgressVal((p) => Math.min(100, p + 10))}
              >
                +10%
              </Button>
            </div>
          </div>
        </LightCard>
      </section>

      {/* 5. Dropdowns & Modals */}
      <section className="space-y-4">
        <SectionHeader
          title="5. Dropdowns, Overlays & Toasts"
          description="Calm interactive elements with click-outside dismissal and escape key support."
        />
        <LightCard className="flex flex-wrap items-center gap-4">
          <Dropdown
            trigger={
              <Button variant="secondary" icon={ChevronDown} iconPosition="right">
                Select Placement Role
              </Button>
            }
          >
            {({ close }) => (
              <>
                <div className="px-3.5 py-1.5 text-[11px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
                  Target Roles
                </div>
                <DropdownItem
                  onClick={() => {
                    toast.show('Selected Software Engineer', { type: 'success' })
                    close()
                  }}
                >
                  Software Engineer (SDE-1)
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    toast.show('Selected Frontend Engineer', { type: 'success' })
                    close()
                  }}
                >
                  Frontend Engineer
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    toast.show('Selected Data Engineer', { type: 'success' })
                    close()
                  }}
                >
                  Backend / Distributed Systems
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem
                  onClick={() => {
                    toast.show('Custom role dialog requested', { type: 'info' })
                    close()
                  }}
                >
                  Configure Custom Role...
                </DropdownItem>
              </>
            )}
          </Dropdown>

          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Preview Modal Dialog
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              toast.show('System alert notification triggered', {
                type: 'forge',
              })
            }
          >
            Trigger Forge Toast
          </Button>
        </LightCard>
      </section>

      {/* 6. Form Controls */}
      <section className="space-y-4">
        <SectionHeader
          title="6. Clean Form Controls"
          description="Labels positioned above inputs, subtle 1px borders, accessible focus rings, and clear validation feedback."
        />
        <LightCard className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <Input
            label="College / University"
            placeholder="e.g. National Institute of Technology"
            defaultValue="National Institute of Technology"
          />
          <Select
            label="Target CTC Bracket"
            options={[
              { value: '10', label: '10 LPA — Foundation' },
              { value: '15', label: '15 LPA — Core Tech' },
              { value: '25', label: '25 LPA — Tier 1 Product' },
              { value: '45', label: '45+ LPA — High Frequency / Global' },
            ]}
            defaultValue="15"
          />
          <Input
            label="Dream Companies"
            placeholder="e.g. Google, Atlassian, Razorpay"
            description="Separate multiple companies with commas"
          />
          <Input
            label="Validation Example"
            defaultValue="invalid-email-format"
            error="Please provide a valid professional email address."
          />
        </LightCard>
      </section>

      {/* 7. Loading States & Skeletons */}
      <section className="space-y-4">
        <SectionHeader
          title="7. Loading States & Skeletons"
          description="Subtle pulsing skeletons matching surface tokens rather than jarring spinning animations."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      {/* 8. Purposeful Empty State */}
      <section className="space-y-4">
        <SectionHeader
          title="8. Intentional Empty State"
          description="Empty states provide guidance and confidence rather than generic blank screens."
        />
        <EmptyState
          icon={Video}
          title="No mock interviews completed yet"
          description="Your first technical session is the fastest way to understand where you stand and identify high-leverage topics to study."
          actionText="Start First Practice Session"
          onAction={() => toast.show('Interview session initiation', { type: 'forge' })}
        />
      </section>

      {/* Sample Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Technical Simulation"
        description="Select interview topic, difficulty tier, and candidate preferences."
        footer={
          <>
            <SecondaryButton onClick={() => setIsModalOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                setIsModalOpen(false)
                toast.show('Interview scheduled successfully', {
                  type: 'success',
                })
              }}
            >
              Confirm Session
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4 text-sm text-[#111111]">
          <p className="text-xs text-[#6B6B6B]">
            This simulation uses the Web Speech API and video avatar interviewer to evaluate communication clarity, algorithmic intuition, and problem-solving structure.
          </p>
          <div className="p-3.5 rounded-[12px] bg-[#F4F4F1] border border-[#E8E8E5] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#111111]">Duration:</span>
              <span className="text-[#6B6B6B]">30 Minutes</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#111111]">Questions:</span>
              <span className="text-[#6B6B6B]">3 Technical + 1 System</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#111111]">Fee:</span>
              <span className="text-[#111111] font-semibold">10 Credits</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DesignSystemPage
