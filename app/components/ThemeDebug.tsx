import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { updateUserTheme } from '../apis/themeApi';
import { useThemeContext } from '../contexts/ThemeContext';

export const ThemeDebug: React.FC = () => {
  const { 
    theme, 
    isDark, 
    isLoading, 
    lastSyncError, 
    toggleTheme, 
    refreshTheme 
  } = useThemeContext();

  const testManualUpdate = async () => {
    try {
      const newTheme = isDark ? 'light' : 'dark';
      console.log('🧪 Testing manual theme update to:', newTheme);
      const result = await updateUserTheme(newTheme);
      console.log('🧪 Manual update result:', result);
      Alert.alert('Test Result', `Manual update: ${result.success ? 'Success' : 'Failed'}\n${result.error || ''}`);
    } catch (error) {
      console.error('🧪 Manual update error:', error);
      Alert.alert('Test Error', 'Manual update failed');
    }
  };

  return (
    <View style={{
      position: 'absolute',
      top: 50,
      right: 10,
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 10,
      borderRadius: 8,
      zIndex: 1000,
    }}>
      <Text style={{ color: 'white', fontSize: 12 }}>
        Theme: {theme}
      </Text>
      <Text style={{ color: 'white', fontSize: 12 }}>
        Loading: {isLoading ? 'Yes' : 'No'}
      </Text>
      {lastSyncError && (
        <Text style={{ color: 'red', fontSize: 10 }}>
          Error: {lastSyncError}
        </Text>
      )}
      <TouchableOpacity 
        onPress={toggleTheme}
        style={{
          backgroundColor: 'blue',
          padding: 5,
          borderRadius: 4,
          marginTop: 5,
        }}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>
          Toggle
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={refreshTheme}
        style={{
          backgroundColor: 'green',
          padding: 5,
          borderRadius: 4,
          marginTop: 2,
        }}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>
          Refresh
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={testManualUpdate}
        style={{
          backgroundColor: 'orange',
          padding: 5,
          borderRadius: 4,
          marginTop: 2,
        }}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>
          Test DB
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 