import { View, Text, TextInput, TouchableOpacity, BackHandler, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterCustomer() {
  const router = useRouter();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
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
    setLoading(true);
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // 2. Add to users table with 'customer' role
      const { error: userError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user.id, 
          email, 
          role: 'customer' 
        }]);

      if (userError) throw userError;

      // 3. Create customer profile
      const { error: profileError } = await supabase
        .from('customers')
        .insert([{
          user_id: authData.user.id,
          first_name,
          last_name,
          phone,
        }]);

      if (profileError) throw profileError;

      Alert.alert("Success", "Customer account created successfully!");
      router.replace("/auth/login_customer");
    } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else if (typeof error === "object" && error !== null && "message" in error) {
          Alert.alert("Error", String((error as any).message));
        } else {
          Alert.alert("Error", JSON.stringify(error)); // fallback
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="flex items-center">
        <Text className="text-3xl font-bold mb-2">Hi there</Text>
        <Text className="text-xl font-bold mb-8">Welcome to Registration form</Text>
      </View>
      
      <TextInput
        placeholder="First Name"
        value={first_name}
        onChangeText={setFirstName}
        className="border p-4 rounded-lg mb-4 bg-gray-100"
      />

      <TextInput
        placeholder="Last Name"
        value={last_name}
        onChangeText={setLastName}
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