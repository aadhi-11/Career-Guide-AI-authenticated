// Import Next.js metadata type for SEO configuration
import type { Metadata } from "next";
// Import Clerk authentication provider and components
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
// Import Google Fonts for typography
import { Geist, Geist_Mono } from "next/font/google";
// Import global CSS styles
import "./globals.css";
// Import custom providers for tRPC and theme management
import { TRPCProvider } from "@/lib/trpc-provider";
import { ThemeProvider } from "@/lib/theme-provider";

// Configure Geist Sans font with CSS variable
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font with CSS variable
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata for the application
export const metadata: Metadata = {
  title: "AI Career Guide",
  description: "Get personalized career guidance powered by AI",
};

// Viewport configuration for responsive design
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Root Layout Component
 * 
 * This is the root layout that wraps all pages in the application.
 * It provides the necessary providers and global configurations.
 * 
 * Features:
 * - Clerk authentication provider for user management
 * - Theme provider for dark/light mode switching
 * - tRPC provider for type-safe API calls
 * - Font configuration with Geist fonts
 * - Global CSS and responsive design setup
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Clerk provider wraps the entire app for authentication
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* Theme provider enables dark/light mode switching */}
          <ThemeProvider>
            {/* tRPC provider enables type-safe API calls throughout the app */}
            <TRPCProvider>
              {/* Main content wrapper with full height */}
              <div className="min-h-screen">
                {children}
              </div>
            </TRPCProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
