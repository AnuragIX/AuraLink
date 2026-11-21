export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'auralink-theme';

export function isValidTheme(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function resolveInitialTheme(
  storedValue: string | null | undefined,
  systemPrefersDark: boolean,
): ThemeMode {
  if (isValidTheme(storedValue)) {
    return storedValue;
  }
  return systemPrefersDark ? 'dark' : 'light';
}

export function getNextTheme(current: ThemeMode): ThemeMode {
  return current === 'dark' ? 'light' : 'dark';
}
