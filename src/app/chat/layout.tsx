"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Menu, X, Home, LogOut, Trash2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { trpc } from "@/lib/trpc-client";
import { useUser, useClerk } from "@clerk/nextjs";

// TypeScript interfaces
interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
  }>;
}

// Confirmation Modal Component
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sessionTitle: string;
  isDeleting: boolean;
}

function DeleteModal({ isOpen, onClose, onConfirm, sessionTitle, isDeleting }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-black">
        <h3 className="text-lg font-semibold text-black dark:text-black mb-4">
          Delete Chat Session
        </h3>
        <p className="text-gray-600 dark:text-black mb-6">
          Are you sure you want to delete &quot;{sessionTitle}&quot;? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-600 dark:text-black border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const sessionsPerPage = 5;

  // Single useEffect to handle all authentication and redirect logic
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // tRPC queries and mutations - only run when user is authenticated
  const { data: sessionsData, isLoading } = trpc.getSessions.useQuery(
    {
      page: currentPage,
      limit: sessionsPerPage,
    },
    {
      enabled: isLoaded && !!user, // Only run when user is loaded and authenticated
    }
  );

  const chatSessions = sessionsData?.sessions || [];
  const pagination = sessionsData?.pagination;

  const utils = trpc.useUtils();

  const createSessionMutation = trpc.createSession.useMutation({
    onSuccess: (newSession) => {
      utils.getSessions.invalidate();
      setActiveSessionId(newSession.id);
      router.push(`/chat/${newSession.id}`);
    },
  });

  const deleteSessionMutation = trpc.deleteSession.useMutation({
    onSuccess: () => {
      utils.getSessions.invalidate();
      setDeleteModalOpen(false);
      setSessionToDelete(null);
      // If we deleted the active session, redirect to chat home
      if (sessionToDelete?.id === activeSessionId) {
        setActiveSessionId(null);
        router.push('/chat');
      }
    },
  });

  const createNewChat = () => {
    createSessionMutation.mutate({ title: "New Chat" });
  };

  const selectChatSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    router.push(`/chat/${sessionId}`);
    setSidebarOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation(); // Prevent session selection
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      deleteSessionMutation.mutate({ sessionId: sessionToDelete.id });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const goToNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  // Early returns for loading states - moved after all hooks
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-80 lg:w-1/4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 chat-sidebar
        border-r border-blue-200 dark:border-gray-700 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header Row */}
        <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 chat-header">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white hover:text-blue-100 dark:text-white dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer group"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="truncate pr-2">Career Guide AI</span>
            </button>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* User Avatar */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 hover:scale-105 transition-all duration-200 flex-shrink-0">
                <span className="text-gray-800 dark:text-white font-bold text-xs sm:text-sm lg:text-base">
                  {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
          
          {/* User Info and Sign Out Button */}
          <div className="mt-3 flex items-center justify-between">
            {/* Welcome Message - proper theming */}
            <div className="text-xs text-white dark:text-white truncate font-medium flex-1">
              Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
            </div>
            
            {/* Sign Out Button - proper theming */}
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-xs text-white dark:text-white hover:text-blue-100 dark:hover:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 px-2 py-1 h-auto font-medium transition-colors duration-200"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-300 dark:border-gray-600">
          <Button
            onClick={createNewChat}
            className="w-full justify-start gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base py-2 sm:py-2 lg:py-3 cursor-pointer min-h-[44px] bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">New Chat</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 lg:p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-24 lg:h-32">
              <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-1 lg:space-y-2">
              {chatSessions.map((session: ChatSession) => (
                <div
                  key={session.id}
                  onClick={() => selectChatSession(session.id)}
                  onMouseEnter={() => setHoveredSessionId(session.id)}
                  onMouseLeave={() => setHoveredSessionId(null)}
                  className={`p-2 lg:p-3 rounded-lg cursor-pointer transition-all duration-200 relative group ${activeSessionId === session.id
                    ? "bg-gray-300 dark:bg-gray-700 border border-gray-400 dark:border-gray-500 shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm"
                    }`}
                >
                  <div className="font-medium text-xs lg:text-sm text-black dark:!text-white truncate pr-8 group-hover:text-gray-800 dark:group-hover:!text-gray-100 transition-colors duration-200">
                    {session.title}
                  </div>
                  {session.lastMessage && (
                    <div className="text-xs text-gray-500 dark:text-gray-300 truncate mt-1 line-clamp-2 pr-8 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors duration-200">
                      {session.lastMessage}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 dark:text-gray-400 mt-1 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors duration-200">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </div>
                  
                  {/* Delete Button - appears on hover */}
                  {hoveredSessionId === session.id && (
                    <button
                      onClick={(e) => handleDeleteClick(e, session)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      title="Delete session"
                    >
                      <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-2 lg:p-4 border-t border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">Page {pagination.currentPage} of {pagination.totalPages}</span>
                <span className="sm:hidden">{pagination.currentPage}/{pagination.totalPages}</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                {pagination.totalCount} total
              </span>
            </div>
            <div className="flex gap-1 lg:gap-2">
              <Button
                onClick={goToPreviousPage}
                disabled={!pagination.hasPreviousPage}
                variant="outline"
                size="sm"
                className="flex-1 text-xs lg:text-sm py-1 lg:py-2 cursor-pointer"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              <Button
                onClick={goToNextPage}
                disabled={!pagination.hasNextPage}
                variant="outline"
                size="sm"
                className="flex-1 text-xs lg:text-sm py-1 lg:py-2 cursor-pointer"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col w-full lg:w-3/4">
        {children}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        sessionTitle={sessionToDelete?.title || ""}
        isDeleting={deleteSessionMutation.isPending}
      />
    </div>
  );
}