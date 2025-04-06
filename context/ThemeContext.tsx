import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  setIsSystemTheme: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useNativeColorScheme() || 'light';
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [theme, setTheme] = useState<ThemeType>(systemColorScheme as ThemeType);

  // Load saved theme preferences
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedIsSystemTheme = await AsyncStorage.getItem('isSystemTheme');
        
        if (savedIsSystemTheme !== null) {
          const useSystemTheme = savedIsSystemTheme === 'true';
          setIsSystemTheme(useSystemTheme);
          
          if (useSystemTheme) {
            setTheme(systemColorScheme as ThemeType);
          } else if (savedTheme !== null) {
            setTheme(savedTheme as ThemeType);
          }
        }
      } catch (e) {
        console.error('Error loading theme preferences', e);
      }
    };
    
    loadThemePreferences();
  }, [systemColorScheme]);

  // Update theme when system theme changes if using system theme
  useEffect(() => {
    if (isSystemTheme) {
      setTheme(systemColorScheme as ThemeType);
    }
  }, [systemColorScheme, isSystemTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    saveThemePreference(newTheme, false);
  };

  const saveThemePreference = async (newTheme: ThemeType, useSystem: boolean) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      await AsyncStorage.setItem('isSystemTheme', useSystem.toString());
      setIsSystemTheme(useSystem);
    } catch (e) {
      console.error('Error saving theme preference', e);
    }
  };

  const setThemeWithSave = (newTheme: ThemeType) => {
    setTheme(newTheme);
    saveThemePreference(newTheme, false);
  };

  const setIsSystemThemeWithSave = (useSystem: boolean) => {
    saveThemePreference(useSystem ? systemColorScheme as ThemeType : theme, useSystem);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme: setThemeWithSave, 
        toggleTheme, 
        isSystemTheme,
        setIsSystemTheme: setIsSystemThemeWithSave
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};