import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap?: number;
  technical_indicators?: {
    rsi: number;
    macd: number;
    volume_trend: string;
  };
  social_sentiment?: Record<string, { value: number; sentiment: string }>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AppState {
  // Token-related state
  selectedToken: string | null;
  tokens: Record<string, TokenData>;
  setSelectedToken: (token: string) => void;
  updateTokenData: (token: string, data: Partial<TokenData>) => void;
  
  // UI state
  darkMode: boolean;
  collapsed: {
    left: boolean;
    right: boolean;
  };
  activeTab: 'chat' | 'chart' | 'trade' | 'bot';
  setActiveTab: (tab: 'chat' | 'chart' | 'trade' | 'bot') => void;
  toggleCollapse: (section: 'left' | 'right') => void;
  toggleDarkMode: () => void;
  
  // Chat state
  chatHistory: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Token state
      selectedToken: 'SOL',
      tokens: {},
      setSelectedToken: (token) => set({ selectedToken: token }),
      updateTokenData: (token, data) => set((state) => ({
        tokens: {
          ...state.tokens,
          [token]: {
            ...(state.tokens[token] || {}),
            ...data,
          },
        },
      })),
      
      // UI state
      darkMode: true,
      collapsed: {
        left: false,
        right: false,
      },
      activeTab: 'chat',
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleCollapse: (section) => set((state) => ({
        collapsed: {
          ...state.collapsed,
          [section]: !state.collapsed[section],
        },
      })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Chat state
      chatHistory: [
        {
          role: 'assistant',
          content: 'Welcome to TradesXBT - Your Degen Market Analyst. Ask me anything about market conditions, technical analysis, or trading strategies.',
        },
      ],
      addMessage: (message) => set((state) => ({
        chatHistory: [...state.chatHistory, message],
      })),
      clearChatHistory: () => set({
        chatHistory: [
          {
            role: 'assistant',
            content: 'Chat history cleared. How can I help you with your trading analysis today?',
          },
        ],
      }),
    }),
    {
      name: 'tradesxbt-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        chatHistory: state.chatHistory.slice(-50), // Only store last 50 messages
        selectedToken: state.selectedToken,
      }),
    }
  )
);