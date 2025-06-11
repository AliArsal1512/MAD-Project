import { View, Text, TextInput, TouchableOpacity, BackHandler, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginBarber() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Login failed");

      // 2. Verify user is a barber
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;
      if (userData?.role !== 'barber') {
        await supabase.auth.signOut();
        throw new Error("Only barbers can login here");
      }

      // 3. Get barber profile
      const { data: barberData, error: barberError } = await supabase
        .from('barbers')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (barberError) throw barberError;

      // Success - redirect to barber dashboard
      router.replace("/Barber/Appointments");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", String(error));
      }
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
        <TouchableOpacity onPress={() => router.push("/auth/register_barber")}>
          <Text className="text-blue-500">SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}