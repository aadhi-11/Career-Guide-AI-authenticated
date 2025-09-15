import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './trpc';
import { prisma } from './prisma';
import { TRPCError } from '@trpc/server';

// TypeScript interfaces
interface PrismaMessage {
  id: string;
  content: string;
  role: string;
  createdAt: Date;
}

interface PrismaSession {
  id: string;
  title: string;
  lastMessage: string | null;
  updatedAt: Date;
  messages: PrismaMessage[];
}

// Helper function to get or create user
async function getOrCreateUser(userId: string) {
  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { id: userId }
  });

  // If user doesn't exist, create them
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        name: 'User',
        email: `${userId}@clerk.user`,
      },
    });
  }

  return user;
}

export const appRouter = router({
  // Get chat sessions with pagination (user-specific) - PROTECTED
  getSessions: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(7),
    }).optional())
    .query(async ({ input, ctx }) => {
      const user = await getOrCreateUser(ctx.userId);
      const { page = 1, limit = 7 } = input || {};
      const skip = (page - 1) * limit;

      // Get total count for pagination info (user-specific)
      const totalCount = await prisma.chatSession.count({
        where: { userId: user.id }
      });
      
      // Get paginated sessions (user-specific)
      const sessions = await prisma.chatSession.findMany({
        where: { userId: user.id },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        sessions: sessions.map((session: PrismaSession) => ({
          id: session.id,
          title: session.title,
          lastMessage: session.lastMessage || '',
          timestamp: session.updatedAt,
          messages: session.messages.map((msg: PrismaMessage) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role.toLowerCase() as 'user' | 'assistant',
            timestamp: msg.createdAt,
          })),
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }),

  // Get a specific session by ID (user-specific) - PROTECTED
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await getOrCreateUser(ctx.userId);
      
      const session = await prisma.chatSession.findFirst({
        where: { 
          id: input.sessionId,
          userId: user.id // Ensure user owns this session
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      
      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Session with ID ${input.sessionId} not found`,
        });
      }
      
      return {
        id: session.id,
        title: session.title,
        lastMessage: session.lastMessage || '',
        timestamp: session.updatedAt,
        messages: session.messages.map((msg: PrismaMessage) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role.toLowerCase() as 'user' | 'assistant',
          timestamp: msg.createdAt,
        })),
      };
    }),

  // Create a new chat session (user-specific) - PROTECTED
  createSession: protectedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const user = await getOrCreateUser(ctx.userId);

      const newSession = await prisma.chatSession.create({
        data: {
          title: input.title || "New Chat",
          lastMessage: "",
          userId: user.id, // Link to authenticated user
        },
      });
      
      return {
        id: newSession.id,
        title: newSession.title,
        lastMessage: newSession.lastMessage || '',
        timestamp: newSession.createdAt,
        messages: [],
      };
    }),

  // Add a message to a session - PUBLIC (no auth required)
  addMessage: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string(),
      role: z.enum(['user', 'assistant'])
    }))
    .mutation(async ({ input }) => {
      // Create the message without checking user ownership
      await prisma.message.create({
        data: {
          content: input.content,
          role: input.role.toUpperCase() as 'USER' | 'ASSISTANT',
          chatSessionId: input.sessionId,
        },
      });

      // Update session's last message and timestamp
      const updatedSession = await prisma.chatSession.update({
        where: { id: input.sessionId },
        data: { 
          lastMessage: input.content,
          updatedAt: new Date(),
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return {
        id: updatedSession.id,
        title: updatedSession.title,
        lastMessage: updatedSession.lastMessage || '',
        timestamp: updatedSession.updatedAt,
        messages: updatedSession.messages.map((msg: PrismaMessage) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role.toLowerCase() as 'user' | 'assistant',
          timestamp: msg.createdAt,
        })),
      };
    }),

  // Update session title - PUBLIC (no auth required)
  updateSessionTitle: publicProcedure
    .input(z.object({ 
      sessionId: z.string(),
      title: z.string()
    }))
    .mutation(async ({ input }) => {
      const updatedSession = await prisma.chatSession.updateMany({
        where: { id: input.sessionId },
        data: { title: input.title },
      });

      if (updatedSession.count === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found',
        });
      }

      // Fetch the updated session
      const session = await prisma.chatSession.findUnique({
        where: { id: input.sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      
      return {
        id: session!.id,
        title: session!.title,
        lastMessage: session!.lastMessage || '',
        timestamp: session!.updatedAt,
        messages: session!.messages.map((msg: PrismaMessage) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role.toLowerCase() as 'user' | 'assistant',
          timestamp: msg.createdAt,
        })),
      };
    }),

  // Delete a session - PUBLIC (temporarily for now)
  deleteSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      const deletedSession = await prisma.chatSession.deleteMany({
        where: { 
          id: input.sessionId
        },
      });

      if (deletedSession.count === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found',
        });
      }
      
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;