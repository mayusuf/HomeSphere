'use client'

import { create } from 'zustand'
import type { User } from '@/lib/api/users'

interface AuthStore {
  user: User | null
  role: 'USER' | 'ADMIN' | null
  userId: string | null
  login: (user: User) => void
  logout: () => void
  setUser: (user: User | null) => void
  setUserId: (userId: string | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  role: null,
  userId: null,
  login: (user) => set({ user, role: user.role, userId: user.user_id }),
  logout: () => set({ user: null, role: null, userId: null }),
  setUser: (user) => set({ user, role: user?.role ?? null, userId: user?.user_id ?? null }),
  setUserId: (userId) => set({ userId }),
}))
