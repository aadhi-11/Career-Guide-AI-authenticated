"use client";

// Import Clerk authentication components for user management
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
// Import UI components for buttons and styling
import { Button } from "@/components/ui/button";
// Import Lucide React icons for visual elements
import { ArrowRight, Brain, MessageSquare, Zap, Shield, Users } from "lucide-react";
// Import Next.js Link component for client-side navigation
import Link from "next/link";

/**
 * Home/Landing Page Component
 * 
 * This is the main landing page that serves as the entry point for users.
 * It displays the application's value proposition, features, and authentication options.
 * 
 * Features:
 * - Responsive design that works on all devices
 * - Dynamic authentication state handling
 * - Gradient backgrounds and modern UI elements
 * - Feature showcase with icons and descriptions
 */
export default function Home() {
  // Get user authentication state from Clerk
  const { isSignedIn, isLoaded } = useUser();

  // Show loading spinner while Clerk is initializing user state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Transparent Navbar with backdrop blur effect */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and brand name */}
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">CareerGuide AI</span>
            </div>
            
            {/* Authentication buttons - show different options based on user state */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                // Show user button if user is signed in
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              ) : (
                // Show sign in/up buttons if user is not signed in
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area with responsive padding for mobile navbar */}
      <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 relative pt-20 sm:pt-0">
        {/* Background gradient patterns for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        
        {/* Main content container with centered text */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Hero heading with gradient text effect */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Your AI Career Guide
          </h1>
          
          {/* Subtitle describing the application's purpose */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get personalized career advice, explore opportunities, and plan your professional journey with AI-powered insights.
          </p>
          
          {/* Call-to-action button - different based on authentication state */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {isSignedIn ? (
              // If user is signed in, show button to start chatting
              <Link href="/chat">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3">
                  Start Chatting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              // If user is not signed in, show sign up button
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
            )}
          </div>
          
          {/* Features showcase grid - responsive 3-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* AI Conversations feature card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <MessageSquare className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-white">AI Conversations</h3>
              <p className="text-gray-300">Chat with our AI to get personalized career advice and guidance.</p>
            </div>
            
            {/* Instant Insights feature card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <Zap className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-white">Instant Insights</h3>
              <p className="text-gray-300">Get immediate answers to your career questions and concerns.</p>
            </div>
            
            {/* Security feature card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <Shield className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-white">Secure & Private</h3>
              <p className="text-gray-300">Your conversations are secure and your data is protected.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
