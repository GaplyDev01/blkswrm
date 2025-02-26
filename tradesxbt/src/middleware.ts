import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This middleware is used to protect routes with Clerk authentication
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/market/trending",
    "/api/market/data",
    "/api/token/(.*)",
    "/api/search",
    "/login",
    "/signup",
    "/terms",
    "/privacy"
  ],
  
  // Optional: Handle custom behavior when a user isn't authenticated
  afterAuth(auth, req) {
    // If the user is not authenticated and trying to access a protected route,
    // redirect them to the login page
    if (!auth.userId && !auth.isPublicRoute) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
});

// Stop middleware processing on these paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};