import { create } from 'zustand'

export const useAppStore = create((set) => ({
  // Navigation
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // API-backed data
  stats: {
    accounts: 0,
    activeListings: 0,
    drafts: 0,
    totalTasks: 0,
    jobsRunning: 0,
    completedTasks: 0,
  },
  setStats: (stats) => set({ stats }),

  auth: {
    user: null,
    loading: false,
    error: null,
  },
  setAuth: (auth) => set({ auth }),

  selectedAccountIds: [],
  setSelectedAccountIds: (ids) => set({ selectedAccountIds: ids }),

  settings: {
    defaultDelayMin: 30,
    defaultDelayMax: 90,
    maxListingsPerRun: 100,
    autoRetry: true,
    safeMode: true,
    backendUrl: 'http://localhost:8000',
  },
  setSettings: (settings) => set({ settings }),
}))
