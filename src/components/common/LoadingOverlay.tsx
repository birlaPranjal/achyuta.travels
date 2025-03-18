'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Loading...',
  fullScreen = false,
  className,
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300',
        fullScreen ? 'h-screen w-screen' : 'absolute',
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-8 shadow-xl">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="text-center text-lg font-medium text-gray-700">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay; 