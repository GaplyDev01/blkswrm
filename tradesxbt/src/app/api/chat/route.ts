import { StreamingTextResponse, OpenAIStream, AnthropicStream } from 'ai'
import { getProvider } from '@/lib/llm-providers'
import { formatErrorResponse } from '@/lib/api-utils'

export const runtime = 'edge'

// System prompt for all models
const getSystemPrompt = () => {
  return {
    role: 'system',
    content: `You are the TradesXBT AI Agent, an expert crypto trading assistant specializing in the Solana ecosystem. 
    Your knowledge covers SOL, JUP, BONK, and other Solana tokens.
    You can provide market analysis, token insights, and trading strategies.
    Be concise, accurate, and data-driven in your responses.
    Current date: ${new Date().toISOString().split('T')[0]}
    
    For token analysis, cover:
    - Recent price action and key levels
    - On-chain activity (if relevant)
    - Major news or developments
    - Technical indicators for short/mid-term outlook
    
    For market analysis, cover:
    - Overall Solana ecosystem trends
    - DeFi, NFT, or other sector-specific insights
    - Broader crypto market context
    
    For trading strategies:
    - Risk management considerations
    - Entry/exit suggestions with rationale
    - Relevant indicators or patterns
    
    Your responses should be:
    - Branded as "TradesXBT Agent" analysis
    - Formatted with bullet points for readability
    - Concise and direct - get to the point quickly
    
    Focus on educational content rather than direct financial advice.
    Do not provide specific "buy" or "sell" recommendations.
    Always remind users to do their own research (DYOR) and consider their risk tolerance.`
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const { messages = [], provider: providerId = 'openai', model: modelId = '' } = payload

    // Validate request data
    if (!Array.isArray(messages) || messages.length === 0) {
      return formatErrorResponse(400, 'Invalid or missing messages array');
    }

    // Get the provider
    const provider = getProvider(providerId)
    
    // Make sure provider API key is available
    if (!process.env[`${provider.id.toUpperCase()}_API_KEY`]) {
      // Fallback to OpenAI if the requested provider key isn't set
      const fallbackProvider = getProvider('openai');
      console.warn(`API key for ${provider.name} not found, falling back to ${fallbackProvider.name}`);
      
      if (!process.env.OPENAI_API_KEY) {
        return formatErrorResponse(500, 'API configuration error. Please contact administrator.');
      }
    }
    
    // System prompt
    const systemPrompt = getSystemPrompt()
    
    // Add system prompt to messages for OpenAI-compatible APIs
    const augmentedMessages = [systemPrompt, ...messages]
    
    // Model selection with validation
    const model = modelId || provider.defaultModel
    const validModels = provider.models.map(m => m.id)
    
    if (modelId && !validModels.includes(modelId)) {
      console.warn(`Invalid model ID ${modelId} for ${provider.name}, using default model ${provider.defaultModel}`);
    }

    // Timeout for request (30 seconds)
    const controllerTimeout = new AbortController();
    const timeoutId = setTimeout(() => controllerTimeout.abort(), 30000);
    
    // Use provider's method to get response
    const providerResponse = await provider.streamCompletion(augmentedMessages, { 
      model: validModels.includes(model) ? model : provider.defaultModel,
      signal: controllerTimeout.signal
    });
    
    // Clear timeout
    clearTimeout(timeoutId);
    
    let stream;
    
    // Parse the response body according to provider
    if (provider.id === 'anthropic') {
      // Use AnthropicStream for Claude
      const reader = providerResponse.body?.getReader();
      if (!reader) {
        throw new Error('Missing response body from Anthropic API');
      }
      stream = AnthropicStream(reader);
    } else {
      // For OpenAI-compatible APIs
      stream = OpenAIStream(providerResponse);
    }
    
    // Return stream response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(`Error in chat API:`, error);
    
    // Handle abort errors
    if (error.name === 'AbortError') {
      return formatErrorResponse(408, 'Request timeout - model took too long to respond');
    }
    
    // Handle rate limit errors
    if (error.status === 429 || (error.message && error.message.includes('rate limit'))) {
      return formatErrorResponse(429, 'Rate limit exceeded. Please try again in a moment.');
    }
    
    // Handle auth errors
    if (error.status === 401 || error.status === 403) {
      return formatErrorResponse(500, 'Authentication error. Please contact administrator.');
    }
    
    return formatErrorResponse(500, `An error occurred with the AI service: ${error.message}`);
  }
}