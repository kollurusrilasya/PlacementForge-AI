# Placement Forge AI

> **"Forge Your Path. Crack Your Placement."**  
> *An AI-Powered Placement Command Center for College Students.*

---

## Overview

**Placement Forge AI** is a production-grade, human-designed web platform engineered to help university students systematically conquer campus placement drives.

Unlike generic AI SaaS dashboards, Placement Forge AI is built upon an intentional, minimal design system (`#FAFAF9` warm background, `#111111` typography, and `#D95B14` forge amber accent) that prioritizes clarity, focus, and measurable preparation.

---

## Core Capabilities

1. **Placement Command Center (`/dashboard`)**:
   - Multi-dimensional Placement Readiness Index (72%).
   - 7-Factor Competency Radar (`Recharts`): Resume, DSA, Core CS, Communication, Projects, Interview, and Problem Solving.
   - Algorithmic daily recommendations and active goal tracker (Software Engineer @ 12 LPA).

2. **9-Section ATS Resume Builder (`/resume`)**:
   - Dual-pane live preview with 3 ATS-calibrated templates: *Classic ATS*, *Modern ATS*, and *Minimal*.
   - Live completeness scoring (82%) with missing recommendation alerts.
   - Client-side PDF print stylesheet (`window.print()`) and `localStorage` persistence.

3. **ATS Resume Scorer & Diagnostic (`/resume/scorer`)**:
   - 4-step progressive scanner analyzing keyword density, metrics quantification, and formatting.
   - Overall score (82/100) with 6-category rubric breakdown.
   - Score history progression chart (68 → 82 → 90 target).
   - Before/After rewrite suggestions converting vague responsibilities into quantified achievements.

4. **AI Interview Studio (`/interview/setup` & `/interview/session`)**:
   - Three simulation modes: **Technical**, **Coding**, and **HR / Culture Fit**.
   - Video avatar interviewers (*Sarah* & *David*) with speech synthesis playback.
   - Live **Monaco Code Editor** with multi-language support (JavaScript, Python, C++, Java) and test runner.
   - Speech-to-text recording simulation, question progress bar, countdown timer, and pause/exit modal.

5. **Diagnostic Performance Report (`/interview/report`)**:
   - Animated 78/100 composite score with hiring rubric breakdown.
   - 8-Dimension Competency Radar (Correctness, Communication, Clarity, Problem Solving, Technical Knowledge, Relevance, Efficiency, Confidence).
   - Question-by-question comparative analysis against benchmark ideal answers.

6. **11-Module Career Roadmap (`/roadmap`)**:
   - 12-week structured curriculum calibrated to 6, 10, 12, 15, and 20+ LPA compensation brackets.
   - Interactive completion checklists, topic breakdowns, curated resources, and practice questions.
   - Daily recommended tasks and roadmap history.

7. **Credits & Placement Packs (`/billing`)**:
   - Preloaded with **3,590 Forge Credits** for complete offline demo testing.
   - Plan comparison (Free Campus, Starter Sprint, Placement Pro, Tier-1 Accelerator).
   - Interactive client-side checkout simulation and detailed transaction history.

