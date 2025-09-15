/**
 * tRPC Configuration and Context Setup
 * 
 * This file configures tRPC (TypeScript Remote Procedure Call) for type-safe
 * API communication between frontend and backend. It handles authentication
 * context and provides both protected and public procedures.
 */

// Import tRPC core functionality and error handling
import { initTRPC, TRPCError } from '@trpc/server';
// Import Clerk authentication for server-side user verification
import { auth } from '@clerk/nextjs/server';

// Initialize tRPC with context type definition
// Context contains userId for authentication state
const t = initTRPC.context<{ userId: string | null }>().create();

/**
 * Create Context Function
 * 
 * This function runs on every tRPC request and extracts the user ID
 * from Clerk authentication. It's used to determine if a user is
 * authenticated and to provide user context to procedures.
 * 
 * @param opts - Request options containing the HTTP request
 * @returns Context object with userId (null if not authenticated)
 */
export const createContext = async (opts: { req: Request }): Promise<{ userId: string | null }> => {
  try {
    // Attempt to get user ID from Clerk authentication
    const { userId } = await auth();
    console.log('Clerk auth userId:', userId);
    return { userId };
  } catch (error) {
    // No authentication found - this is acceptable for public operations
    console.log('No auth found - this is okay for public operations');
    return { userId: null };
  }
};

/**
 * Protected Procedure Middleware
 * 
 * This middleware ensures that only authenticated users can access
 * protected procedures. It checks for a valid userId in the context
 * and throws an UNAUTHORIZED error if not found.
 * 
 * Used for: getSessions, getSession, createSession, deleteSession
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // Check if user is authenticated
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }
  // Continue to the procedure with authenticated context
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

// Export tRPC utilities for creating routers and procedures
export const router = t.router;
export const publicProcedure = t.procedure;
