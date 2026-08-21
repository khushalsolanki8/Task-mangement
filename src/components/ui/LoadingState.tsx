'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  type?: 'spinner' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading tasks...',
  type = 'skeleton',
}) => {
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3 text-muted">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 animate-pulse p-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-md w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 bg-gray-200 dark:bg-gray-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-xs w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-xs w-1/2"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
