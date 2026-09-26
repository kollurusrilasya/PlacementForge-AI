export const INITIAL_USER = {
  id: 'usr_01h9x',
  name: 'Sampath Srinivas',
  email: 'student@example.com',
  role: 'Computer Science Student',
  targetRole: 'Software Engineer',
  targetPackage: '12 LPA',
  placementReadiness: 72,
  credits: 3590,
  college: 'National Institute of Technology',
  branch: 'Computer Science & Engineering',
  graduationYear: 2026,
  skills: [
    'Data Structures & Algorithms',
    'JavaScript',
    'React',
    'Node.js',
    'System Design',
    'SQL',
    'Problem Solving',
  ],
  stats: {
    totalInterviews: 6,
    totalQuestionsAnswered: 28,
    completedRoadmaps: 1,
    averageInterviewScore: 74,
  },
}

export const INITIAL_RESUME_DATA = {
  personalInfo: {
    name: 'Sampath Srinivas',
    email: 'sampath.srinivas@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/sampathsrinivas',
    github: 'github.com/sampathsrinivas',
  },
  summary:
    'Aspiring Software Engineer with a solid foundation in Data Structures, Algorithms, and Full-Stack Web Development. Proven experience designing scalable REST APIs and responsive user interfaces.',
  skills: [
    'JavaScript (ES6+)',
    'React.js',
    'Node.js',
    'Express',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'Git',
    'Docker',
  ],
  experience: [
    {
      id: 'exp_1',
      title: 'Full Stack Web Developer Intern',
      company: 'NexTech Labs',
      location: 'Bangalore, India',
      startDate: 'May 2025',
      endDate: 'July 2025',
      description:
        'Architected reusable component libraries in React. Reduced client dashboard load time by 34% through memoization and bundle splitting.',
    },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Placement Forge AI',
      technologies: 'React, Tailwind CSS, Web Speech API',
      description:
        'Engineered an intelligent placement simulation suite featuring automated mock interviews, resume ATS diagnostic scoring, and role roadmaps.',
    },
    {
      id: 'proj_2',
      title: 'Distributed Key-Value Store',
      technologies: 'Go, Raft Consensus, Docker',
      description:
        'Implemented a fault-tolerant replicated storage cluster adhering to Raft protocol with linearizable reads.',
    },
  ],
  education: [
    {
      id: 'edu_1',
      institution: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      year: '2022 - 2026',
      cgpa: '8.8 / 10.0',
    },
  ],
}

export const INITIAL_INTERVIEW_LIST = [
  {
    id: 'int_101',
    role: 'Frontend Engineer',
    type: 'Technical',
    date: '2026-09-24',
    duration: '24m',
    score: 82,
    status: 'completed',
    strengths: ['Clear component hierarchy explanation', 'Efficient state management design'],
    improvements: ['Could elaborate more on web performance metrics like LCP/CLS'],
  },
  {
    id: 'int_102',
    role: 'Software Development Engineer',
    type: 'DSA & Problem Solving',
    date: '2026-09-21',
    duration: '35m',
    score: 74,
    status: 'completed',
    strengths: ['Identified optimal two-pointer approach quickly'],
    improvements: ['Missed edge case for empty arrays during dry run'],
  },
  {
    id: 'int_103',
    role: 'Associate Software Engineer',
    type: 'Behavioral & HR',
    date: '2026-09-18',
    duration: '18m',
    score: 88,
    status: 'completed',
    strengths: ['Strong STAR method formatting in conflict resolution scenarios'],
    improvements: ['Keep career aspiration answers more concise'],
  },
]
