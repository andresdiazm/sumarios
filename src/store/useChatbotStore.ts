import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: { label: string; type: 'cgr' | 'suseso' | 'tribunal' | 'ley' | 'otro' }[]
  timestamp: Date
}

interface ChatbotStore {
  isOpen: boolean
  messages: ChatMessage[]
  toggle: () => void
  open: () => void
  close: () => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  isOpen: false,
  messages: [],
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: Math.random().toString(36).slice(2), timestamp: new Date() },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
}))
