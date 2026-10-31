
import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_USER } from '../data/initialMockData'
import { apiRequest } from '../services/api'

const UserContext = createContext(null)

const STORAGE_KEY = 'placement_forge_user'
const TOKEN_KEY = 'placement_forge_token'

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_USER
    } catch {
      return INITIAL_USER
    }
  })

  // Fetch actual logged-in user from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem(TOKEN_KEY)

      if (!token) return

      try {
        const data = await apiRequest('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUser((prev) => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
        }))
      } catch (error) {
        console.error('Failed to fetch profile:', error.message)
      }
    }

    fetchProfile()
  }, [])

  // Save user information in localStorage
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

    setUser((prev) => ({
      ...prev,
      credits: prev.credits - amount,
    }))

    return true
  }

  const addCredits = (amount) => {
    setUser((prev) => ({
      ...prev,
      credits: prev.credits + amount,
    }))
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, updateUser, spendCredits, addCredits }}
    >
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
