import { INITIAL_USER } from '../../data/initialMockData'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const userService = {
  async getCurrentUser() {
    await delay(180)
    try {
      const saved = localStorage.getItem('placement_forge_user')
      return saved ? JSON.parse(saved) : INITIAL_USER
    } catch {
      return INITIAL_USER
    }
  },

  async updateProfile(updates) {
    await delay(300)
    const user = await this.getCurrentUser()
    const updated = { ...user, ...updates }
    localStorage.setItem('placement_forge_user', JSON.stringify(updated))
    return updated
  },

  async getPlacementReadiness() {
    await delay(200)
    const user = await this.getCurrentUser()
    return {
      score: user.placementReadiness,
      breakdown: {
        dsa: 76,
        resume: 82,
        interviews: 65,
        systemDesign: 54,
      },
    }
  },

  async useCredits(amount, reason = 'action') {
    await delay(150)
    const user = await this.getCurrentUser()
    if (user.credits < amount) {
      throw new Error('Insufficient credits')
    }
    const updated = { ...user, credits: user.credits - amount }
    localStorage.setItem('placement_forge_user', JSON.stringify(updated))
    return { success: true, remaining: updated.credits, reason }
  },
}

export default userService
