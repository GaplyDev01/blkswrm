'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat, Message } from 'ai/react';
import { CryptoCard } from '@/components/ui/crypto-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, ArrowDown, Bot, User, Wallet as WalletIcon, Settings, Info, ChevronLeft, Home } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useWalletContext } from '@/context/WalletContext';
import ModelSelector from '@/components/ModelSelector';
import { getProvider } from '@/lib/llm-providers';
import Link from 'next/link';
import PageNavigation from '@/components/PageNavigation';
import ConnectWalletButton from '@/components/ConnectWalletButton';

export default function AIChat() {
  const { connected, walletAddress } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState(getProvider('openai').defaultModel);
  const [showSettings, setShowSettings] = useState(false);
  
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "What's the current outlook for SOL?",
    "Tell me about JUP token's performance",
    "Analyze BONK token potential",
    "What are key support/resistance levels for SOL?",
    "How is the Solana DeFi ecosystem trending?",
    "What trading strategy works for volatile memecoins?"
  ]);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, stop } = useChat({
    initialMessages: [{
      id: '1',
      role: 'assistant',
      content: "👋 I'm your AI crypto trading assistant specializing in the Solana ecosystem. Ask me about SOL, JUP, BONK, or other Solana tokens for analysis, insights, and trading strategies.",
    }],
    // Pass the provider and model to the API
    body: {
      provider,
      model,
    },
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle asking a suggested question
  const handleSuggestedQuestion = (question: string) => {
    const formEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>);
    
    // Use setTimeout to ensure the input value is updated before submission
    setTimeout(() => {
      handleSubmit(formEvent);
    }, 100);
  };

  // Change provider
  const handleProviderChange = (providerId: string) => {
    setProvider(providerId);
  };

  // Change model
  const handleModelChange = (modelId: string) => {
    setModel(modelId);
  };

  // Import the wallet context hook
  const { connect, isConnecting } = useWalletContext();
  
  // Function to handle API errors
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Handle errors in the chat completion
  useEffect(() => {
    const handleError = async (error: unknown) => {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unknown error occurred while fetching the response');
      }
      
      // Clear error after 5 seconds
      setTimeout(() => setApiError(null), 5000);
    };
    
    // Listen for error events
    window.addEventListener('error-chat-completion', handleError as EventListener);
    
    return () => {
      window.removeEventListener('error-chat-completion', handleError as EventListener);
    };
  }, []);
  
  // Generate fresh suggested questions periodically
  useEffect(() => {
    const generateQuestions = () => {
      const baseQuestions = [
        "What's the current outlook for SOL?",
        "Tell me about JUP token's performance",
        "Analyze BONK token potential",
        "What are key support/resistance levels for SOL?",
        "How is the Solana DeFi ecosystem trending?",
        "What trading strategy works for volatile memecoins?",
        "Explain Solana's recent performance",
        "What is the impact of Bitcoin's trend on SOL?",
        "How does Solana compare to other L1 blockchains?",
        "What are promising new Solana projects?",
        "Explain Solana's consensus mechanism",
        "What metrics indicate a healthy Solana ecosystem?",
        "How do MEV extractors work on Solana?",
        "What's the outlook for Solana NFTs?",
        "Explain the Jupiter DEX on Solana"
      ];
      
      // Shuffle and take 6 questions
      const shuffled = [...baseQuestions].sort(() => 0.5 - Math.random());
      setSuggestedQuestions(shuffled.slice(0, 6));
    };
    
    // Generate questions initially and then every 2 hours
    generateQuestions();
    const interval = setInterval(generateQuestions, 2 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-full p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation controls */}
        <PageNavigation />
        <CryptoCard className="mb-6" variant="neon">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00FF80]/20 to-purple-500/20 rounded-xl border border-[#00FF80]/30 flex items-center justify-center mr-4">
                <Bot size={24} className="text-[#00FF80]" />
              </div>
              <div>
                <h2 className="text-xl font-medium">TradesXBT AI Agent</h2>
                <p className="text-gray-400">AI-powered trading assistant for Solana ecosystem analysis</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-black/20 hover:bg-white/10 border-white/10"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings size={14} className="mr-2" />
                AI Settings
              </Button>
            </div>
          </div>
          
          {showSettings && (
            <div className="mt-4 p-4 bg-black/30 border border-white/10 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Select AI Provider & Model</h3>
              <ModelSelector 
                currentProvider={provider}
                currentModel={model}
                onProviderChange={handleProviderChange}
                onModelChange={handleModelChange}
                disabled={isLoading}
              />
              <div className="mt-3 flex items-start">
                <Info size={14} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400">
                  Different providers have different strengths. OpenAI and Anthropic Claude provide detailed analysis,
                  while Perplexity offers up-to-date information, and Groq delivers ultra-fast responses.
                </p>
              </div>
            </div>
          )}
          
          {/* Show API error messages */}
          {apiError && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              Error: {apiError}
            </div>
          )}
        </CryptoCard>

        {!connected ? (
          <CryptoCard variant="glass" className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <WalletIcon size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                Connect your Solana wallet to access the AI trading assistant for personalized insights.
              </p>
              <ConnectWalletButton fullWidth />
            </div>
          </CryptoCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CryptoCard className="mb-6 min-h-[calc(100vh-240px)] flex flex-col">
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-340px)] mb-4">
                  <div className="space-y-6 p-2">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`flex max-w-[80%] ${
                            message.role === 'user' 
                              ? 'ml-12' 
                              : 'mr-12'
                          }`}
                        >
                          <div className={`rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center mt-1 mr-2 ${
                            message.role === 'user' 
                              ? 'bg-purple-900/50 order-2 ml-2' 
                              : 'bg-[#00FF80]/20 order-1'
                          }`}>
                            {message.role === 'user' ? (
                              <User size={16} className="text-purple-300" />
                            ) : (
                              <Sparkles size={16} className="text-[#00FF80]" />
                            )}
                          </div>
                          
                          <div 
                            className={`rounded-lg px-4 py-3 order-1 ${
                              message.role === 'user' 
                                ? 'bg-purple-900/20 border border-purple-500/20' 
                                : 'agent-message'
                            }`}
                          >
                            {message.role === 'assistant' && (
                              <div className="flex items-center mb-2">
                                <span className="agent-badge mr-2">TradesXBT Agent</span>
                              </div>
                            )}
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex">
                          <div className="rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center mt-1 mr-2 bg-[#00FF80]/20">
                            <Sparkles size={16} className="text-[#00FF80]" />
                          </div>
                          
                          <div className="agent-message">
                            <div className="flex items-center mb-2">
                              <span className="agent-badge mr-2">TradesXBT Agent</span>
                            </div>
                            <div className="dots-loading h-6">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="flex space-x-2 mt-auto">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about Solana tokens, trading strategies, or market trends..."
                    className="flex-1 bg-black/20 border border-white/10"
                    disabled={isLoading}
                  />
                  {isLoading ? (
                    <Button type="button" onClick={stop} variant="outline" className="bg-red-900/20 hover:bg-red-900/30 border-red-500/30 text-red-400">
                      Stop
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!input.trim()}>
                      <Send size={16} className="mr-2" />
                      Send
                    </Button>
                  )}
                </form>
              </CryptoCard>
            </div>
            
            <div className="hidden md:block">
              <CryptoCard variant="glass" className="sticky top-4">
                <h3 className="text-lg font-medium mb-4">Suggested Questions</h3>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start text-left bg-black/20 hover:bg-white/5 border-white/10"
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isLoading}
                    >
                      <ArrowDown size={14} className="mr-2 text-[#00FF80]" />
                      {question}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-medium mb-4">About TradesXBT Agent</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    The TradesXBT Agent specializes in Solana ecosystem analysis, providing token insights, market trends,
                    and trading strategies with AI-powered precision. Customize your experience by selecting from multiple
                    leading AI providers.
                  </p>
                  <div className="flex items-start mt-4">
                    <div className="bg-black/30 p-2 rounded-full mr-2">
                      <Sparkles size={16} className="text-[#00FF80]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Currently using:</h4>
                      <p className="text-xs text-gray-400">
                        {getProvider(provider).name} - {model}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-4">
                    Note: This assistant provides educational content only, not financial advice. Always DYOR and consider your risk tolerance.
                  </div>
                </div>
              </CryptoCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}