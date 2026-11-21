import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  ThemeMode,
  getNextTheme,
  isValidTheme,
  resolveInitialTheme,
} from '../utils/theme';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  reducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getSystemReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() =>
    resolveInitialTheme(readStoredTheme(), getSystemPrefersDark()),
  );
  const [hasExplicitPreference, setHasExplicitPreference] = useState<boolean>(() =>
    isValidTheme(readStoredTheme()),
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => getSystemReducedMotion());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (event: MediaQueryListEvent) => {
      if (!hasExplicitPreference) {
        setThemeState(event.matches ? 'dark' : 'light');
      }
    };
    colorSchemeQuery.addEventListener('change', handleColorSchemeChange);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      colorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [hasExplicitPreference]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    setHasExplicitPreference(true);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Ignore storage quota or restricted iframe storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = getNextTheme(prev);
      setHasExplicitPreference(true);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, reducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return ctx;
}
