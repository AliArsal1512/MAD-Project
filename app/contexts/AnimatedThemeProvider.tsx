import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useThemeContext } from './ThemeContext';

const AnimatedThemeContext = createContext<any>(null);

export const useAnimatedTheme = () => {
  const context = useContext(AnimatedThemeContext);
  if (!context) {
    throw new Error('useAnimatedTheme must be used within an AnimatedThemeProvider');
  }
  return context;
};

// Helper to interpolate between two hex colors
function interpolateHexColor(progress: Animated.Value, color1: string, color2: string) {
  const c1 = color1.replace('#', '');
  const c2 = color2.replace('#', '');
  const r1 = parseInt(c1.substring(0, 2), 16);
  const g1 = parseInt(c1.substring(2, 4), 16);
  const b1 = parseInt(c1.substring(4, 6), 16);
  const r2 = parseInt(c2.substring(0, 2), 16);
  const g2 = parseInt(c2.substring(2, 4), 16);
  const b2 = parseInt(c2.substring(4, 6), 16);
  return progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      `rgb(${r1},${g1},${b1})`,
      `rgb(${r2},${g2},${b2})`
    ]
  });
}

const lightColors = {
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
};
const darkColors = {
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
};

export const AnimatedThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useThemeContext();
  const progress = useRef(new Animated.Value(theme === 'dark' ? 1 : 0)).current;
  const prevTheme = useRef(theme);

  useEffect(() => {
    if (theme !== prevTheme.current) {
      Animated.timing(progress, {
        toValue: theme === 'dark' ? 1 : 0,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
      prevTheme.current = theme;
    }
  }, [theme]);

  // Helper to get animated color for a key
  const animatedColor = (key: keyof typeof lightColors) => {
    return interpolateHexColor(progress, lightColors[key], darkColors[key]);
  };

  const animatedColors = Object.keys(lightColors).reduce((acc, key) => {
    acc[key] = animatedColor(key as keyof typeof lightColors);
    return acc;
  }, {} as Record<string, any>);

  return (
    <AnimatedThemeContext.Provider value={{ animatedColors, progress }}>
      {children}
    </AnimatedThemeContext.Provider>
  );
}; 