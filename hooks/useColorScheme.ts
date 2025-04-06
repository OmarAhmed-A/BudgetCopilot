import { useThemeContext } from '@/context/ThemeContext';

/**
 * Custom hook that returns the theme value from our ThemeContext
 * This hook replaces the default React Native useColorScheme
 * to support manual theme switching
 */
export function useColorScheme() {
  const { theme } = useThemeContext();
  return theme;
}
