'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { authApi } from '@/services/api';
import { MOCK_USERS } from '@/data/mockData';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  // Validate existing session token on refresh
  const checkAuthStatus = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAuthenticating(false);
      return;
    }

    try {
      const profile = await authApi.getMe();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (err) {
      // Fallback local guest session if server is offline
      setUser(MOCK_USERS[0]);
      setIsAuthenticated(true);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Initiate guest login
  const loginAsGuest = async () => {
    setIsAuthenticating(true);
    try {
      const res = await authApi.guestLogin();
      localStorage.setItem('auth_token', res.accessToken);
      setUser(res.user);
      setIsAuthenticated(true);
    } catch (err) {
      // Fallback guest login
      localStorage.setItem('auth_token', 'mock_guest_token_2026');
      setUser(MOCK_USERS[0]);
      setIsAuthenticated(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Logout session
  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isAuthenticating,
    loginAsGuest,
    logout,
  };
}
