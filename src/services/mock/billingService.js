const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const billingService = {
  async getBalance() {
    await delay(150)
    try {
      const saved = localStorage.getItem('placement_forge_user')
      if (saved) {
        const u = JSON.parse(saved)
        return u.credits || 3590
      }
    } catch {
      // fallback
    }
    return 3590
  },

  async mockPurchase(planId, creditsToAdd) {
    await delay(400)
    try {
      const saved = localStorage.getItem('placement_forge_user')
      if (saved) {
        const u = JSON.parse(saved)
        u.credits = (u.credits || 3590) + creditsToAdd
        localStorage.setItem('placement_forge_user', JSON.stringify(u))
        return { success: true, newBalance: u.credits }
      }
    } catch {
      // fallback
    }
    return { success: true, newBalance: 3590 + creditsToAdd }
  },
}

export default billingService
