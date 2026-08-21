'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, AccentColor } from '@/types';

interface ThemeContextType {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [accentColor, setAccentColorState] = useState<AccentColor>('blue');

  // Synchronize initial state with DOM attributes set by inline script
  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const currentAccent = (root.getAttribute('data-accent') as AccentColor) || 'blue';

    setThemeModeState(isDark ? 'dark' : 'light');
    setAccentColorState(currentAccent);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme_mode', mode);
    } catch (e) {}
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    const root = document.documentElement;
    root.setAttribute('data-accent', color);
    try {
      localStorage.setItem('accent_color', color);
    } catch (e) {}
  };

  return (
    <ThemeContext.Provider value={{ themeMode, accentColor, setThemeMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
