"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc-client';
import { useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry on 404 errors
          if (error?.message?.includes('not found')) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  }));
  
  // Create tRPC client with useMemo to ensure it's stable
  const trpcClient = useMemo(() => {
    console.log('Creating tRPC client with user:', user?.id, 'isLoaded:', isLoaded);
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          headers: () => {
            const userId = user?.id || '';
            console.log('Sending userId in header:', userId);
            return {
              'x-user-id': userId,
            };
          },
        }),
      ],
    });
  }, [user?.id, isLoaded]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
