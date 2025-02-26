import { NextRequest, NextResponse } from 'next/server';
import { prepareEdgeConfig } from './src/lib/vercel-pro-features';
import { checkRateLimit, verifyTokenIfRequired } from './src/lib/api-utils';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/:path*',
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();
  
  // Get Vercel Pro edge configuration
  const edgeConfig = prepareEdgeConfig();
  
  // Apply security headers to all responses
  if (edgeConfig.securityHeaders) {
    const { 
      contentSecurityPolicy, 
      xFrameOptions, 
      xContentTypeOptions, 
      referrerPolicy, 
      permissionsPolicy 
    } = edgeConfig.securityHeaders;
    
    // Set Content-Security-Policy header
    if (contentSecurityPolicy && contentSecurityPolicy.directives) {
      const cspValue = Object.entries(contentSecurityPolicy.directives)
        .map(([key, values]) => `${key} ${values.join(' ')}`)
        .join('; ');
      
      response.headers.set('Content-Security-Policy', cspValue);
    }
    
    // Set other security headers
    if (xFrameOptions) {
      response.headers.set('X-Frame-Options', xFrameOptions);
    }
    
    if (xContentTypeOptions) {
      response.headers.set('X-Content-Type-Options', xContentTypeOptions);
    }
    
    if (referrerPolicy) {
      response.headers.set('Referrer-Policy', referrerPolicy);
    }
    
    if (permissionsPolicy) {
      response.headers.set('Permissions-Policy', permissionsPolicy);
    }
  }
  
  // API endpoint handling
  if (pathname.startsWith('/api/')) {
    // Rate limiting for API routes
    const withinRateLimit = await checkRateLimit(req);
    if (!withinRateLimit) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      });
    }
    
    // JWT verification for protected API routes
    const securedPaths = [
      '/api/user/',
      '/api/protected/',
      '/api/wallet/',
      '/api/transactions/'
    ];
    
    const isProtectedRoute = securedPaths.some(path => pathname.startsWith(path));
    
    if (isProtectedRoute) {
      const isAuthenticated = await verifyTokenIfRequired(req, securedPaths);
      if (!isAuthenticated) {
        return new Response(JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Authentication required for this endpoint'
        }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
    
    // Apply specific headers for API responses
    if (edgeConfig.dataCacheConfig) {
      // Add cache control headers for API responses
      response.headers.set(
        'Cache-Control',
        `public, max-age=${edgeConfig.dataCacheConfig.browserTTL}, s-maxage=${edgeConfig.dataCacheConfig.edgeTTL}, stale-while-revalidate=${edgeConfig.dataCacheConfig.staleWhileRevalidate}`
      );
    }
  }

  // Bot protection for non-API routes
  if (!pathname.startsWith('/api/')) {
    const userAgent = req.headers.get('user-agent') || '';
    const isBot = /bot|crawl|spider|google|baidu|bing|msn|teoma|slurp|yandex/i.test(userAgent);
    
    if (isBot) {
      // Apply specific bot handling rules
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
  }
  
  return response;
}