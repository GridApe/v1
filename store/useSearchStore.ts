import { create } from 'zustand'

interface SearchState {
  query: string
  results: any[]
  isSearching: boolean
  setQuery: (query: string) => void
  setResults: (results: any[]) => void
  setIsSearching: (isSearching: boolean) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  isSearching: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setIsSearching: (isSearching) => set({ isSearching }),
}))