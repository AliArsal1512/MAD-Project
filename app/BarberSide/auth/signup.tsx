import { View, Text, TextInput, TouchableOpacity, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const router = useRouter();

export default function Signup() {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        router.replace("/role"); // Assuming your role screen path is /role.tsx
        return true;
        });

        return () => backHandler.remove();
    }, []);

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8">Sign Up</Text>
      
      <TextInput
        placeholder="Name"
        className="border p-4 rounded-lg mb-4 bg-gray-100"
      />
      
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
      
      <TouchableOpacity className="bg-blue-500 p-4 rounded-lg">
        <Text className="text-white text-center font-bold">Create Account</Text>
      </TouchableOpacity>
      
      <View className="mt-4 flex-row justify-center">
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/")}>
            <Text className="text-blue-500">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}