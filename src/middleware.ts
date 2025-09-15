/**
 * Next.js Middleware for Authentication
 * 
 * This middleware handles authentication for protected routes using Clerk.
 * It runs on every request and protects specific routes that require authentication.
 * 
 * Protected Routes:
 * - /chat/* - All chat pages and sub-routes
 * - /api/chat/* - Chat API endpoints
 * 
 * Note: /api/trpc/* routes are NOT protected here to allow individual
 * tRPC procedures to handle their own authentication requirements.
 */

// Import Clerk middleware utilities
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',      // All chat pages and sub-routes
  '/api/chat(.*)'   // Chat API endpoints
]);

// Main middleware function that runs on every request
export default clerkMiddleware((auth, req) => {
  // Check if the current route requires authentication
  if (isProtectedRoute(req)) {
    // Protect the route - redirects to sign-in if not authenticated
    auth.protect();
  }
});

// Middleware configuration - defines which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all routes except for:
     * - static files (_next, images, fonts, static)
     * - favicon.ico
     * This ensures middleware runs on all application routes
     */
    "/((?!_next|favicon.ico|images|fonts|static).*)",
  ],
};
