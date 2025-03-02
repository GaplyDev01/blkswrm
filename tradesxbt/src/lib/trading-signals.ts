/**
 * TradesXBT Trading Signals Generation
 * 
 * This module generates automated trading signals based on market data,
 * technical analysis, and AI algorithms.
 */

import { fetchData } from './api-utils';

export interface TradingSignal {
  id: string;
  token: string;
  tokenName: string;
  type: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-100
  timeframe: '1h' | '4h' | '1d' | '1w';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
  indicators: {
    name: string;
    value: string;
    signal: 'bullish' | 'bearish' | 'neutral';
  }[];
  timestamp: number;
  imageUrl?: string;
  source: 'ai' | 'analyst' | 'community';
  performance?: {
    success?: boolean;
    pnl?: number;
    exitPrice?: number;
    exitTimestamp?: number;
  };
}

// Technical indicators we'll use for signal generation
export type TechnicalIndicator = 
  | 'RSI' 
  | 'MACD' 
  | 'Bollinger Bands' 
  | 'EMA' 
  | 'SMA' 
  | 'Stochastic' 
  | 'Volume Profile' 
  | 'Fibonacci' 
  | 'Ichimoku';

// Get market data for a specific token
async function getMarketData(token: string, timeframe: string) {
  try {
    // In a real implementation, this would fetch real market data
    // For now, we simulate with predetermined data patterns
    return await fetchData(`/api/market-data/${token}?timeframe=${timeframe}`);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
}

// Calculate technical indicators based on price data
function calculateIndicators(priceData: any, token: string) {
  // This would contain real indicator calculations in production
  // For now, we'll return simulated indicators
  
  // Calculate RSI (simulated)
  const lastPrice = priceData.prices[priceData.prices.length - 1];
  const prevPrice = priceData.prices[priceData.prices.length - 2];
  
  const rsiValue = Math.floor(30 + Math.random() * 40); // Random RSI between 30-70
  const macdValue = (Math.random() * 2 - 1).toFixed(2); // Random MACD between -1 and 1
  const emaValue = lastPrice * (1 + (Math.random() * 0.02 - 0.01)); // EMA close to current price
  const smaValue = lastPrice * (1 + (Math.random() * 0.04 - 0.02)); // SMA with more variance
  
  const isUptrend = lastPrice > prevPrice;
  
  return [
    {
      name: 'RSI',
      value: `${rsiValue}`,
      signal: rsiValue < 30 ? 'bullish' : rsiValue > 70 ? 'bearish' : 'neutral'
    },
    {
      name: 'MACD',
      value: `${macdValue}`,
      signal: parseFloat(macdValue) > 0 ? 'bullish' : 'bearish'
    },
    {
      name: 'EMA (20)',
      value: `$${emaValue.toFixed(4)}`,
      signal: lastPrice > emaValue ? 'bullish' : 'bearish'
    },
    {
      name: 'SMA (50)',
      value: `$${smaValue.toFixed(4)}`,
      signal: lastPrice > smaValue ? 'bullish' : 'bearish'
    },
    {
      name: 'Volume',
      value: `${(Math.random() * 100000).toFixed(0)}`,
      signal: isUptrend ? 'bullish' : 'bearish' 
    }
  ];
}

// Generate a trading signal based on technical analysis
function generateSignalFromTA(token: string, priceData: any, timeframe: '1h' | '4h' | '1d' | '1w'): TradingSignal {
  const indicators = calculateIndicators(priceData, token);
  
  // Count bullish and bearish signals
  const bullishCount = indicators.filter(i => i.signal === 'bullish').length;
  const bearishCount = indicators.filter(i => i.signal === 'bearish').length;
  
  // Determine signal type
  let type: 'buy' | 'sell' | 'hold' = 'hold';
  if (bullishCount >= 3) {
    type = 'buy';
  } else if (bearishCount >= 3) {
    type = 'sell';
  }
  
  // Calculate confidence level
  const confidence = type === 'buy' 
    ? Math.floor(50 + (bullishCount / indicators.length) * 50)
    : type === 'sell'
    ? Math.floor(50 + (bearishCount / indicators.length) * 50)
    : Math.floor(50 - Math.abs(bullishCount - bearishCount) * 10);
  
  const lastPrice = priceData.prices[priceData.prices.length - 1];
  
  // Generate reasoning
  const reasoning = type === 'buy'
    ? `Technical analysis shows ${bullishCount} bullish indicators out of ${indicators.length}. ${indicators[0].name} indicates ${indicators[0].signal} momentum at ${indicators[0].value}.`
    : type === 'sell'
    ? `Technical analysis shows ${bearishCount} bearish indicators out of ${indicators.length}. ${indicators[0].name} indicates ${indicators[0].signal} momentum at ${indicators[0].value}.`
    : `Mixed signals with ${bullishCount} bullish and ${bearishCount} bearish indicators. Recommend holding until clearer direction emerges.`;
  
  // Calculate target and stop loss
  const volatility = 0.05 + Math.random() * 0.10; // 5-15% volatility
  const targetPrice = type === 'buy' 
    ? lastPrice * (1 + volatility)
    : type === 'sell'
    ? lastPrice * (1 - volatility)
    : lastPrice;
  
  const stopLoss = type === 'buy'
    ? lastPrice * (1 - volatility * 0.5)
    : type === 'sell'
    ? lastPrice * (1 + volatility * 0.5)
    : lastPrice;
  
  return {
    id: `${token}-${timeframe}-${Date.now()}`,
    token,
    tokenName: getTokenName(token),
    type,
    confidence,
    timeframe,
    entryPrice: lastPrice,
    targetPrice: parseFloat(targetPrice.toFixed(4)),
    stopLoss: parseFloat(stopLoss.toFixed(4)),
    reasoning,
    indicators,
    timestamp: Date.now(),
    source: 'ai'
  };
}

// Get token full name
function getTokenName(symbol: string): string {
  const tokenMap: {[key: string]: string} = {
    'SOL': 'Solana',
    'JUP': 'Jupiter',
    'BONK': 'Bonk',
    'JTO': 'Jito',
    'RAY': 'Raydium',
    'PYTH': 'Pyth Network',
    'ORCA': 'Orca',
    'WIF': 'Dogwifhat',
    'DFL': 'DeFi Land',
    'MNGO': 'Mango Markets'
  };
  
  return tokenMap[symbol] || symbol;
}

// Generate multiple trading signals for different tokens
export async function generateTradingSignals(
  count: number = 5, 
  timeframe: '1h' | '4h' | '1d' | '1w' = '4h'
): Promise<TradingSignal[]> {
  // Popular Solana tokens to generate signals for
  const popularTokens = ['SOL', 'JUP', 'BONK', 'JTO', 'RAY', 'PYTH', 'ORCA', 'WIF', 'DFL', 'MNGO'];
  
  // Select random tokens
  const selectedTokens = popularTokens
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  
  const signals: TradingSignal[] = [];
  
  for (const token of selectedTokens) {
    try {
      // In a real scenario, this would fetch actual market data
      // For demo, we create simulated price data
      const priceData = {
        prices: Array(20).fill(0).map((_, i) => 
          // Base price + random walk
          (token === 'SOL' ? 100 : token === 'JUP' ? 0.5 : 0.01) * 
          (1 + (Math.random() * 0.2 - 0.1) + (i / 100))
        )
      };
      
      const signal = generateSignalFromTA(token, priceData, timeframe);
      signals.push(signal);
    } catch (error) {
      console.error(`Error generating signal for ${token}:`, error);
    }
  }
  
  return signals;
}

// Schedule regular signal generation
export function scheduleSignalGeneration(
  callback: (signals: TradingSignal[]) => void,
  intervalMinutes: number = 60
) {
  // Generate initial signals
  generateTradingSignals().then(callback);
  
  // Schedule regular updates
  const intervalMs = intervalMinutes * 60 * 1000;
  return setInterval(async () => {
    const signals = await generateTradingSignals();
    callback(signals);
  }, intervalMs);
}

// Re-analyze a signal to update its status
export function updateSignalPerformance(
  signal: TradingSignal, 
  currentPrice: number
): TradingSignal {
  const updatedSignal = { ...signal };
  
  // If already has performance data, no need to update
  if (updatedSignal.performance?.success !== undefined) {
    return updatedSignal;
  }
  
  // Check if stop loss was hit
  if (
    (signal.type === 'buy' && currentPrice <= signal.stopLoss) ||
    (signal.type === 'sell' && currentPrice >= signal.stopLoss)
  ) {
    updatedSignal.performance = {
      success: false,
      exitPrice: signal.stopLoss,
      exitTimestamp: Date.now(),
      pnl: signal.type === 'buy' 
        ? ((signal.stopLoss - signal.entryPrice) / signal.entryPrice) * 100
        : ((signal.entryPrice - signal.stopLoss) / signal.entryPrice) * 100
    };
    return updatedSignal;
  }
  
  // Check if target was hit
  if (
    (signal.type === 'buy' && currentPrice >= signal.targetPrice) ||
    (signal.type === 'sell' && currentPrice <= signal.targetPrice)
  ) {
    updatedSignal.performance = {
      success: true,
      exitPrice: signal.targetPrice,
      exitTimestamp: Date.now(),
      pnl: signal.type === 'buy'
        ? ((signal.targetPrice - signal.entryPrice) / signal.entryPrice) * 100
        : ((signal.entryPrice - signal.targetPrice) / signal.entryPrice) * 100
    };
    return updatedSignal;
  }
  
  // Signal still active
  return updatedSignal;
}