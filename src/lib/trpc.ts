import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@clerk/nextjs/server';

// Initialize tRPC
const t = initTRPC.context<{ userId: string | null }>().create();

// Create context function
export const createContext = async (opts: { req: Request }): Promise<{ userId: string | null }> => {
  try {
    // Try to get user ID from Clerk auth
    const { userId } = await auth();
    console.log('Clerk auth userId:', userId);
    return { userId };
  } catch (error) {
    console.log('No auth found - this is okay for public operations');
    return { userId: null };
  }
};

// Create protected procedure (only for session creation)
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
