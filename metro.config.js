const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// 1. Get Expo's default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// 2. Extend it with NativeWind
const config = withNativeWind(defaultConfig, { 
  input: "./global.css",
});

// 3. Export the final config
module.exports = config;