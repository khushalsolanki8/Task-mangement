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

  useEffect(() => {
    // Load persisted preferences if available
    const savedTheme = localStorage.getItem('theme_mode') as ThemeMode;
    const savedAccent = localStorage.getItem('accent_color') as AccentColor;
    if (savedTheme) setThemeModeState(savedTheme);
    if (savedAccent) setAccentColorState(savedAccent);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    const root = document.documentElement;
    // Set accent color data attribute
    root.setAttribute('data-accent', accentColor);
    localStorage.setItem('accent_color', accentColor);
  }, [accentColor]);

  const setThemeMode = (mode: ThemeMode) => setThemeModeState(mode);
  const setAccentColor = (color: AccentColor) => setAccentColorState(color);

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
