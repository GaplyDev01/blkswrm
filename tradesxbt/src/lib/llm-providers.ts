// LLM provider types and configurations for AI Chat
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { CreateMessage } from 'ai';

// Provider interface for common methods
export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  getClient: () => any;
  streamCompletion: (messages: CreateMessage[], options?: any) => Promise<Response>;
  models: {
    id: string;
    name: string;
    contextWindow: number;
    description: string;
  }[];
  defaultModel: string;
}

// OpenAI provider
export const openaiProvider: LLMProvider = {
  id: 'openai',
  name: 'OpenAI',
  description: 'Powered by OpenAI\'s GPT models',
  icon: '/icons/openai-logo.svg',
  getClient: () => {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  },
  streamCompletion: async (messages, options = {}) => {
    const client = openaiProvider.getClient();
    const response = await client.chat.completions.create({
      model: options.model || openaiProvider.defaultModel,
      messages,
      stream: true,
      temperature: options.temperature || 0.7,
    });

    return new Response(response.body);
  },
  models: [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      contextWindow: 128000,
      description: 'Most capable OpenAI model for crypto market analysis'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      contextWindow: 16385,
      description: 'Fast responses for basic trading questions'
    }
  ],
  defaultModel: 'gpt-4o'
};

// Anthropic provider
export const anthropicProvider: LLMProvider = {
  id: 'anthropic',
  name: 'Anthropic Claude',
  description: 'Powered by Anthropic\'s Claude models',
  icon: '/icons/anthropic-logo.svg',
  getClient: () => {
    return new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  },
  streamCompletion: async (messages, options = {}) => {
    const client = anthropicProvider.getClient();
    
    // Convert messages to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system');
    
    // Filter out system messages and validate user/assistant roles
    const userAssistantMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => {
        // Validate the message role is either 'user' or 'assistant'
        if (m.role !== 'user' && m.role !== 'assistant') {
          throw new Error(`Invalid message role '${m.role}' for Anthropic API. Must be 'user' or 'assistant'.`);
        }
        
        // Ensure content is a string
        if (typeof m.content !== 'string') {
          m.content = String(m.content || '');
        }
        
        return m;
      });
    
    // Make sure there's at least one user message
    if (userAssistantMessages.length === 0 || userAssistantMessages[0].role !== 'user') {
      // Add dummy user message if needed (e.g., when only system prompt is provided)
      userAssistantMessages.unshift({ role: 'user', content: 'Hello, I need some crypto trading insights.' });
    }
    
    // Handle Anthropic API options
    const apiOptions = {
      model: options.model || anthropicProvider.defaultModel,
      messages: userAssistantMessages,
      system: systemMessage?.content || '',
      stream: true,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 4000,
    };
    
    // Pass abort signal if provided
    if (options.signal) {
      apiOptions.signal = options.signal;
    }
    
    const response = await client.messages.create(apiOptions);

    return new Response(response.body);
  },
  models: [
    {
      id: 'claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      contextWindow: 200000,
      description: 'Most powerful Claude model for detailed market analysis'
    },
    {
      id: 'claude-3-sonnet-20240229',
      name: 'Claude 3 Sonnet',
      contextWindow: 180000,
      description: 'Balanced performance for crypto insights'
    },
    {
      id: 'claude-3-haiku-20240307',
      name: 'Claude 3 Haiku',
      contextWindow: 180000,
      description: 'Fast responses for trading questions'
    }
  ],
  defaultModel: 'claude-3-sonnet-20240229'
};

// Perplexity provider
export const perplexityProvider: LLMProvider = {
  id: 'perplexity',
  name: 'Perplexity',
  description: 'Fast responses with integrated web knowledge',
  icon: '/icons/perplexity-logo.svg',
  getClient: () => {
    return new OpenAI({
      baseURL: 'https://api.perplexity.ai',
      apiKey: process.env.PERPLEXITY_API_KEY || '',
    });
  },
  streamCompletion: async (messages, options = {}) => {
    const client = perplexityProvider.getClient();
    const response = await client.chat.completions.create({
      model: options.model || perplexityProvider.defaultModel,
      messages,
      stream: true,
      temperature: options.temperature || 0.7,
    });

    return new Response(response.body);
  },
  models: [
    {
      id: 'pplx-7b-online',
      name: 'PPLX 7B Online',
      contextWindow: 8192,
      description: 'Online search for current market data'
    },
    {
      id: 'pplx-70b-online',
      name: 'PPLX 70B Online',
      contextWindow: 8192,
      description: 'Advanced model with internet access'
    },
    {
      id: 'sonar-small-online',
      name: 'Sonar Small Online',
      contextWindow: 12000,
      description: 'Specialized for financial data'
    }
  ],
  defaultModel: 'sonar-small-online'
};

// Groq provider
export const groqProvider: LLMProvider = {
  id: 'groq',
  name: 'Groq',
  description: 'Ultra-fast LLM responses for trading',
  icon: '/icons/groq-logo.svg',
  getClient: () => {
    return new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY || '',
    });
  },
  streamCompletion: async (messages, options = {}) => {
    const client = groqProvider.getClient();
    const response = await client.chat.completions.create({
      model: options.model || groqProvider.defaultModel,
      messages,
      stream: true,
      temperature: options.temperature || 0.7,
    });

    return new Response(response.body);
  },
  models: [
    {
      id: 'llama3-70b-8192',
      name: 'LLaMA-3 70B',
      contextWindow: 8192,
      description: 'High-performance open model with fast responses'
    },
    {
      id: 'mixtral-8x7b-32768',
      name: 'Mixtral 8x7B',
      contextWindow: 32768,
      description: 'Large context window for detailed market analysis'
    },
    {
      id: 'gemma-7b-it',
      name: 'Gemma 7B',
      contextWindow: 8192,
      description: 'Fast responses for basic trading queries'
    }
  ],
  defaultModel: 'llama3-70b-8192'
};

// All providers
export const providers: LLMProvider[] = [
  openaiProvider,
  anthropicProvider,
  perplexityProvider,
  groqProvider
];

// Get provider by ID
export function getProvider(id: string): LLMProvider {
  return providers.find(p => p.id === id) || openaiProvider;
}