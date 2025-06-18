import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signUpCustomer } from "../apis/authApi";

export default function RegisterCustomer() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        gender: "customer",
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
    <LinearGradient
      colors={['#f3f4f6', '#ffffff']}
      className="flex-1"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center p-6">
          <View className="flex items-center mb-8">
            <Text className="text-4xl font-bold text-gray-800 mb-2">Create Account</Text>
            <Text className="text-lg text-gray-600">Join our community</Text>
          </View>
          
          <View className="space-y-4">
            <View className="relative">
              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                className="bg-white p-4 rounded-xl border border-gray-200 pl-12"
              />
              <Ionicons
                name="person-outline"
                size={20}
                color="#6b7280"
                style={{ position: 'absolute', left: 16, top: 16 }}
              />
            </View>
            
            <View className="relative">
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                className="bg-white p-4 rounded-xl border border-gray-200 pl-12"
                keyboardType="phone-pad"
              />
              <Ionicons
                name="call-outline"
                size={20}
                color="#6b7280"
                style={{ position: 'absolute', left: 16, top: 16 }}
              />
            </View>

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

            <View className="relative">
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="bg-white p-4 rounded-xl border border-gray-200 pl-12"
                secureTextEntry={!showConfirmPassword}
              />
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6b7280"
                style={{ position: 'absolute', left: 16, top: 16 }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: 16, top: 16 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            className="bg-blue-600 p-4 rounded-xl mt-8 shadow-lg"
            onPress={handleSignUp}
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>
          
          <View className="mt-6 flex-row justify-center items-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => router.back()}
              className="ml-1"
            >
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}