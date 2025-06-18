import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { signUpSalon } from "../apis/authApi";

export default function RegisterSalon() {
  const router = useRouter();

  const [salon_name, setSalonName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
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
    if (!email || !password || !salon_name || !city || !address) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await signUpSalon({ email, password, salon_name, address, city });
  
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", "Salon account created!");
        router.replace("/auth/login_salon");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center p-6 bg-white">
            <View className="flex items-center">
              <Text className="text-3xl font-bold mb-2">Hi Salon Owner</Text>
              <Text className="text-xl font-bold mb-8">Register Your Salon</Text>
            </View>

            <TextInput
              placeholder="Salon Name"
              value={salon_name}
              onChangeText={setSalonName}
              className="border p-4 rounded-lg mb-4 bg-gray-100"
            />
            <TextInput
              placeholder="City"
              value={city}
              onChangeText={setCity}
              className="border p-4 rounded-lg mb-4 bg-gray-100"
            />
            <TextInput
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
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
              className="border p-4 rounded-lg mb-4 bg-gray-100"
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
              <TouchableOpacity onPress={() => router.replace("/auth/login_salon")}>
                <Text className="text-blue-500">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