---

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` and `@theme` design tokens)
- **Routing**: React Router v7 with `React.lazy()` route chunking
- **Code Editor**: Monaco Code Editor (`@monaco-editor/react`)
- **Visualizations**: Recharts (`RadarChart`, `LineChart`)
- **Icons**: Lucide React
- **Typography**: Inter (Google Fonts)
- **State & Services**: React Context (`UserContext`, `ToastContext`) + Promise-based mock services

---

## Project Structure

```text
Placement-Forge-AI/
├── public/
│   ├── favicon.svg          # Geometric forge favicon
│   ├── logo.png             # Application logo
│   └── _redirects           # Netlify SPA redirect rule
├── src/
│   ├── assets/
│   │   ├── female-ai.mp4    # Female AI interviewer video avatar
│   │   ├── male-ai.mp4      # Male AI interviewer video avatar
│   │   └── logo.png
│   ├── components/
│   │   ├── common/          # 14 Reusable Master Design System components
│   │   │   ├── Button.jsx   # Primary, Secondary, Ghost, Dark, Accent
│   │   │   ├── Card.jsx     # LightCard, DarkCard, StatCard, FeatureCard
│   │   │   ├── Headers.jsx  # PageHeader, SectionHeader
│   │   │   ├── Badge.jsx    # Status pills & ProgressIndicator
│   │   │   ├── Modal.jsx    # Accessible dialog with backdrop blur
│   │   │   ├── Dropdown.jsx # Click-outside accessible dropdown
│   │   │   ├── Toast.jsx    # Non-intrusive floating feedback
│   │   │   ├── Skeleton.jsx # Pulsing placeholder cards
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Input.jsx    # Input & Select with top labels
│   │   │   ├── BrandLogo.jsx# Vector anvil + amber spark logo
│   │   │   └── AuthModal.jsx# Mock login/register modal
│   │   ├── layout/
│   │   │   ├── AppShell.jsx # Global layout container
│   │   │   ├── Sidebar.jsx  # Collapsible desktop rail & mobile drawer
│   │   │   └── Header.jsx   # Top status bar with credits & user avatar
│   │   ├── resume/
│   │   │   ├── ClassicAtsTemplate.jsx
│   │   │   ├── ModernAtsTemplate.jsx
│   │   │   └── ResumePreview.jsx
│   │   ├── dashboard/
│   │   ├── interview/
│   │   ├── roadmap/
│   │   └── billing/
│   ├── context/
│   │   ├── UserContext.jsx  # Student profile & local persistence
│   │   └── ToastContext.jsx # Global toast notification trigger
│   ├── data/
│   │   ├── mockUser.js      # Seeded student profile (Sampath Srinivas)
│   │   ├── mockResume.js    # Pre-filled realistic SDE resume
│   │   ├── mockInterviews.js# Simulation records & scores
│   │   └── mockRoadmap.js   # 11-module curriculum data
│   ├── hooks/
│   │   └── useUser.js
│   ├── pages/
│   │   ├── Home.jsx / LandingPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ResumeBuilder.jsx
│   │   ├── ResumeScorer.jsx
│   │   ├── InterviewSetup.jsx
│   │   ├── InterviewSession.jsx
│   │   ├── InterviewReport.jsx
│   │   ├── Roadmap.jsx
│   │   ├── Billing.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   └── DesignSystemPage.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx    # Code-split route declarations
│   ├── services/
│   │   └── mock/            # Clean Promise-based mock services
│   │       ├── userService.js
│   │       ├── resumeService.js
│   │       ├── interviewService.js
│   │       ├── roadmapService.js
│   │       └── billingService.js
│   ├── utils/
│   │   └── cn.js            # Tailwind merge utility
│   ├── App.jsx
│   ├── index.css            # Tailwind theme tokens & scrollbar
│   └── main.jsx
├── vercel.json              # Vercel SPA rewrites
├── netlify.toml             # Netlify build & redirect rules
├── package.json
├── vite.config.js
└── README.md
```

---

## Local Setup

### 1. Prerequisites
- **Node.js**: v18.0 or later (Tested on Node v24)
- **npm**: v9 or later

### 2. Installation
```bash
# Clone or navigate to the repository directory
cd "d:/Projects/Placement Forge AI"

# Install all dependencies
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Production Build
```bash
npm run build
```
Build output is generated into the `dist/` directory.

### 5. Lint & Code Quality Audit
```bash
npm run lint
# or
npx oxlint
```

---

## Environment Variables

**No environment variables or API keys are required.**  
The platform operates 100% offline in preview mode using clean mock services and `localStorage`.

---

## Deployment Instructions

### Vercel Deployment
1. Connect your Git repository to [Vercel](https://vercel.com).
2. Set **Framework Preset** to `Vite`.
3. The included `vercel.json` automatically configures SPA routing (`/* -> /index.html`) to ensure hard-refreshes on routes like `/dashboard` and `/resume` resolve without 404 errors.

### Netlify Deployment
1. Connect your repository to [Netlify](https://netlify.com).
2. Set **Build command** to `npm run build` and **Publish directory** to `dist`.
3. The included `netlify.toml` and `public/_redirects` guarantee correct SPA rewrites.

---

## Future Backend Integration Architecture

All frontend modules communicate through the isolated `src/services/mock/` layer:

```text
Component UI
    ↓
src/services/mock/* (userService, resumeService, interviewService, roadmapService, billingService)
    ↓
Future Backend REST Endpoints:
  - POST /api/auth/login
  - GET  /api/user/profile
  - POST /api/resume/scan
  - POST /api/interview/start
  - POST /api/interview/answer
  - POST /api/roadmap/generate
  - POST /api/billing/create-order (Razorpay)
```

To transition to a live backend, replace the Promise resolutions inside `src/services/` with Axios/Fetch calls. The UI and component contracts will remain 100% unchanged.

---

## Capstone Evaluator Walkthrough

For evaluating the project, follow this recommended journey:
1. **Landing Page (`/`)**: Review the design aesthetic and click **"Start Preparing"** or **"Explore Demo Mode"**.
2. **Dashboard (`/dashboard`)**: Observe the seeded readiness metrics, Radar chart, and the **Capstone Demo Tour Banner**.
3. **Resume Builder (`/resume`)**: Review the 9-section form, toggle templates (*Classic ATS*, *Modern ATS*, *Minimal*), and test **Download PDF**.
4. **Resume Scorer (`/resume/scorer`)**: Run a diagnostic scan to see the 4-step progressive scanner, ATS score of 82/100, and Before/After rewrite suggestions.
5. **AI Interview Studio (`/interview/setup`)**: Launch a simulation room to see the video avatar player, speech simulation, and Monaco code editor.
6. **Diagnostic Report (`/interview/report`)**: Review the animated 78/100 score, 8-dimension radar chart, and benchmark ideal answers.
7. **Career Roadmap (`/roadmap`)**: Inspect the 11-module curriculum, mark tasks as complete, and view dynamic progress recalculations.
8. **Billing & Credits (`/billing`)**: Inspect the 3,590 Forge Credits balance and simulate a mock top-up.

---

*Placement Forge AI — Forge Your Path. Crack Your Placement.*
