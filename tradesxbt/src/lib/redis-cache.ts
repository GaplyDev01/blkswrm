/**
 * Redis cache implementation for TradesXBT using Upstash Redis
 * This provides edge-compatible Redis caching for API responses
 */

import { kv } from '@vercel/kv';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tag?: string; // For cache invalidation by tag
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  tag?: string;
}

const DEFAULT_TTL = 60; // 1 minute default TTL

/**
 * Get data from cache or fetch it and cache the response
 */
export async function cacheFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = DEFAULT_TTL, tag } = options;
  
  // Try to get from cache first
  try {
    const cachedData = await kv.get<CacheEntry<T>>(key);
    
    if (cachedData) {
      // Check if cache is still valid
      const age = (Date.now() - cachedData.timestamp) / 1000;
      if (age < ttl) {
        console.log(`Cache hit for key: ${key}, age: ${age.toFixed(2)}s`);
        return cachedData.data;
      } else {
        console.log(`Cache expired for key: ${key}, age: ${age.toFixed(2)}s`);
      }
    }
  } catch (error) {
    console.warn(`Error reading from cache: ${error}`);
  }
  
  // Fetch fresh data
  console.log(`Cache miss for key: ${key}, fetching fresh data`);
  const data = await fetchFn();
  
  // Store in cache for next time
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      tag
    };
    
    await kv.set(key, entry, { ex: ttl });
  } catch (error) {
    console.warn(`Error writing to cache: ${error}`);
  }
  
  return data;
}

/**
 * Invalidate cache by key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await kv.del(key);
  } catch (error) {
    console.warn(`Error invalidating cache key ${key}: ${error}`);
  }
}

/**
 * Invalidate all cache entries with a specific tag
 */
export async function invalidateCacheByTag(tag: string): Promise<void> {
  try {
    // Get all keys
    const keys = await kv.keys('*');
    
    // Check each key for matching tag
    for (const key of keys) {
      const entry = await kv.get<CacheEntry<any>>(key);
      if (entry && entry.tag === tag) {
        await kv.del(key);
      }
    }
  } catch (error) {
    console.warn(`Error invalidating cache by tag ${tag}: ${error}`);
  }
}

/**
 * Generate a consistent cache key from parameters
 */
export function generateCacheKey(base: string, params: Record<string, any> = {}): string {
  // Sort params for consistency
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
    
  return sortedParams ? `${base}?${sortedParams}` : base;
}