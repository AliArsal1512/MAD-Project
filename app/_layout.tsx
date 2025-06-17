import { Stack } from "expo-router";
import "../global.css";
import { Provider } from "react-redux";
import { store } from "./store"; // make sure this path is correct

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
    </Provider>
  );
}
