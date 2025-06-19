import React from 'react';
import { Animated, ViewProps } from 'react-native';
import { useAnimatedTheme } from '../contexts/AnimatedThemeProvider';
import { useThemeContext } from '../contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  variant?: 'background' | 'surface' | 'card';
  bordered?: boolean;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ 
  variant = 'background', 
  bordered = false, 
  style, 
  children, 
  ...props 
}) => {
  const { animatedColors } = useAnimatedTheme() || {};
  const { colors } = useThemeContext();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'surface':
        return animatedColors?.surface || colors.surface;
      case 'card':
        return animatedColors?.card || colors.card;
      default:
        return animatedColors?.background || colors.background;
    }
  };

  return (
    <Animated.View
      style={[
        {
          backgroundColor: getBackgroundColor(),
          ...(bordered && {
            borderWidth: 1,
            borderColor: animatedColors?.border || colors.border,
          }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}; 