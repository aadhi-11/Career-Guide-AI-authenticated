"use client";

/**
 * tRPC Provider Component
 * 
 * This component sets up the tRPC client and React Query for the entire application.
 * It provides type-safe API communication and efficient data fetching with caching.
 * 
 * Features:
 * - Type-safe API calls with tRPC
 * - Automatic caching and background updates
 * - Error handling and retry logic
 * - Development tools for debugging
 */

// Import React Query for data fetching and caching
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Import React Query DevTools for development debugging
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// Import tRPC client utilities
import { httpBatchLink } from '@trpc/client';
// Import the configured tRPC client
import { trpc } from './trpc-client';
import { useState } from 'react';

/**
 * TRPCProvider Component
 * 
 * Wraps the application with tRPC and React Query providers.
 * Configures caching, error handling, and API communication.
 * 
 * @param children - React children components
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  // Create QueryClient with optimized configuration
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        retry: (failureCount, error) => {
          // Don't retry on 404 errors (not found)
          if (error?.message?.includes('not found')) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false, // Don't retry mutations automatically
      },
    },
  }));
  
  // Create tRPC client with HTTP batch link for efficient API calls
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc', // API endpoint for tRPC
        }),
      ],
    })
  );

  return (
    // Provide tRPC client and query client to the entire app
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Development tools for debugging queries and mutations */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
