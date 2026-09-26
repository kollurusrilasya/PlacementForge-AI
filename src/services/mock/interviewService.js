import { INITIAL_INTERVIEW_LIST } from '../../data/initialMockData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    role: 'Frontend Engineer',
    question:
      'Explain how the React Virtual DOM diffing algorithm works, and how the "key" prop helps React optimize DOM updates.',
    hint: 'Focus on reconciliation, O(n) heuristic assumption, and node identity preservation.',
    timer: 120,
    type: 'technical',
  },
  {
    id: 'q2',
    role: 'Frontend Engineer',
    question:
      'Given an array of integer stock prices where prices[i] is the price on day i, write an efficient algorithm to determine the maximum profit achievable from a single buy-and-sell transaction.',
    hint: 'Track the running minimum price and compute potential profit at each step in O(n) time.',
    timer: 180,
    type: 'coding',
    starterCode: `function maxProfit(prices) {\n  // Your solution here\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  \n  return maxProfit;\n}`,
  },
  {
    id: 'q3',
    role: 'Frontend Engineer',
    question:
      'Describe a situation during a project where you faced a significant technical roadblock or disagreement with a teammate. How did you resolve it?',
    hint: 'Use the STAR format: Situation, Task, Action, Result.',
    timer: 90,
    type: 'behavioral',
  },
]

export const interviewService = {
  async getAllInterviews() {
    await delay(250)
    return {
      interviews: INITIAL_INTERVIEW_LIST,
      stats: {
        totalInterviews: INITIAL_INTERVIEW_LIST.length,
        totalQuestions: 18,
        completed: INITIAL_INTERVIEW_LIST.length,
        averageScore: 81,
      },
    }
  },

  async startSession(config) {
    await delay(400)
    return {
      sessionId: 'sess_' + Date.now(),
      role: config.role || 'Software Engineer',
      type: config.type || 'Technical & DSA',
      questions: SAMPLE_QUESTIONS,
      totalQuestions: SAMPLE_QUESTIONS.length,
      currentQuestionIndex: 0,
      startedAt: new Date().toISOString(),
    }
  },

  async submitAnswer(data) {
    await delay(350)
    return {
      success: true,
      feedback: {
        score: 85,
        clarity: 'High',
        technicalAccuracy: 'Very Good',
        comment:
          'Structured explanation. Correctly highlighted reconciliation heuristics and the importance of stable unique keys.',
      },
    }
  },

  async getReport(id) {
    await delay(300)
    return {
      id: id || 'int_101',
      candidateName: 'Sampath Srinivas',
      role: 'Frontend Engineer',
      score: 84,
      duration: '22 minutes',
      status: 'completed',
      categoryScores: {
        problemSolving: 85,
        technicalAccuracy: 88,
        communication: 80,
        codeEfficiency: 83,
      },
      summary:
        'The candidate exhibited strong algorithmic intuition and clear understanding of component rendering lifecycles. Communication was concise and well-paced.',
      questions: SAMPLE_QUESTIONS.map((q, idx) => ({
        ...q,
        userScore: [86, 82, 84][idx] || 80,
        feedback: 'Demonstrated solid grasp of core fundamentals.',
      })),
    }
  },
}

export default interviewService
