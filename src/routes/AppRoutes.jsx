import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'

// Lazy-loaded pages for optimal chunking & fast initial load
const LandingPage = lazy(() => import('../pages/LandingPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const ResumeBuilderPage = lazy(() => import('../pages/ResumeBuilderPage'))
const ResumeScorerPage = lazy(() => import('../pages/ResumeScorerPage'))
const InterviewHubPage = lazy(() => import('../pages/InterviewHubPage'))
const InterviewSetupPage = lazy(() => import('../pages/InterviewSetupPage'))
const InterviewSessionPage = lazy(() => import('../pages/InterviewSessionPage'))
const InterviewReportPage = lazy(() => import('../pages/InterviewReportPage'))
const RoadmapPage = lazy(() => import('../pages/RoadmapPage'))
const BillingPage = lazy(() => import('../pages/BillingPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))
const DesignSystemPage = lazy(() => import('../pages/DesignSystemPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

// Elegant minimal loading fallback
function PageFallback() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center space-y-3">
      <div className="w-6 h-6 rounded-full border-2 border-[#111111]/20 border-t-[#D95B14] animate-spin" />
      <span className="text-xs font-mono text-[#6B6B6B]">Loading placement module...</span>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Standalone Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authenticated Platform Routes inside AppShell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/resume" element={<ResumeBuilderPage />} />
          <Route path="/resume/scorer" element={<ResumeScorerPage />} />
          <Route path="/interview" element={<InterviewHubPage />} />
          <Route path="/interview/setup" element={<InterviewSetupPage />} />
          <Route path="/interview/session" element={<InterviewSessionPage />} />
          <Route path="/interview/report" element={<InterviewReportPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
