"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/auth-utils"

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  darkMode: boolean
  toggleDarkMode: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("hotel-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("hotel-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("hotel-user")
    }
  }, [user])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <AppContext.Provider value={{ user, setUser, isLoading, darkMode, toggleDarkMode }}>{children}</AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

