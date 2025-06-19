import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useThemeContext } from './contexts/ThemeContext';

export default function IndexPage() {
  const router = useRouter();
  const { colors } = useThemeContext();

  const slideAnim = useRef(new Animated.Value(50)).current; // Start below
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start invisible

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to /role after animation finishes
      setTimeout(() => {
        router.replace('/role'); // Replace prevents going back to splash
      }, 500); // Optional delay before navigating
    });
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 24, 
      backgroundColor: colors.background 
    }}>
      <Animated.Text
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          color: colors.text,
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        WELCOME TO DIGI BARBER
      </Animated.Text>
    </View>
  );
}
