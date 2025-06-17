import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginUser } from "../apis/authApi"; 
import { usePushToken } from "../utils/usePushToken";
import { saveExpoPushToken } from "../utils/saveExpoPushToken";


export default function LoginBarber() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const pushToken = usePushToken();

  // Exit app on back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert("Missing Fields", "Please fill in all required fields.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const result = await loginUser(email, password);

  //     if (result.error) {
  //       Alert.alert("Login Failed", result.error);
  //       return;
  //     }

  //     // Optional: Add role-based check if needed
  //     // For now assume login is for salon
  //     router.replace("/Salon/Profile");
  //   } catch (err: any) {
  //     Alert.alert("Error", err.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
  
    setLoading(true);
    try {
      const result = await loginUser(email, password);
  
      if (result.error) {
        Alert.alert("Login Failed", result.error);
        return;
      }
  
      const userId = result?.user?.id || result?.data?.user?.id;
  
      // ✅ Save push token to salons table
      if (userId && pushToken) {
        await saveExpoPushToken(userId, pushToken, true); // true = salon
      }
  
      router.replace("/Salon/Profile");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="flex items-center p-2">
        <Text className="text-3xl font-bold mb-2">Hi Barber</Text>
        <Text className="text-xl font-bold mb-8">Welcome to Login</Text>
      </View>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border p-4 rounded-lg mb-4 bg-gray-100"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        className="border p-4 rounded-lg mb-6 bg-gray-100"
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 p-4 rounded-lg"
        disabled={loading}
      >
        <Text className="text-white text-center font-bold">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center">
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register_salon")}>
          <Text className="text-blue-500">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
