// middleware.ts  (or src/middleware.ts if you use `src/` dir)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/api/chat(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all routes except for:
     * - static files
     * - _next
     * - favicon.ico
     */
    "/((?!_next|favicon.ico|images|fonts|static).*)",
  ],
};
