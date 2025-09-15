"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const utils = trpc.useUtils();
  
  const createSessionMutation = trpc.createSession.useMutation({
    onSuccess: (newSession) => {
      // Invalidate sessions query to update the sidebar
      utils.getSessions.invalidate();
      router.push(`/chat/${newSession.id}`);
    },
  });

  const handleStartNewChat = () => {
    createSessionMutation.mutate({ title: "New Chat" });
  };

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
      <div className="text-center space-y-6 lg:space-y-8 max-w-sm sm:max-w-md mx-auto">
        <div className="space-y-3 lg:space-y-4">
          <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-blue-600 opacity-80" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Start Your Career Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg">
            Start a new career guiding journey with our Career Guide AI
          </p>
        </div>
        
        <Button 
          onClick={handleStartNewChat}
          disabled={createSessionMutation.isPending}
          className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 lg:py-6 bg-gray-700 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-black w-full sm:w-auto"
        >
          {createSessionMutation.isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
              <span>Creating...</span>
            </div>
          ) : (
            <div className="flex cursor-pointer items-center justify-center space-x-2">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Start New Chat</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}