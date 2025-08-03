'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DevModeOnlyProps {
  children: React.ReactNode;
}

export function DevModeOnly({ children }: DevModeOnlyProps) {
  const [isDevMode, setIsDevMode] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we're in development mode
    // In client components, we can't directly access process.env.NODE_ENV
    // So we'll make a request to check
    const checkDevMode = async () => {
      try {
        const response = await fetch('/api/check-dev-mode');
        const data = await response.json();
        setIsDevMode(data.isDevelopment);
        
        if (!data.isDevelopment) {
          // Redirect to home page after 3 seconds if not in dev mode
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to check development mode:', error);
        setIsDevMode(false);
      }
    };

    checkDevMode();
  }, [router]);

  if (isDevMode === null) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isDevMode === false) {
    // Not in development mode
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h2 className="text-lg font-bold mb-2">Development Mode Only</h2>
          <p className="mb-4">
            This page is only available in development mode. You will be redirected to the home page in a few seconds.
          </p>
        </div>
      </div>
    );
  }

  // In development mode, render children
  return <>{children}</>;
}