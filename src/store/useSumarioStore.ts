import { create } from 'zustand'
import type { Sumario } from '../types'

interface SumarioStore {
  sumarios: Sumario[]
  activeSumarioId: string | null
  setActiveSumario: (id: string) => void
}

export const useSumarioStore = create<SumarioStore>((set) => ({
  sumarios: [],
  activeSumarioId: null,
  setActiveSumario: (id) => set({ activeSumarioId: id }),
}))
