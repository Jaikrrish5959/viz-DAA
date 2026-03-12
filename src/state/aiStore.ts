import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AIState {
    apiKey: string | null;
    isTyping: boolean;
    setApiKey: (key: string | null) => void;
    setIsTyping: (typing: boolean) => void;
}

export const useAIStore = create<AIState>()(
    persist(
        (set) => ({
            apiKey: null,
            isTyping: false,
            setApiKey: (key) => set({ apiKey: key }),
            setIsTyping: (typing) => set({ isTyping: typing }),
        }),
        {
            name: 'daa-ai-tutor-storage',
            partialize: (state) => ({ apiKey: state.apiKey }), // Only persist API key
        }
    )
);
