import { View, Text, TextInput, TouchableOpacity, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";


export default function Login_baber() {
const router = useRouter();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true; // prevent default behavior
    });

    return () => backHandler.remove();
  }, []);

  return (
    <View className="flex-1 justify-center p-6 bg-white">

      <View className="flex items-center p-2">
      <Text className="text-3xl font-bold mb-2">Hi Barber </Text>
      <Text className="text-xl font-bold mb-8">Welcome to Login</Text>
      </View>
      
      <TextInput
        placeholder="Email"
        className="border p-4 rounded-lg mb-4 bg-gray-100"
        keyboardType="email-address"
      />
      
      <TextInput
        placeholder="Password"
        className="border p-4 rounded-lg mb-6 bg-gray-100"
        secureTextEntry
      />
      
      <TouchableOpacity onPress={() => router.push("/Barber/Appointments")}
      className="bg-blue-500 p-4 rounded-lg">
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>
      
      <View className="mt-4 flex-row justify-center">
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register_barber")}>
            <Text className="text-blue-500">SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}