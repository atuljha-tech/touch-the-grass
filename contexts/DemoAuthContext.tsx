"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type DemoUser, DEMO_USERS } from '@/lib/demo/data'

interface DemoAuthContextValue {
  user: DemoUser | null
  login: (user: DemoUser) => void
  logout: () => void
}

const DemoAuthContext = createContext<DemoAuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ttg_demo_user')
      if (stored) setUser(JSON.parse(stored))
      // No auto-login — let users choose their role
    } catch {
      // ignore
    }
  }, [])

  function login(u: DemoUser) {
    setUser(u)
    localStorage.setItem('ttg_demo_user', JSON.stringify(u))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('ttg_demo_user')
  }

  return (
    <DemoAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </DemoAuthContext.Provider>
  )
}

export function useDemoAuth() {
  return useContext(DemoAuthContext)
}
