import React from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';

interface ThemedTextProps extends TextProps {
  variant?: 'primary' | 'secondary' | 'title' | 'body' | 'caption';
  color?: string;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
  variant = 'body', 
  color,
  style, 
  children, 
  ...props 
}) => {
  const { colors } = useThemeContext();

  const getTextColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'secondary':
        return colors.textSecondary;
      case 'title':
        return colors.text;
      case 'body':
        return colors.text;
      case 'caption':
        return colors.textSecondary;
      default:
        return colors.text;
    }
  };

  const getFontSize = () => {
    switch (variant) {
      case 'title':
        return 24;
      case 'body':
        return 16;
      case 'caption':
        return 14;
      default:
        return 16;
    }
  };

  const getFontWeight = () => {
    switch (variant) {
      case 'title':
        return 'bold';
      case 'body':
        return 'normal';
      case 'caption':
        return 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <Text
      style={[
        {
          color: getTextColor(),
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}; 