'use client';

import React from 'react';
import { Flag } from 'lucide-react';
import { TaskPriority } from '@/types';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'priority' | 'secondary';
  priority?: TaskPriority;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  priority,
  className = '',
}) => {
  if (variant === 'priority' && priority) {
    const priorityConfig = {
      urgent: { label: 'Urgent', bg: 'bg-red-100 dark:bg-red-950/60', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-900' },
      high: { label: 'High', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-900' },
      medium: { label: 'Medium', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900' },
      low: { label: 'Low', bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900' },
      no_priority: { label: 'No Priority', bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' },
    };

    const config = priorityConfig[priority];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}>
        <Flag className="w-3 h-3 fill-current shrink-0" />
        <span>{children || config.label}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-hover text-secondary border border-theme ${className}`}>
      {children}
    </span>
  );
};
