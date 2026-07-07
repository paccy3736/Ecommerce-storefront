import { create } from 'zustand'

interface UIStore {
  isGlobalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  isGlobalLoading: false,
  setGlobalLoading: (loading: boolean) => set({ isGlobalLoading: loading }),
}))
