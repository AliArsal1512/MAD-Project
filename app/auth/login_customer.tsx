import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser } from "../apis/authApi";
import { saveExpoPushToken } from "../utils/saveExpoPushToken";
import { usePushToken } from "../utils/usePushToken";

// import { supabase } from "@/lib/supabase";

export default function LoginCustomer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const pushToken = usePushToken();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/role");
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert("Validation Error", "Please enter both email and password.");
  //     return;
  //   }
  
  //   try {
  //     setLoading(true);
  
  //     const result = await loginUser(email, password);
  
  //     setLoading(false);
  
  //     if (result.error) {
  //       Alert.alert("Login Failed", result.error);
  //     } else {
  //       Alert.alert("Success", "Login successful!");
  //       // ✅ Navigate to home/dashboard after login
  //       router.replace("/Customer/BookAppointment"); // change route if you want a specific screen
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Unexpected login error:", error);
  //     Alert.alert("Error", "Something went wrong. Please try again.");
  //   }
  // };


const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Validation Error", "Please enter both email and password.");
    return;
  }

  try {
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.error) {
      Alert.alert("Login Failed", result.error);
    } else {
      const userId = result.user?.id;

      if (userId && pushToken) {
        await saveExpoPushToken(userId, pushToken, false);
      }

      router.replace("/Customer/BookAppointment");
    }
  } catch (error) {
    setLoading(false);
    console.error("Unexpected login error:", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};


  return (
    <LinearGradient
      colors={['#f3f4f6', '#ffffff']}
      className="flex-1"
    >
      <View className="flex-1 justify-center p-6">
        {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.replace('/role')} // Use your actual route name for role.tsx
        style={{
          padding: 10,
          backgroundColor: '#eee',
          borderRadius: 5,
          alignSelf: 'flex-start',
          marginBottom: 20,
        }}
      >
        <Text>← Back</Text>
      </TouchableOpacity>
        <View className="flex items-center mb-12">
          <Text className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</Text>
          <Text className="text-lg text-gray-600">Sign in to continue</Text>
        </View>
        
        <View className="space-y-4">
          <View className="relative">
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="bg-white p-4 rounded-xl border border-gray-200 pl-12"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons
              name="mail-outline"
              size={20}
              color="#6b7280"
              style={{ position: 'absolute', left: 16, top: 16 }}
            />
          </View>
          
          <View className="relative">
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              className="bg-white p-4 rounded-xl border border-gray-200 pl-12"
              secureTextEntry={!showPassword}
            />
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6b7280"
              style={{ position: 'absolute', left: 16, top: 16 }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 16, top: 16 }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-600 p-4 rounded-xl mt-8 shadow-lg"
          disabled={loading}
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Sign In
            </Text>
          )}
        </TouchableOpacity>
        
        <View className="mt-6 flex-row justify-center items-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() => router.push("/auth/register_customer")}
            className="ml-1"
          >
            <Text className="text-blue-600 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}