const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const DEFAULT_ROADMAP = {
  role: 'Software Engineer',
  targetPackage: '12-20 LPA',
  estimatedWeeks: 12,
  modules: [
    {
      week: 'Weeks 1–3',
      title: 'Core DSA Foundations & Complexity',
      description: 'Arrays, Two Pointers, Sliding Window, HashMaps, and Binary Search.',
      status: 'completed',
      completionRate: 100,
      tasks: [
        'Master Two Pointer & Fast-Slow pointer patterns',
        'Solve 25 classic sliding window problems',
        'Implement HashMap collision handling concepts',
      ],
    },
    {
      week: 'Weeks 4–6',
      title: 'Trees, Graphs & Dynamic Programming',
      description: 'Binary Trees, BST, BFS/DFS traversals, and Memoization patterns.',
      status: 'in-progress',
      completionRate: 65,
      tasks: [
        'Tree traversals (Iterative & Recursive)',
        'Graph cycle detection & topological sort',
        '0/1 Knapsack and Longest Common Subsequence variants',
      ],
    },
    {
      week: 'Weeks 7–9',
      title: 'Low-Level Design & System Architecture',
      description: 'Object-Oriented Design, SOLID principles, schema design & caching.',
      status: 'pending',
      completionRate: 20,
      tasks: [
        'Design Parking Lot / LRU Cache',
        'Database indexing & sharding fundamentals',
        'Rate limiting algorithms (Token Bucket, Leaky Bucket)',
      ],
    },
    {
      week: 'Weeks 10–12',
      title: 'Mock Interviews & Behavioral Polish',
      description: 'Timed live coding rounds, behavioral STAR stories, and resume review.',
      status: 'pending',
      completionRate: 0,
      tasks: [
        'Complete 5 technical mock interviews with AI',
        'Record 3 behavioral response videos',
        'Finalize ATS resume alignment with target companies',
      ],
    },
  ],
}

export const roadmapService = {
  async getActiveRoadmap() {
    await delay(250)
    return DEFAULT_ROADMAP
  },

  async generateRoadmap(role, targetPackage) {
    await delay(500)
    return {
      ...DEFAULT_ROADMAP,
      role: role || DEFAULT_ROADMAP.role,
      targetPackage: targetPackage || DEFAULT_ROADMAP.targetPackage,
    }
  },
}

export default roadmapService
