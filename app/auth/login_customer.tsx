import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser } from "../apis/authApi";
import { useThemeContext } from "../contexts/ThemeContext";
import { saveExpoPushToken } from "../utils/saveExpoPushToken";
import { usePushToken } from "../utils/usePushToken";

// import { supabase } from "@/lib/supabase";

export default function LoginCustomer() {
  const router = useRouter();
  const { colors, isDark } = useThemeContext();
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

const gradientColors = isDark 
  ? ['#1f2937', '#111827'] as const
  : ['#f3f4f6', '#ffffff'] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={{ flex: 1 }}
    >
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        padding: 24,
        backgroundColor: 'transparent'
      }}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.replace('/role')}
          style={{
            padding: 10,
            backgroundColor: colors.surface,
            borderRadius: 5,
            alignSelf: 'flex-start',
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: colors.text }}>← Back</Text>
        </TouchableOpacity>
        
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ 
            color: colors.text,
            fontSize: 32, 
            fontWeight: 'bold', 
            marginBottom: 8 
          }}>
            Welcome Back
          </Text>
          <Text style={{ 
            color: colors.textSecondary,
            fontSize: 18 
          }}>
            Sign in to continue
          </Text>
        </View>
        
        <View style={{ gap: 16 }}>
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              style={{
                backgroundColor: colors.card,
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingLeft: 48,
                color: colors.text,
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textSecondary}
              style={{ position: 'absolute', left: 16, top: 16 }}
            />
          </View>
          
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              style={{
                backgroundColor: colors.card,
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingLeft: 48,
                color: colors.text,
              }}
              secureTextEntry={!showPassword}
            />
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textSecondary}
              style={{ position: 'absolute', left: 16, top: 16 }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 16, top: 16 }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            marginTop: 32,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 18
            }}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>
        
        <View style={{ 
          marginTop: 24, 
          flexDirection: 'row', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <Text style={{ color: colors.textSecondary }}>
            Don't have an account? 
          </Text>
          <TouchableOpacity 
            onPress={() => router.push("/auth/register_customer")}
            style={{ marginLeft: 4 }}
          >
            <Text style={{ 
              color: colors.primary, 
              fontWeight: '600' 
            }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}