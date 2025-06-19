import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signUpCustomer } from "../apis/authApi";
import { useThemeContext } from "../contexts/ThemeContext";

export default function RegisterCustomer() {
  const router = useRouter();
  const { colors, isDark } = useThemeContext();
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

  const gradientColors = isDark 
    ? ['#1f2937', '#111827'] as const
    : ['#f3f4f6', '#ffffff'] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          flexGrow: 1,
          backgroundColor: 'transparent'
        }}
      >
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          padding: 24 
        }}>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={{ 
              color: colors.text,
              fontSize: 32, 
              fontWeight: 'bold', 
              marginBottom: 8 
            }}>
              Create Account
            </Text>
            <Text style={{ 
              color: colors.textSecondary,
              fontSize: 18 
            }}>
              Join our community
            </Text>
          </View>
          
          <View style={{ gap: 16 }}>
            <View style={{ position: 'relative' }}>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                value={fullName}
                onChangeText={setFullName}
                style={{
                  backgroundColor: colors.card,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingLeft: 48,
                  color: colors.text,
                }}
              />
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.textSecondary}
                style={{ position: 'absolute', left: 16, top: 16 }}
              />
            </View>
            
            <View style={{ position: 'relative' }}>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor={colors.textSecondary}
                value={phone}
                onChangeText={setPhone}
                style={{
                  backgroundColor: colors.card,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingLeft: 48,
                  color: colors.text,
                }}
                keyboardType="phone-pad"
              />
              <Ionicons
                name="call-outline"
                size={20}
                color={colors.textSecondary}
                style={{ position: 'absolute', left: 16, top: 16 }}
              />
            </View>

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

            <View style={{ position: 'relative' }}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={{
                  backgroundColor: colors.card,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingLeft: 48,
                  color: colors.text,
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textSecondary}
                style={{ position: 'absolute', left: 16, top: 16 }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: 16, top: 16 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
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
            onPress={handleSignUp}
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
                Create Account
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
              Already have an account? 
            </Text>
            <TouchableOpacity 
              onPress={() => router.push("/auth/login_customer")}
              style={{ marginLeft: 4 }}
            >
              <Text style={{ 
                color: colors.primary, 
                fontWeight: '600' 
              }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}