import { View, Text, TextInput, TouchableOpacity, BackHandler, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { signUpCustomer } from "../apis/authApi";

export default function RegisterCustomer() {
  const router = useRouter();
const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/role");
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleSignUp = async () => {
    try {
      if (!fullName || !phone || !email || !password || !confirmPassword) {
        Alert.alert("Validation Error", "All fields are required.");
        return;
      }
  
      if (password !== confirmPassword) {
        Alert.alert("Password Mismatch", "Passwords do not match.");
        return;
      }
  
      setLoading(true);
  
      const result = await signUpCustomer({
        email,
        password,
        name: fullName,
        phone,
        gender: "customer", // or "male"/"female"/"other" if you're collecting it later
      });
  
      setLoading(false);
  
      if (result.error) {
        Alert.alert("Sign Up Failed", result.error);
      } else {
        Alert.alert("Success", "Account created successfully!");
        router.replace("/auth/login_customer");
      }
    } catch (error) {
      setLoading(false);
      console.error("Unexpected error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  


  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="flex items-center">
        <Text className="text-3xl font-bold mb-2">Hi there</Text>
        <Text className="text-xl font-bold mb-8">Welcome to Registration form</Text>
      </View>
      
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        className="border p-4 rounded-lg mb-4 bg-gray-100"
      />
      
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        className="border p-4 rounded-lg mb-4 bg-gray-100"
      />

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

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="border p-4 rounded-lg mb-6 bg-gray-100"
        secureTextEntry
      />
      
      <TouchableOpacity 
        className="bg-blue-500 p-4 rounded-lg"
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold">
          {loading ? "Creating Account..." : "Create Account"}
        </Text>
      </TouchableOpacity>
      
      <View className="mt-4 flex-row justify-center">
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}