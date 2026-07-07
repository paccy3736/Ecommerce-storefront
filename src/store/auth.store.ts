import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginRequest, RegisterRequest } from '../types'

interface AuthStoreState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthStoreActions {
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  fetchProfile: () => Promise<void>
  clearError: () => void
}

type FullAuthStore = AuthStoreState & AuthStoreActions

export const useAuthStore = create<FullAuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null })
        try {
          // Lazy import to avoid circular dependency with client.ts
          const { login: loginApi } = await import('../api/auth.api')
          const response = await loginApi(data)
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false })
          throw err
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null })
        try {
          const { register: registerApi } = await import('../api/auth.api')
          const response = await registerApi(data)
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false })
          throw err
        }
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false, error: null })
      },

      fetchProfile: async () => {
        if (!get().token) return
        try {
          const { getMe } = await import('../api/auth.api')
          const user = await getMe()
          set({ user })
        } catch {
          get().logout()
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'ecomus_auth_token',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true
        }
      },
    }
  )
)
