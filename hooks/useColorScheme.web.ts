import { useState, useEffect } from 'react';
import { useThemeContext } from '@/context/ThemeContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 * This hook also integrates with our ThemeContext to support manual theme switching
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { theme } = useThemeContext();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return theme;
  }

  return 'light';
}
