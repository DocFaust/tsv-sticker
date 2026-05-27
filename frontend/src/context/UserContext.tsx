import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserResponse } from '../api/types'

const STORAGE_KEY = 'tsv_sticker_user'

interface UserContextType {
  user: UserResponse | null
  setUser: (u: UserResponse | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserResponse | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as UserResponse) : null
    } catch {
      return null
    }
  })

  const setUser = (u: UserResponse | null) => {
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setUserState(u)
  }

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
