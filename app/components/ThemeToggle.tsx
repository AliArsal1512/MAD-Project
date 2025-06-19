import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  compact?: boolean;
  showSyncStatus?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = true, 
  compact = false,
  showSyncStatus = false
}) => {
  const { 
    theme, 
    isDark, 
    toggleTheme, 
    colors, 
    isLoading, 
    lastSyncError,
    refreshTheme 
  } = useThemeContext();

  if (compact) {
    return (
      <TouchableOpacity
        onPress={toggleTheme}
        disabled={isLoading}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 8,
          borderWidth: 1,
          borderColor: colors.border,
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? (
          <ActivityIndicator size={16} color={colors.text} />
        ) : (
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={20}
            color={colors.text}
          />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={24}
          color={colors.text}
          style={{ marginRight: 12 }}
        />
        {showLabel && (
          <View style={{ flex: 1 }}>
            <Text style={{ 
              color: colors.text, 
              fontSize: 16, 
              fontWeight: '600' 
            }}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Text style={{ 
              color: colors.textSecondary, 
              fontSize: 14 
            }}>
              {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            </Text>
            
            {showSyncStatus && lastSyncError && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginTop: 4 
              }}>
                <Ionicons 
                  name="warning" 
                  size={14} 
                  color={colors.error} 
                  style={{ marginRight: 4 }}
                />
                <Text style={{ 
                  color: colors.error, 
                  fontSize: 12 
                }}>
                  Sync failed
                </Text>
                <TouchableOpacity 
                  onPress={refreshTheme}
                  style={{ marginLeft: 8 }}
                >
                  <Ionicons 
                    name="refresh" 
                    size={14} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isLoading && (
          <ActivityIndicator 
            size={16} 
            color={colors.primary} 
            style={{ marginRight: 8 }}
          />
        )}
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          disabled={isLoading}
          trackColor={{ 
            false: colors.border, 
            true: colors.primary 
          }}
          thumbColor={isDark ? colors.surface : colors.background}
          ios_backgroundColor={colors.border}
        />
      </View>
    </View>
  );
}; 