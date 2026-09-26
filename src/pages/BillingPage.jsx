import React, { useState } from 'react'
import {
  PageHeader,
  LightCard,
  DarkCard,
  Badge,
  PrimaryButton,
  SecondaryButton,
  Modal,
} from '../components/common'
import {
  Coins,
  Check,
  Receipt,
  Zap,
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'

export function BillingPage() {
  const { user, addCredits } = useUser()
  const toast = useToast()

  const [checkoutModal, setCheckoutModal] = useState(null)
  const [purchasing, setPurchasing] = useState(false)

  const currentCredits = user?.credits || 3590

  const PLANS = [
    {
      id: 'free',
      name: 'Free Campus',
      tagline: 'Permanent basic tier for all students',
      price: '₹0',
      period: 'forever',
      creditsIncluded: '150 Welcome Credits',
      popular: false,
      isCurrent: false,
      features: [
        '150 Welcome Credits',
        '3 Resume ATS Scans',
        '1 Basic AI Interview Simulation',
        'Foundational Career Roadmap',
        'Community Support',
      ],
      ctaText: 'Current Free Tier',
      ctaDisabled: true,
    },
    {
      id: 'starter',
      name: 'Starter Sprint',
      tagline: 'Essential boost for upcoming interviews',
      price: '₹99',
      period: 'one-time',
      creditsIncluded: '500 Forge Credits',
      popular: false,
      isCurrent: false,
      features: [
        '500 Forge Credits',
        '10 Full AI Interview Rounds',
        'Unlimited Resume ATS Scans',
        'Full 11-Module Career Roadmap',
        'Standard Speech Synthesis',
      ],
      ctaText: 'Buy Credits',
      ctaDisabled: false,
      creditsToAdd: 500,
    },
    {
      id: 'pro',
      name: 'Placement Pro',
      tagline: 'Most chosen by final-year students',
      price: '₹249',
      period: 'placement season',
      creditsIncluded: '2,000 Forge Credits',
      popular: true,
      isCurrent: true,
      features: [
        '2,000 Forge Credits',
        'Unlimited Mock Interview Rounds',
        'Priority Recruiter ATS Keyword Matches',
        'Monaco Code Execution Runner',
        'Detailed 8-Dimension Rubric Reports',
        '1-Click PDF Resume Export',
      ],
      ctaText: 'Active Current Plan',
      ctaDisabled: true,
      creditsToAdd: 2000,
    },
    {
      id: 'premium',
      name: 'Tier-1 Accelerator',
      tagline: 'Tailored for 20+ LPA product hiring',
      price: '₹499',
      period: 'complete package',
      creditsIncluded: '5,000 Forge Credits',
      popular: false,
      isCurrent: false,
      features: [
        '5,000 Forge Credits',
        'Dedicated FAANG/Tier-1 Rubrics',
        'System Design Interactive Evaluator',
        'Fast-Track AI Model Generation',
        'Unlimited PDF Document Downloads',
        'Priority Mock Refills',
      ],
      ctaText: 'Upgrade to Accelerator',
      ctaDisabled: false,
      creditsToAdd: 5000,
    },
  ]

  const TRANSACTIONS = [
    { id: 'tx_901', date: 'Sep 24, 2026', desc: 'Placement Pro Season Bundle', amount: '₹249', credits: '+2,000', status: 'Completed' },
    { id: 'tx_902', date: 'Sep 18, 2026', desc: 'Starter Credit Top-Up', amount: '₹99', credits: '+500', status: 'Completed' },
    { id: 'tx_903', date: 'Sep 10, 2026', desc: 'Campus Onboarding Grant', amount: '₹0', credits: '+1,500', status: 'Granted' },
  ]

  const USAGE_BREAKDOWN = [
    { activity: 'AI Interview Simulations', credits: '120 credits', sessions: '6 sessions conducted (20 credits/round)' },
    { activity: 'Resume ATS Analysis & Scans', credits: '50 credits', sessions: '5 detailed ATS diagnostic scans' },
    { activity: 'Roadmap Generation & Calibrations', credits: '80 credits', sessions: '4 package roadmap calibrations' },
  ]

  const handlePurchase = () => {
    if (!checkoutModal) return
    setPurchasing(true)
    setTimeout(() => {
      setPurchasing(false)
      addCredits(checkoutModal.creditsToAdd)
      toast.show(
        `Mock Payment Successful! Added ${checkoutModal.creditsToAdd} Forge Credits.`,
        { type: 'success' }
      )
      setCheckoutModal(null)
    }, 700)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <PageHeader
        title="Credits & Placement Packs"
        subtitle="Manage your Forge Credits, monitor simulation consumption, and upgrade your placement tier."
        breadcrumbs={['Account', 'Credits & Billing']}
        badge={<Badge variant="accent" dot>Demo Payment Gateway</Badge>}
        action={
          <PrimaryButton
            icon={Zap}
            onClick={() => setCheckoutModal(PLANS[1])}
          >
            Buy Forge Credits
          </PrimaryButton>
        }
      />

      {/* ── TOP CREDITS STATS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Main Balance */}
        <DarkCard className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A0A0A0]">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <Coins className="w-4 h-4 text-[#D95B14]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold tracking-tight text-white tabular-nums">
              {currentCredits.toLocaleString()}
            </span>
            <span className="text-xs text-[#8E8E8E] block mt-1 font-mono">
              Forge Credits
            </span>
          </div>
          <p className="text-[11px] text-[#A0A0A0] mt-4 pt-3 border-t border-[#2A2A28]">
            Valid through 2026 Campus Placement Drives.
          </p>
        </DarkCard>

        {/* Current Active Plan */}
        <LightCard className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Active Plan
            </span>
            <Badge variant="accent" size="sm" dot>Active</Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111111]">Placement Pro</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">
              Full unlimited access unlocked
            </p>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-4 pt-3 border-t border-[#E8E8E5]">
            Renewal: Complimentary for Capstone Demo.
          </p>
        </LightCard>

        {/* Total Consumed */}
        <LightCard className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Consumed This Month
            </span>
            <Receipt className="w-4 h-4 text-[#8E8E8A]" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#111111]">250</span>
            <span className="text-xs text-[#6B6B6B] block mt-0.5">
              Credits used across 15 actions
            </span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-4 pt-3 border-t border-[#E8E8E5]">
            120 Interview • 50 Resume • 80 Roadmap
          </p>
        </LightCard>
      </div>

      {/* ── PRICING CARDS ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#111111]">
              Placement Preparation Packs
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              All plans run in frontend demo mode. Click to simulate instant credit additions.
            </p>
          </div>
          <Badge variant="neutral" size="sm">Frontend Mock Mode</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-[16px] border flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-[#111111] text-white border-[#2A2A28] shadow-card ring-1 ring-[#D95B14]'
                  : 'bg-white text-[#111111] border-[#E8E8E5] hover:border-[#D0D0CB]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    plan.popular ? 'text-[#D95B14]' : 'text-[#6B6B6B]'
                  }`}>
                    {plan.name}
                  </span>
                  {plan.popular && <Badge variant="accent" size="sm">Recommended</Badge>}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                  <span className={`text-xs ${plan.popular ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}`}>
                    /{plan.period}
                  </span>
                </div>

                <p className={`text-xs mt-2 ${plan.popular ? 'text-zinc-300' : 'text-[#6B6B6B]'}`}>
                  {plan.tagline}
                </p>

                <div className={`mt-5 pt-4 border-t ${
                  plan.popular ? 'border-[#2A2A28]' : 'border-[#E8E8E5]'
                }`}>
                  <span className={`text-xs font-semibold block mb-3 ${
                    plan.popular ? 'text-white' : 'text-[#111111]'
                  }`}>
                    Includes:
                  </span>
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          plan.popular ? 'text-[#D95B14]' : 'text-emerald-600'
                        }`} />
                        <span className={plan.popular ? 'text-zinc-300' : 'text-[#6B6B6B]'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                {plan.isCurrent ? (
                  <SecondaryButton
                    disabled
                    className="w-full bg-white/10 text-white border-white/20"
                  >
                    Current Plan
                  </SecondaryButton>
                ) : (
                  <PrimaryButton
                    className={`w-full ${
                      plan.popular
                        ? 'bg-[#D95B14] hover:bg-[#BF4D0C] text-white'
                        : 'bg-[#111111] hover:bg-[#222222] text-white'
                    }`}
                    onClick={() => setCheckoutModal(plan)}
                    disabled={plan.ctaDisabled}
                  >
                    {plan.ctaText}
                  </PrimaryButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREDIT USAGE BREAKDOWN ── */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-[#111111]">
          Credit Usage Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {USAGE_BREAKDOWN.map((item, idx) => (
            <LightCard key={idx} className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#111111]">{item.activity}</span>
                <span className="font-mono font-bold text-[#D95B14]">{item.credits}</span>
              </div>
              <p className="text-xs text-[#6B6B6B]">{item.sessions}</p>
            </LightCard>
          ))}
        </div>
      </section>

      {/* ── TRANSACTION HISTORY TABLE ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#111111]">
            Transaction History
          </h3>
          <span className="text-xs text-[#6B6B6B]">3 recent records</span>
        </div>

        <LightCard className="p-0 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF9] text-[#6B6B6B]">
                <th className="p-3.5 font-semibold">Reference ID</th>
                <th className="p-3.5 font-semibold">Date</th>
                <th className="p-3.5 font-semibold">Description</th>
                <th className="p-3.5 font-semibold">Amount</th>
                <th className="p-3.5 font-semibold">Credits</th>
                <th className="p-3.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5] text-[#111111]">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="p-3.5 font-mono text-[11px] text-[#6B6B6B]">{tx.id}</td>
                  <td className="p-3.5 text-[#6B6B6B]">{tx.date}</td>
                  <td className="p-3.5 font-medium">{tx.desc}</td>
                  <td className="p-3.5 font-semibold">{tx.amount}</td>
                  <td className="p-3.5 font-semibold text-emerald-600">{tx.credits}</td>
                  <td className="p-3.5 text-right">
                    <Badge variant="success" size="sm">{tx.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </LightCard>
      </section>

      {/* ── MOCK CHECKOUT MODAL ── */}
      {checkoutModal && (
        <Modal
          isOpen={Boolean(checkoutModal)}
          onClose={() => setCheckoutModal(null)}
          title="Simulate Credit Purchase"
          description={`Confirm purchase of ${checkoutModal.name} (${checkoutModal.creditsIncluded})`}
          footer={
            <>
              <SecondaryButton onClick={() => setCheckoutModal(null)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                isLoading={purchasing}
                onClick={handlePurchase}
              >
                Confirm Mock Payment ({checkoutModal.price})
              </PrimaryButton>
            </>
          }
        >
          <div className="space-y-4 text-xs text-[#111111]">
            <div className="p-4 rounded-[12px] bg-[#F4F4F1] border border-[#E8E8E5] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Selected Plan:</span>
                <span className="font-semibold text-[#111111]">{checkoutModal.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Credits to Add:</span>
                <span className="font-semibold text-emerald-700">+{checkoutModal.creditsToAdd} Forge Credits</span>
              </div>
              <div className="flex justify-between border-t border-[#E8E8E5] pt-2 font-semibold">
                <span>Total Amount:</span>
                <span className="text-sm">{checkoutModal.price} (Mock)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8E8E8A]">
              This simulation executes a purely client-side purchase flow and updates your local user session credits immediately. No real card will be charged.
            </p>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default BillingPage
