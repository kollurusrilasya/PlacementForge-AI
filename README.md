# PlacementForge AI

> **Forge Your Path. Crack Your Placement.**

An AI-assisted placement preparation platform designed to help students prepare for campus recruitment through resume analysis, skill-gap identification, personalized learning roadmaps, and AI-powered mock interviews.

**Live Demo:** https://placementforge-lemon.vercel.app

**GitHub Repository:** https://github.com/kollurusrilasya/PlacementForge-AI

**Backend:** https://placementforge-ai-backend.onrender.com

## 1. Project Overview

PlacementForge AI is a full-stack web application that brings multiple placement preparation tools together in one platform.

Students can create resumes, upload PDF resumes for ATS analysis, identify missing skills based on their target job role, generate learning roadmaps, and practice technical, coding, and HR interviews with AI-assisted evaluation.

The application uses React for the frontend, Node.js and Express for backend services, MongoDB Atlas for data storage, and the Groq API for AI interview question generation and evaluation.

## 2. Key Features

### User Authentication
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected application routes.
- User profile management.

### Resume Builder
- Create and edit structured resumes.
- Add personal information, education, skills, projects, experience, certifications, and achievements.
- Multiple resume templates.
- Live resume preview.
- Save resume data to MongoDB.
- Download or print resumes as PDF.

### ATS Resume Scanner
- Upload PDF resumes.
- Extract resume text using PDF parsing.
- Identify relevant skills from resume content.
- Calculate role-based ATS scores.
- Display category-wise scoring and improvement suggestions.
- Maintain ATS score history.
- Support PDF resumes and Resume Builder data.

### Skill Management and Gap Analysis
- Add, update, view, and delete skills.
- Select target job roles and salary packages.
- Compare existing skills with job-role requirements.
- Identify missing skills and improvement areas.

### Personalized Career Roadmap
- Generate learning steps based on identified skill gaps.
- Provide learning topics, resources, and practice questions.
- Support structured placement preparation.

### AI Interview Studio
- Technical, coding, and HR interview modes.
- Configurable interview difficulty and question count.
- AI-generated interview questions using Groq.
- Answer evaluation with scores and feedback.
- Strengths, improvement suggestions, and ideal answers.
- Interview history and performance reports.

### Dashboard
- Placement preparation overview.
- ATS score and progress history.
- Skill-gap insights.
- Target role and package information.
- Preparation progress indicators.

**Note:** Billing and credits interfaces include demonstration-oriented functionality. No real payments are processed.

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt |
| Resume Processing | Multer, pdf-parse |
| AI Integration | Groq API |
| Charts | Recharts |
| Code Editor | Monaco Editor |
| Deployment | Vercel, Render |

## 4. System Architecture

```text
              USER
                |
                v
       React + Vite Frontend
             (Vercel)
                |
                | REST API + JWT
                v
       Node.js + Express Backend
              (Render)
                |
       +--------+---------+
       |        |         |
       v        v         v
    MongoDB   Resume    Groq API
     Atlas    Parser    AI Interview
              & ATS     Generation
              Analysis  & Evaluation
```

## 5. Project Structure

```text
PlacementForge-AI/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── Interview.js
│   │   ├── resume.js
│   │   ├── ATSScore.js
│   │   ├── TargetRole.js
│   │   ├── SkillGap.js
│   │   ├── ExtractedSkill.js
│   │   └── Roadmap.js
│   ├── services/
│   │   └── geminiService.js
│   ├── utils/
│   │   ├── atsScorer.js
│   │   └── resumeParser.js
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 6. Installation and Setup

### Prerequisites
- Node.js 18 or later.
- npm.
- MongoDB Atlas account.
- Groq API key.

### Step 1: Clone the Repository

```bash
git clone https://github.com/kollurusrilasya/PlacementForge-AI.git
cd PlacementForge-AI
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Keep these credentials private. Never commit environment files to GitHub.

### Step 4: Start the Backend

From the backend directory:

```bash
npm start
```

Backend URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### Step 5: Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

### Step 6: Build the Frontend

```bash
npm run build
```

Run the lint command:

```bash
npm run lint
```

## 7. Main Backend API Endpoints

Protected endpoints require a JWT token in the Authorization header.

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET / PUT | `/api/profile` | Fetch or update profile |
| GET / POST / PUT / DELETE | `/api/skills` | Manage skills |
| POST | `/api/resume/upload` | Upload PDF resume |
| GET | `/api/resume/text` | Extract resume text |
| POST | `/api/resume/extract-skills` | Extract resume skills |
| GET / PUT | `/api/resume/builder` | Manage Resume Builder data |
| POST | `/api/ats/score` | Calculate ATS score |
| GET | `/api/ats/dashboard-score` | Fetch dashboard ATS score |
| GET | `/api/resume/score-history` | Fetch ATS score history |
| GET / POST | `/api/target-role` | Manage target role |
| GET | `/api/skill-gap` | Analyze missing skills |
| GET | `/api/roadmap` | Generate roadmap |
| GET / POST | `/api/interviews` | Fetch or create interviews |
| GET | `/api/interviews/:id` | Fetch interview details |
| PUT | `/api/interviews/:id/answers` | Save interview answers |
| PUT | `/api/interviews/:id/complete` | Complete interview |

## 8. Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

The frontend uses the `VITE_API_URL` environment variable to communicate with the backend.

The backend uses environment variables for MongoDB connectivity, JWT authentication, and Groq API integration.

## 9. Security and Future Improvements

- Continue strengthening authentication and session handling.
- Add stricter PDF validation and upload size limits.
- Use private authenticated access for uploaded resumes.
- Move resume files to persistent object storage.
- Expand ATS evaluation and role-specific skill matching.
- Add automated frontend and backend testing.
- Improve monitoring and error handling.

**Storage note:** The current Render deployment uses local upload storage. Render's ephemeral filesystem is not guaranteed to retain files after instance replacement or restart. Persistent object storage is recommended for long-term resume retention.

## 10. Project Status

PlacementForge AI is a deployed full-stack academic capstone project. Its core application workflows have been implemented and tested by the project team.

The platform demonstrates the integration of full-stack web development, database management, resume parsing, ATS analysis, skill-gap analysis, and AI-assisted interview evaluation.

## Contributors

Developed as a collaborative capstone project.

---

**PlacementForge AI — Forge Your Path. Crack Your Placement.**
