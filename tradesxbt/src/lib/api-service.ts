import { useCallback, useEffect, useState } from 'react';

// API rate limiting and caching
const API_CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache
const RATE_LIMIT_WAIT = 15000; // Wait 15 seconds between API calls

let lastCallTimestamp = 0;

export async function fetchWithRateLimit(url: string, options = {}) {
  const now = Date.now();
  
  // Check cache first
  if (API_CACHE.has(url)) {
    const cached = API_CACHE.get(url)!;
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }
  
  // Respect rate limit
  const timeElapsed = now - lastCallTimestamp;
  if (timeElapsed < RATE_LIMIT_WAIT) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_WAIT - timeElapsed));
  }
  
  // Make the API call
  try {
    lastCallTimestamp = Date.now();
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    API_CACHE.set(url, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Helper to identify Solana tokens
function isSolanaToken(coin: any) {
  try {
    if (coin.platforms && coin.platforms.solana) return true;
    if (coin.item && coin.item.platforms && coin.item.platforms.solana) return true;
    return false;
  } catch (error) {
    console.error('Error checking Solana token:', error);
    return false;
  }
}

// Token API hooks
export function useTokenSearch(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    
    const searchTokens = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchWithRateLimit(
          `https://pro-api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
          {
            headers: {
              'accept': 'application/json',
              'x-cg-pro-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY
            }
          }
        );
        
        // Filter for Solana tokens
        const solanaTokens = data.coins.filter(isSolanaToken);
        
        if (solanaTokens.length > 0) {
          // Get price data for these tokens
          const priceData = await fetchWithRateLimit(
            `https://pro-api.coingecko.com/api/v3/simple/price?ids=${
              solanaTokens.map(t => t.id).join(',')
            }&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
            {
              headers: {
                'accept': 'application/json',
                'x-cg-pro-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY
              }
            }
          );
          
          const enrichedResults = solanaTokens.map(token => ({
            ...token,
            price: priceData[token.id]?.usd || 0,
            change_24h: priceData[token.id]?.usd_24h_change || 0,
            volume_24h: priceData[token.id]?.usd_24h_vol || 0
          }));
          
          setResults(enrichedResults);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setError(error instanceof Error ? error.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchTokens();
  }, [query]);
  
  return { results, isLoading, error };
}

export function useTrendingTokens() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchWithRateLimit(
        'https://pro-api.coingecko.com/api/v3/search/trending',
        {
          headers: {
            'accept': 'application/json',
            'x-cg-pro-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY
          }
        }
      );
      
      // Filter for Solana tokens
      const solanaTokens = data.coins
        .filter(isSolanaToken)
        .map((coin: any) => coin.item.id);
      
      if (solanaTokens.length > 0) {
        // Get price data for these tokens
        const priceData = await fetchWithRateLimit(
          `https://pro-api.coingecko.com/api/v3/simple/price?ids=${
            solanaTokens.join(',')
          }&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
          {
            headers: {
              'accept': 'application/json',
              'x-cg-pro-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY
            }
          }
        );
        
        const processedTokens = data.coins
          .filter(isSolanaToken)
          .map((coin: any) => {
            const price = priceData[coin.item.id];
            return {
              id: coin.item.id,
              symbol: coin.item.symbol.toUpperCase(),
              name: coin.item.name,
              price: price?.usd || 0,
              change_24h: price?.usd_24h_change || 0,
              volume_24h: price?.usd_24h_vol || 0
            };
          });
        
        setTokens(processedTokens);
      } else {
        setTokens([]);
      }
    } catch (error) {
      console.error('Failed to fetch trending tokens:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch trending tokens');
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchTrending();
    
    // Refresh data periodically
    const interval = setInterval(fetchTrending, 60000); // Every minute
    return () => clearInterval(interval);
  }, [fetchTrending]);
  
  return { tokens, isLoading, error, refresh: fetchTrending };
}

export async function getTokenData(tokenId: string) {
  try {
    const data = await fetchWithRateLimit(
      `https://pro-api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&community_data=true&developer_data=false`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY
        }
      }
    );
    
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      price: data.market_data?.current_price?.usd || 0,
      change_24h: data.market_data?.price_change_percentage_24h || 0,
      volume_24h: data.market_data?.total_volume?.usd || 0,
      marketCap: data.market_data?.market_cap?.usd || 0,
      description: data.description?.en || '',
      website: data.links?.homepage?.[0] || '',
      explorer: data.links?.blockchain_site?.[0] || '',
      social: {
        twitter: data.links?.twitter_screen_name || '',
        telegram: data.links?.telegram_channel_identifier || '',
        reddit: data.links?.subreddit_url || '',
      },
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
}

export async function getTokenPrices(tokens: string[]): Promise<Record<string, number>> {
  try {
    if (tokens.length === 0) return {};
    
    const data = await fetchWithRateLimit(
      `https://pro-api.coingecko.com/api/v3/simple/price?ids=${tokens.join(',')}&vs_currencies=usd`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY
        }
      }
    );
    
    // Transform the response to match the expected output format
    return tokens.reduce((acc, token) => {
      if (data[token] && data[token].usd) {
        acc[token] = data[token].usd;
      }
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error fetching token prices:', error);
    throw error;
  }
}