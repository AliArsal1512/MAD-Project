import React from 'react';
import { View, ViewProps } from 'react-native';
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
  const { colors } = useThemeContext();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'surface':
        return colors.surface;
      case 'card':
        return colors.card;
      default:
        return colors.background;
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: getBackgroundColor(),
          ...(bordered && {
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}; 