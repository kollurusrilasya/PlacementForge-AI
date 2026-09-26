import { INITIAL_RESUME_DATA } from '../../data/initialMockData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const STORAGE_KEY = 'placement_forge_resume'

export const resumeService = {
  async getResume() {
    await delay(200)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_RESUME_DATA
    } catch {
      return INITIAL_RESUME_DATA
    }
  },

  async saveResume(resumeData) {
    await delay(350)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
    return { success: true, data: resumeData }
  },

  async scoreResume(resumeData = null) {
    await delay(500)
    const current = resumeData || (await this.getResume())
    return {
      overallScore: 84,
      atsCompatibility: 91,
      impactMetricsScore: 78,
      readabilityScore: 88,
      keywordMatch: 80,
      strengths: [
        'Strong quantifiable achievements with metrics (e.g. 34% load time reduction)',
        'Concise, high-impact summary directly aligned with Software Engineer role',
        'Clean ATS-friendly chronology and standardized degree naming',
      ],
      improvements: [
        'Consider integrating more cloud architecture keywords (AWS, CI/CD, K8s)',
        'Add links to live demo deployments for personal projects',
        'Elaborate on database optimization details in the project section',
      ],
      missingKeywords: ['Docker Compose', 'Redis', 'CI/CD Pipelines', 'TypeScript'],
      analyzedAt: new Date().toISOString(),
    }
  },
}

export default resumeService
