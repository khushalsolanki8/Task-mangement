'use client';

import React, { useState } from 'react';
import { UserCheck, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface LoginPageProps {
  onGuestLogin: () => Promise<void>;
  isLoading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGuestLogin, isLoading = false }) => {
  const [error, setError] = useState<string | null>(null);

  const handleGuestClick = async () => {
    setError(null);
    try {
      await onGuestLogin();
    } catch (err) {
      setError('Failed to initiate guest session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-main flex items-center justify-center p-4">
      {/* Figma Blocks / Login-01 Container */}
      <div className="w-full max-w-md bg-surface border border-theme rounded-2xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent text-white shadow-md mb-1">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-main">Let&apos;s get back on track</h1>
          <p className="text-xs text-secondary leading-relaxed">
            Welcome to the Task Management System assessment workspace. Access all features directly via guest authentication.
          </p>
        </div>

        {/* Guest Login Action Card */}
        <div className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 dark:text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
            onClick={handleGuestClick}
            className="py-3 text-sm font-semibold shadow-md"
          >
            Continue as Guest
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-muted pt-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Instant sandbox guest session. No password required.</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-theme pt-4 text-center">
          <p className="text-[10px] text-muted">
            Task Management System • Senior UI/UX Technical Assessment
          </p>
        </div>
      </div>
    </div>
  );
};
