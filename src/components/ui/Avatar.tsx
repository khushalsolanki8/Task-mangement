'use client';

import React from 'react';
import { User as UserType } from '@/types';

export interface AvatarProps {
  user: UserType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-accent text-white font-semibold shrink-0 ring-2 ring-surface ${sizeStyles[size]} ${className}`}
      title={`${user.name} (${user.email})`}
    >
      {user.initials}
    </div>
  );
};

export interface AvatarGroupProps {
  users: UserType[];
  max?: number;
  size?: 'sm' | 'md';
  onAddMember?: () => void;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = 'sm',
  onAddMember,
}) => {
  const visibleUsers = users.slice(0, max);
  const extraCount = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visibleUsers.map((user) => (
        <Avatar key={user.id} user={user} size={size} />
      ))}
      {extraCount > 0 && (
        <div
          className={`relative inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-secondary font-medium shrink-0 ring-2 ring-surface ${
            size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'
          }`}
        >
          +{extraCount}
        </div>
      )}
      {onAddMember && (
        <button
          onClick={onAddMember}
          className={`relative inline-flex items-center justify-center rounded-full border border-dashed border-gray-400 dark:border-gray-600 text-muted hover:text-main hover:border-main bg-surface shrink-0 ml-1 transition-colors cursor-pointer ${
            size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
          }`}
          title="Add member"
        >
          +
        </button>
      )}
    </div>
  );
};
