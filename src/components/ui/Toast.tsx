'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'error';
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'success',
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-theme shadow-2xl animate-in slide-in-from-bottom duration-200">
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      )}
      <span className="text-xs font-semibold text-main">{message}</span>
      <button
        onClick={onClose}
        className="p-1 text-muted hover:text-main rounded-md hover:bg-surface-hover transition-colors cursor-pointer ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
