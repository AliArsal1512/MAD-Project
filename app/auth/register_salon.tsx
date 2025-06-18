import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
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
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={['#f3f4f6', '#ffffff']}
            className="flex-1"
          >
            <View className="flex-1 justify-center p-6">
              <View className="flex items-center mb-8">
                <Text className="text-4xl font-bold text-gray-800 mb-2">Register Salon</Text>
                <Text className="text-lg text-gray-600">Create your salon account</Text>
              </View>

              <View className="space-y-4">
                <View className="relative">
                  <TextInput
                    placeholder="Salon Name"
                    value={salon_name}
                    onChangeText={setSalonName}
                    className="bg-white p-4 rounded-xl border border-gray-200 pl-12"
                  />
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color="#6b7280"
                    style={{ position: 'absolute', left: 16, top: 16 }}
                  />
                </View>

                <View className="relative">
                  <TextInput
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                    className="bg-white p-4 rounded-xl border border-gray-200 pl-12"
                  />
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#6b7280"
                    style={{ position: 'absolute', left: 16, top: 16 }}
                  />
                </View>

                <View className="relative">
                  <TextInput
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                    className="bg-white p-4 rounded-xl border border-gray-200 pl-12"
                  />
                  <Ionicons
                    name="map-outline"
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
                  onPress={() => router.replace("/auth/login_salon")}
                  className="ml-1"
                >
                  <Text className="text-blue-600 font-semibold">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
