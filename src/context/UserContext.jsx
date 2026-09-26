import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_USER } from '../data/initialMockData'

const UserContext = createContext(null)

const STORAGE_KEY = 'placement_forge_user'

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_USER
    } catch {
      return INITIAL_USER
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } catch {
      // ignore write errors
    }
  }, [user])

  const updateUser = (fields) => {
    setUser((prev) => ({ ...prev, ...fields }))
  }

  const spendCredits = (amount) => {
    if (user.credits < amount) return false
    setUser((prev) => ({ ...prev, credits: prev.credits - amount }))
    return true
  }

  const addCredits = (amount) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }))
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, spendCredits, addCredits }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext
