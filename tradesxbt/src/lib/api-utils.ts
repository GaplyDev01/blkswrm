/**
 * API Utilities for TradesXBT
 */

// Generic function to fetch JSON data from API endpoints
export async function fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Function to fetch configuration from API or use cached data
export async function fetchConfiguration(endpoint: string): Promise<any> {
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    try {
      return fetchData(endpoint, {
        next: { 
          revalidate: 3600, // Revalidate every hour
          tags: ['config']
        }
      });
    } catch (error) {
      console.warn(`Failed to fetch configuration from ${endpoint}:`, error);
      // Return default configuration if fetch fails
      return {};
    }
  } else {
    // For client-side, use a locally cached version if available
    const cachedConfig = localStorage.getItem('tradesxbt_config');
    if (cachedConfig) {
      try {
        return JSON.parse(cachedConfig);
      } catch (e) {
        console.warn('Invalid cached configuration, fetching fresh data');
      }
    }
    
    // If we get here, fetch from API and cache the result
    try {
      const config = await fetchData(endpoint);
      localStorage.setItem('tradesxbt_config', JSON.stringify(config));
      return config;
    } catch (error) {
      console.warn(`Failed to fetch client configuration from ${endpoint}:`, error);
      return {};
    }
  }
}

// Function to handle API errors
export function handleApiError(error: unknown): { message: string; status?: number } {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unknown error occurred' };
}

// Function to create cache headers
export function createCacheHeaders(maxAge: number = 60): Headers {
  const headers = new Headers();
  headers.set('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 10}`);
  return headers;
}

// Middleware for API rate limiting check
export async function checkRateLimit(
  req: Request,
  maxRequests: number = 100, 
  windowMs: number = 60000
): Promise<boolean> {
  // In a real implementation, this would use Redis or a database to track requests
  // For now, we'll simulate by returning true
  return true;
}

// Helper to format error responses
export function formatErrorResponse(status: number, message: string) {
  return new Response(
    JSON.stringify({
      error: {
        message,
        status,
      },
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Helper for conditional JWT verification
export async function verifyTokenIfRequired(
  req: Request, 
  securedPaths: string[] = ['/api/protected/']
): Promise<boolean> {
  const url = new URL(req.url);
  const needsAuth = securedPaths.some(path => url.pathname.startsWith(path));
  
  if (!needsAuth) {
    return true;
  }
  
  // In a real implementation, this would verify the JWT token
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  // Simulated verification
  return true;
}