/**
 * CoinGecko API integration with Redis caching
 * This is the centralized module for all CoinGecko API calls
 */

import { cacheFetch, generateCacheKey } from './redis-cache';

// CoinGecko API base URL
const API_BASE_URL = 'https://pro-api.coingecko.com/api/v3';

// Cache TTLs for different endpoints (in seconds)
const CACHE_TTLS = {
  trending: 300, // 5 minutes
  search: 300, // 5 minutes
  price: 60, // 1 minute
  tokenData: 600, // 10 minutes
  markets: 120, // 2 minutes
  chart: 300, // 5 minutes
};

/**
 * Make a cached API request to CoinGecko
 */
async function cachedCoinGeckoRequest<T>(
  endpoint: string,
  params: Record<string, any> = {},
  cacheTtl: number = 60
): Promise<T> {
  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    throw new Error('COINGECKO_API_KEY is not set in environment variables');
  }

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Add params to URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  // Generate cache key
  const cacheKey = generateCacheKey(`coingecko:${endpoint}`, params);
  
  // Use cacheFetch to handle caching
  return cacheFetch<T>(
    cacheKey,
    async () => {
      const response = await fetch(url.toString(), {
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': apiKey,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`CoinGecko API error (${response.status}): ${errorText}`);
      }
      
      return response.json();
    },
    {
      ttl: cacheTtl,
      tag: 'coingecko',
    }
  );
}

/**
 * Get trending tokens
 */
export async function getTrendingTokens() {
  return cachedCoinGeckoRequest<any>(
    '/search/trending',
    {},
    CACHE_TTLS.trending
  );
}

/**
 * Search for tokens
 */
export async function searchTokens(query: string) {
  return cachedCoinGeckoRequest<any>(
    '/search',
    { query },
    CACHE_TTLS.search
  );
}

/**
 * Get token prices
 */
export async function getTokenPrices(
  ids: string[],
  vsCurrencies: string[] = ['usd'],
  options: {
    include_market_cap?: boolean;
    include_24hr_vol?: boolean;
    include_24hr_change?: boolean;
  } = {}
) {
  if (!ids.length) return {};
  
  return cachedCoinGeckoRequest<Record<string, any>>(
    '/simple/price',
    {
      ids: ids.join(','),
      vs_currencies: vsCurrencies.join(','),
      include_market_cap: options.include_market_cap,
      include_24hr_vol: options.include_24hr_vol,
      include_24hr_change: options.include_24hr_change,
    },
    CACHE_TTLS.price
  );
}

/**
 * Get detailed token data
 */
export async function getTokenData(id: string) {
  return cachedCoinGeckoRequest<any>(
    `/coins/${id}`,
    {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: true,
      developer_data: false,
    },
    CACHE_TTLS.tokenData
  );
}

/**
 * Get market data for tokens
 */
export async function getMarkets({
  vsCurrency = 'usd',
  category = 'solana-ecosystem',
  order = 'market_cap_desc',
  perPage = 50,
  page = 1,
  sparkline = true,
  priceChangePercentage = '24h',
}) {
  return cachedCoinGeckoRequest<any[]>(
    '/coins/markets',
    {
      vs_currency: vsCurrency,
      category,
      order,
      per_page: perPage,
      page,
      sparkline,
      price_change_percentage: priceChangePercentage,
    },
    CACHE_TTLS.markets
  );
}

/**
 * Get historical market chart data
 */
export async function getMarketChart(id: string, days: number = 7) {
  return cachedCoinGeckoRequest<any>(
    `/coins/${id}/market_chart`,
    {
      vs_currency: 'usd',
      days,
    },
    CACHE_TTLS.chart
  );
}