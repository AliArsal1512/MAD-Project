import React, { createContext, ReactNode, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../store/slices/themeSlice';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  isLight: boolean;
  isLoading: boolean;
  lastSyncError: string | null;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  refreshTheme: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    success: string;
    error: string;
    warning: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useTheme();

  const colors = {
    light: {
      background: '#ffffff',
      surface: '#f8f9fa',
      primary: '#3b82f6',
      secondary: '#6b7280',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      card: '#ffffff',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
    },
    dark: {
      background: '#111827',
      surface: '#1f2937',
      primary: '#3b82f6',
      secondary: '#9ca3af',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#374151',
      card: '#1f2937',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
    },
  };

  const currentColors = colors[themeHook.theme];

  const contextValue: ThemeContextType = {
    ...themeHook,
    colors: currentColors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}; 