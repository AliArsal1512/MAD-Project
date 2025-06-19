import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Animated } from 'react-native';
import { Provider } from "react-redux";
import "../global.css";
import { AnimatedThemeProvider, useAnimatedTheme } from "./contexts/AnimatedThemeProvider";
import { ThemeProvider, useThemeContext } from "./contexts/ThemeContext";
import { store } from "./store";

function ThemedStack() {
  const { colors, isDark } = useThemeContext();
  const { animatedColors } = useAnimatedTheme() || {};

  return (
    <Animated.View style={{ flex: 1, backgroundColor: animatedColors?.background || colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent', // Let Animated.View handle the background
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </Animated.View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AnimatedThemeProvider>
          <ThemedStack />
        </AnimatedThemeProvider>
      </ThemeProvider>
    </Provider>
  );
}
