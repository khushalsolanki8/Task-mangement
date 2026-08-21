'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, header, footer, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl border border-theme bg-surface text-main shadow-xs transition-all ${
          hoverable ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer' : ''
        } ${className}`}
        {...props}
      >
        {header && <div className="px-4 py-3 border-b border-theme font-semibold text-sm">{header}</div>}
        <div className="p-4">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-theme text-xs text-muted">{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';
