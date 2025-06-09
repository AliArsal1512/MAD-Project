import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexPage() {
  const router = useRouter();

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
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <Animated.Text
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }}
        className="text-2xl font-bold mb-8"
      >
        WELCOME TO DIGI BARBER
      </Animated.Text>
    </View>
  );
}
