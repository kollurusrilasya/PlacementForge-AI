export const mockResume = {
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
  certifications: [
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2025',
    },
  ],
  achievements: [
    'Top 3% rank among 40,000+ candidates in National Coding Olympiad 2025',
    'Finalist in Smart India Hackathon 2025 among 1,200+ teams',
  ],
  codingProfiles: {
    leetcode: 'sampath_s (350+ solved)',
    codeforces: 'sampath_cf (Pupil)',
    hackerrank: 'sampath_hr (5-star Problem Solving)',
  },
}

export default mockResume
