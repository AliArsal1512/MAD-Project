import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import "../global.css";
import { ThemeProvider, useThemeContext } from "./contexts/ThemeContext";
import { store } from "./store";

function ThemedStack() {
  const { colors, isDark } = useThemeContext();
  
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { 
            backgroundColor: colors.background,
          }
        }} 
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </Provider>
  );
}
